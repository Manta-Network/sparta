import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Identicon from '@polkadot/react-identicon';

import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { decodeAddress } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';

import BigNumber from 'bignumber.js';
import Metric from './metric/Metric';

import { dateDiff } from './utils';

const wsProvider = new WsProvider('wss://ws.calamari.systems');

function AccountDetail() {
  const params = useParams();
  const [account, setAccount] = useState({
    ss58: params.ss58,
    hex: u8aToHex(decodeAddress(params.ss58)),
    balance: {
      loading: true,
    },
    session: {
      loading: true,
    },
  });
  useEffect(() => {
    if (!!account.ss58 && !account.icon) {
      fetch(`https://raw.githubusercontent.com/Manta-Network/sparta/main/calamari.json`)
        .then(response => response.json())
        .then((collators) => {
          const { status } = collators.find((c) => c.ss58 === account.ss58);
          setAccount((a) => ({
            ...a,
            status,
            icon: {
              class: (status === 'invulnerable')
                ? `bi bi-shield-lock-fill`
                : (status === 'active')
                  ? `bi bi-shield-shaded`
                  : (status === 'candidate')
                    ? `bi bi-shield-check`
                    : `bi bi-shield`,
              title: (status === 'invulnerable')
                ? `invulnerable collator`
                : (status === 'active')
                  ? `active collator`
                  : (status === 'candidate')
                    ? `candidate collator`
                    : `applicant`,
            },
          }));
        })
        .catch(console.error);
    }
  }, [account.ss58, account.icon]);
  const [metrics, setMetrics] = useState({
    calamari: {
      loading: true
    },
    kusama: {
      loading: true
    },
  });
  useEffect(() => {
    if (!!params.ss58) {
      ApiPromise.create({ provider: wsProvider })
        .then((api) => {
          api.query.system.account(params.ss58)
            .then(
              ({ nonce, data: balance }) => {
                const free = BigNumber(balance.free).dividedBy(1e12);
                const reserved = BigNumber(balance.reserved).dividedBy(1e12);
                setAccount((a) => ({
                  ...a,
                  balance: {
                    free,
                    reserved,
                    icon: {
                      class: (reserved >= 400000)
                        ? `bi bi-lock-fill text-success`
                        : (free >= 400000)
                          ? `bi bi-unlock-fill text-success`
                          : `bi bi-unlock text-danger`,
                      title: (reserved >= 400000)
                        ? new Intl.NumberFormat().format(reserved)
                        : new Intl.NumberFormat().format(free)
                    },
                    loading: false,
                  },
                  nonce
                }));
              }
            ).catch((error) => {
              setAccount((a) => ({
                ...a,
                balance: {
                  error,
                  loading: false,
                }
              }));
            });
          api.query.session.nextKeys(params.ss58)
            .then(
              (nextKeys) => {
                const sessionKeys = (nextKeys.isSome)
                  ? nextKeys.unwrap()
                  : {};
                setAccount((a) => ({
                  ...a,
                  session: {
                    ...(nextKeys.isSome) && { ...sessionKeys },
                    icon: {
                      class: (nextKeys.isSome)
                        ? `bi bi-link-45deg text-success`
                        : `bi bi-link-45deg text-danger`,
                      title: (nextKeys.isSome)
                        ? sessionKeys.aura.toString()
                        : `no session key binding`
                    },
                    loading: false,
                  }
                }));
              }
            ).catch((error) => {
              setAccount((a) => ({
                ...a,
                session: {
                  error,
                  icon: {
                    class: `bi bi-link-45deg text-danger`,
                    title: `no session key binding`
                  },
                  loading: false,
                }
              }));
            });
        })
        .catch(console.error);
      ['calamari', 'kusama'].forEach((chain) => {
        fetch(
          `https://metrics.sparta.pelagos.systems/${params.ss58}/${chain}.json`,
          {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
          .then(response => response.json())
          .then((chainMetrics) => {
            const blockHeightMetrics = chainMetrics.find((m) => m.name === 'substrate_block_height');
            const block = {
              height: {
                help: blockHeightMetrics.help,
                best: Number(blockHeightMetrics.metrics.find((h) => h.labels.status === 'best').value),
                finalized: Number(blockHeightMetrics.metrics.find((h) => h.labels.status === 'finalized').value),
                target: Number(blockHeightMetrics.metrics.find((h) => h.labels.status === 'sync_target').value),
              }
            };
            setMetrics((m) => ({
              ...m,
              [chain]: {
                metrics: chainMetrics,
                process: {
                  start: new Date(Number(chainMetrics.find((m) => m.name === 'substrate_process_start_time_seconds').metrics[0].value) * 1000),
                },
                block,
                sync: {
                  icon: {
                    class: ((block.height.target - block.height.best) <= 10)
                      ? `bi bi-arrow-repeat text-success`
                      : `bi bi-arrow-repeat text-warning`,
                    title: `${block.height.best} / ${block.height.target}`
                  },
                },
                loading: false,
              }
            }));
          })
          .catch((error) => {
            setMetrics((m) => ({
              ...m,
              [chain]: {
                error,
                loading: false,
              }
            }));
          });
      });
      return () => {
        setAccount((a) => (a));
        setMetrics((m) => (m));
      };
    }
  }, [params.ss58]);
  return (
    <>
      <Row>
        <h2>
          <Identicon value={account.ss58} theme={`substrate`} title={account.ss58} /> {account.ss58}
        </h2>
      </Row>
      <Row>
        <Table>
          <thead>
            <tr>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>status</th>
              <td>
                {
                  !account.icon
                    ? (
                        <Spinner animation="border" variant="secondary" size="sm">
                          <span className="visually-hidden">collator status lookup in progress</span>
                        </Spinner>
                      )
                    : (
                        <span>
                          <i className={account.icon.class} title={account.icon.title} style={{marginRight: '0.5em'}}></i>
                          {account.icon.title}
                        </span>
                      )
                }
              </td>
            </tr>
            <tr>
              <th>balance</th>
              <td>
                {
                  !!account.balance.loading
                    ? (
                        <Spinner animation="border" variant="secondary" size="sm">
                          <span className="visually-hidden">balance lookup in progress</span>
                        </Spinner>
                      )
                    : (
                        <span>
                          <i className={account.balance.icon.class} title={account.balance.icon.title} style={{marginRight: '0.5em'}}></i>
                          <span style={{marginRight: '0.5em'}}>
                            reserved: {Intl.NumberFormat().format(account.balance.reserved)}
                          </span>
                          <span style={{marginRight: '0.5em'}}>
                            free: {Intl.NumberFormat().format(account.balance.free)}
                          </span>
                        </span>
                      )
                }
              </td>
            </tr>
            <tr>
              <th>session</th>
              <td>
                {
                  !!account.session.loading
                    ? (
                        <Spinner animation="border" variant="secondary" size="sm">
                          <span className="visually-hidden">session keys lookup in progress</span>
                        </Spinner>
                      )
                    : (
                        <span>
                          <i className={account.session.icon.class} title={account.session.icon.title}></i>
                          <span style={{marginRight: '0.5em'}}>
                            {account.session.icon.title}
                          </span>
                        </span>
                      )
                }
              </td>
            </tr>
            <tr>
              <th>uptime</th>
              <td>
                {
                  (!metrics.calamari || !!metrics.calamari.loading)
                    ? (
                        <Spinner animation="border" variant="secondary" size="sm">
                          <span className="visually-hidden">process start lookup in progress</span>
                        </Spinner>
                      )
                    : !!metrics.calamari.error
                      ? (
                          <i className={`bi bi-exclamation-circle text-danger`} title={`${metrics.calamari.error}`}></i>
                        )
                      : (
                          <span>
                            <i className="bi bi-clock-history" title={new Intl.DateTimeFormat().format(metrics.calamari.process.start)} style={{marginRight: '0.5em'}}></i>
                            <span style={{marginRight: '0.5em'}}>
                              {dateDiff(metrics.calamari.process.start, null, null)}
                            </span>
                            <span style={{marginRight: '0.5em'}}>
                              - process started: {new Intl.DateTimeFormat('en', { dateStyle: 'full', timeStyle: 'full' }).format(metrics.calamari.process.start)}
                            </span>
                          </span>
                        )
                }
              </td>
            </tr>
            {
              ['calamari', 'kusama'].map((chain, i) => (
                <tr key={i}>
                  <th>{chain} sync</th>
                  <td>
                    {
                      (!metrics[chain] || !!metrics[chain].loading)
                        ? (
                            <Spinner animation="border" variant="secondary" size="sm">
                              <span className="visually-hidden">{chain} metrics lookup in progress</span>
                            </Spinner>
                          )
                        : !!metrics[chain].error
                          ? (
                              <i className={`bi bi-exclamation-circle text-danger`} title={`${metrics[chain].error}`}></i>
                            )
                          : (
                              <span>
                                <i className={metrics[chain].sync.icon.class} title={metrics[chain].sync.icon.title} style={{marginRight: '0.5em'}}></i>
                                <span style={{marginRight: '0.5em'}}>
                                  best: {metrics[chain].block.height.best}
                                </span>
                                <span style={{marginRight: '0.5em'}}>
                                  finalized: {metrics[chain].block.height.finalized}
                                </span>
                                <span style={{marginRight: '0.5em'}}>
                                  target: {metrics[chain].block.height.target}
                                </span>
                              </span>
                              
                            )
                    }
                  </td>
                </tr>
              ))
            }
          </tbody>
        </Table>
        {
          ['calamari', 'kusama'].map((chain, i) => (
            <Table key={i}>
              <thead>
                <tr>
                  <th colSpan={2}>{chain} metrics</th>
                </tr>
              </thead>
              <tbody>
                {
                  (!metrics[chain] || !!metrics[chain].loading)
                    ? (
                        <tr>
                          <th>metrics</th>
                          <td>
                            <Spinner animation="border" variant="secondary" size="sm">
                              <span className="visually-hidden">calamari metrics lookup in progress</span>
                            </Spinner>
                          </td>
                        </tr>
                      )
                    : !!metrics[chain].error
                      ? (
                          <tr>
                            <th>metrics</th>
                            <td>
                              <i className={`bi bi-exclamation-circle text-danger`} title={`${metrics.calamari.error}`}></i>
                            </td>
                          </tr>
                        )
                      : (
                          metrics[chain].metrics.map((metric, i) => (
                            <tr key={i}>
                              <td>
                                <strong>
                                  {metric.name.replaceAll('_', ' ')}
                                </strong>
                                <br />
                                {metric.type.toLowerCase()}: {metric.help.toLowerCase()}
                              </td>
                              <td>
                                <Metric {...metric} />
                              </td>
                            </tr>
                          ))
                        )
                }
              </tbody>
            </Table>
          ))
        }
      </Row>
    </>
  );
}

export default AccountDetail;
