import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Identicon from '@polkadot/react-identicon';

import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Tab from 'react-bootstrap/Tab';
import Table from 'react-bootstrap/Table';
import Tabs from 'react-bootstrap/Tabs';

import { decodeAddress } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';

import BigNumber from 'bignumber.js';
import Metric from './metric/Metric';

import { dateDiff } from './utils';

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
  const [alerts, setAlerts] = useState({
    calamari: {
      loading: true
    },
    kusama: {
      loading: true
    },
  });
  useEffect(() => {
    if (!!account.ss58 && !account.icon) {
      fetch(`https://raw.githubusercontent.com/Manta-Network/sparta/main/calamari.json`)
        .then(response => response.json())
        .then((collators) => {
          const { metrics, status, balance, session } = collators.find((c) => c.ss58 === account.ss58);
          const free = (!!balance.free) ? BigNumber(balance.free).dividedBy(1e12) : 0;
          const reserved = (!!balance.reserved) ? BigNumber(balance.reserved).dividedBy(1e12) : 0;
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
            session: {
              ...(!!session && !!session.aura) && { ...session },
              icon: {
                class: (!!session && !!session.aura)
                  ? `bi bi-link-45deg text-success`
                  : `bi bi-link-45deg text-danger`,
                title: (!!session && !!session.aura)
                  ? session.aura.toString()
                  : `no session key binding`
              },
              loading: false,
            }
          }));
          Object.keys(metrics).forEach((chain) => {
            if (!!metrics[chain]) {
              const metricsUrl = new URL(metrics[chain]);
              const instance = `${metricsUrl.hostname}${(!!metricsUrl.port) ? `:${metricsUrl.port}` : (metricsUrl.protocol === 'https:') ? `:443` : ''}`;
              fetch(`https://am.pulse.pelagos.systems/api/v2/alerts?filter=instance%3D%22${instance}%22`)
                .then(response => response.json())
                .then((alerts) => {
                  setAlerts((a) => ({
                    ...a,
                    [chain]: {
                      alerts,
                      loading: false,
                    }
                  }));
                })
                .catch((error) => {
                  setAlerts((a) => ({
                    ...a,
                    [chain]: {
                      error,
                      loading: false,
                    }
                  }));
                });
            } else {
              setAlerts((a) => ({
                ...a,
                [chain]: {
                  error: `${chain} metrics endpoint unknown`,
                  loading: false,
                }
              }));
            }
          })
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
      Object.keys(metrics).forEach((chain) => {
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
                name: chainMetrics.find((m) => m.name === 'substrate_build_info').metrics[0].labels.name,
                version: chainMetrics.find((m) => m.name === 'substrate_build_info').metrics[0].labels.version,
                metrics: chainMetrics,
                process: {
                  start: new Date(Number(chainMetrics.find((m) => m.name === 'substrate_process_start_time_seconds').metrics[0].value) * 1000),
                },
                block,
                sync: {
                  icon: {
                    class: `bi bi-arrow-repeat text-${((block.height.target - block.height.best) <= 10) ? 'success' : 'warning'}`,
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
  }, [metrics, params.ss58]);
  return (
    <Fragment>
      <Row>
        <h2>
          <Identicon value={account.ss58} theme={`substrate`} title={account.ss58} /> {account.ss58}
        </h2>
      </Row>
      <Row>
        <Table>
          <thead>
            {
              Object.keys(metrics).map((chain, i) => (
                <tr key={i}>
                  <th>{chain}</th>
                  <th>
                    {metrics[chain].name}
                    <span className="text-muted" style={{marginLeft: '0.5em'}}>
                      {metrics[chain].version}
                    </span>
                  </th>
                </tr>
              ))
            }
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
              Object.keys(metrics).map((chain, i) => (
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
            {
              Object.keys(alerts).map((chain, i) => (
                <tr key={i}>
                  <th>{chain} alerts</th>
                  <td>
                    {
                      !!alerts[chain].loading
                        ? (
                            <Spinner animation="border" variant="secondary" size="sm">
                              <span className="visually-hidden">{chain} alerts lookup in progress</span>
                            </Spinner>
                          )
                        : !!alerts[chain].error
                          ? (
                              <i className={`bi bi-exclamation-circle text-danger`} title={`${alerts[chain].error}`}></i>
                            )
                          : !!alerts[chain].alerts.length
                            ? alerts[chain].alerts.map((alert) => (
                                <span>
                                  <a key={alert.fingerprint} href={alert.generatorURL}>
                                    <i className={`bi bi-exclamation-diamond-fill text-${(alert.labels.severity === 'critical') ? 'danger' : 'warning'}`} title={
                                      !!alert.annotations.message
                                        ? alert.annotations.message
                                        : !!alert.annotations.description
                                          ? alert.annotations.description
                                          : alert.annotations.summary}></i>
                                  </a>
                                  <span style={{marginLeft: '0.5em'}}>
                                    {
                                      !!alert.annotations.message
                                        ? alert.annotations.message
                                        : !!alert.annotations.description
                                          ? alert.annotations.description
                                          : alert.annotations.summary
                                    }
                                  </span>
                                  <br />
                                </span>
                              ))
                            : (
                                <span>
                                  <i className={`bi bi-activity text-success`} title={`no active ${chain} alerts`}></i>
                                  <span style={{marginLeft: '0.5em'}}>
                                    no active {chain} alerts
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
        <Tabs defaultActiveKey="calamari">
          {
            Object.keys(metrics).map((chain, cI) => (
              <Tab key={cI} eventKey={chain} title={
                (
                  <span>
                    {chain} metrics
                  </span>
                )
              }>
                {
                  (!!metrics[chain].metrics)
                    ? (
                        <Accordion defaultActiveKey={metrics[chain].metrics[0].name}>
                          {
                            metrics[chain].metrics.map((metric, mI) => (
                              <Accordion.Item key={mI} eventKey={metric.name}>
                                <Accordion.Header>
                                  {metric.type.toLowerCase()}: {metric.name.replace('polkadot_', '').replace('substrate_', '').replaceAll('_', ' ')}
                                </Accordion.Header>
                                <Accordion.Body>
                                  {metric.help.toLowerCase()}
                                  <Metric {...metric} />
                                </Accordion.Body>
                              </Accordion.Item>
                            ))
                          }
                        </Accordion>
                      )
                    : null
                }
              </Tab>
            ))
          }
        </Tabs>
      </Row>
    </Fragment>
  );
}

export default AccountDetail;
