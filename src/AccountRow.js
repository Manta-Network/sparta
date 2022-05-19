import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Identicon from '@polkadot/react-identicon';

import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';

import { decodeAddress } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';

import BigNumber from 'bignumber.js';

import { dateDiff } from './utils';

function getFlag(countryCode) {
  return String.fromCodePoint(...[...countryCode.toUpperCase()].map(c => c.charCodeAt() + 0x1F1A5));
}

function AccountRow(props) {
  const navigate = useNavigate();
  const balance = {
    free: (!!props.collator.balance.free) ? BigNumber(props.collator.balance.free).dividedBy(1e12) : 0,
    reserved: (!!props.collator.balance.reserved) ? BigNumber(props.collator.balance.reserved).dividedBy(1e12) : 0
  };
  const [account, setAccount] = useState({
    ss58: props.collator.ss58,
    hex: u8aToHex(decodeAddress(props.collator.ss58)),
    ssl: {
      calamari: props.collator.metrics.calamari.startsWith('https://') ? 1 : props.collator.metrics.calamari.startsWith('http://') ? 0 : -1,
      kusama: props.collator.metrics.kusama.startsWith('https://') ? 1 : props.collator.metrics.kusama.startsWith('http://') ? 0 : -1,
    },
    balance: {
      ...balance,
      icon: {
        class: (balance.reserved >= 400000)
          ? `bi bi-lock-fill text-success`
          : (balance.free >= 400000)
            ? `bi bi-unlock-fill text-success`
            : `bi bi-unlock text-danger`,
        title: (balance.reserved >= 400000)
          ? new Intl.NumberFormat().format(balance.reserved)
          : new Intl.NumberFormat().format(balance.free)
      },
      loading: false,
    },
    session: {
      ...props.collator.session,
      icon: {
        class: (!!props.collator.session && !!props.collator.session.aura)
          ? `bi bi-link-45deg text-success`
          : `bi bi-link-45deg text-danger`,
        title: (!!props.collator.session && !!props.collator.session.aura)
          ? props.collator.session.aura.toString()
          : `no session key binding`
      },
      loading: false,
    },
    icon: {
      class: (props.collator.status === 'invulnerable')
        ? `bi bi-shield-lock-fill`
        : (props.collator.status === 'active')
          ? `bi bi-shield-shaded`
          : (props.collator.status === 'candidate')
            ? `bi bi-shield-check`
            : `bi bi-shield`,
      title: (props.collator.status === 'invulnerable')
        ? `invulnerable collator`
        : (props.collator.status === 'active')
          ? `active collator`
          : (props.collator.status === 'candidate')
            ? `candidate collator`
            : `applicant`,
    },
    ...(!!props.collator.location) && {
      location: {
        ...props.collator.location,
        flag: getFlag(props.collator.location.country.code),
      },
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
  const [metrics, setMetrics] = useState({
    calamari: {
      loading: true
    },
    kusama: {
      loading: true
    },
  });
  const [outages, setOutages] = useState({
    calamari: {
      loading: true
    },
    kusama: {
      loading: true
    },
  });
  useEffect(() => {
    if (!!props.collator.ss58) {
      ['calamari', 'kusama'].forEach((chain) => {
        if (!!props.collator.metrics[chain]) {
          const metricsUrl = new URL(props.collator.metrics[chain]);
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
          const encodedQuery = encodeURIComponent(`changes(ALERTS_FOR_STATE{alertname="offline",instance="${instance}"}[10d])`);
          fetch(`https://pulse.pelagos.systems/api/v1/query?query=${encodedQuery}`)
            .then(response => response.json())
            .then((outages) => {
              setOutages((o) => ({
                ...o,
                [chain]: {
                  outages: (!!outages.data.result.length) ? parseInt(outages.data.result[0].value[1]) : 0,
                  loading: false,
                }
              }));
            })
            .catch((error) => {
              setOutages((o) => ({
                ...o,
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
          setOutages((o) => ({
            ...o,
            [chain]: {
              error: `${chain} metrics endpoint unknown`,
              loading: false,
            }
          }));
        }
        fetch(
          `https://metrics.sparta.pelagos.systems/${props.collator.ss58}/${chain}.json`,
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
        setAlerts((a) => (a));
        setMetrics((m) => (m));
      };
    }
  }, [props.collator.ss58, props.collator.metrics]);
  return (
    <tr>
      <td>
        <Identicon value={account.ss58} size={20} theme={`substrate`} title={account.ss58} />
        <span style={{marginLeft: '0.5em'}}>{account.ss58}</span>
        <br />
        {
          (!!account.location)
            ? (
                <span title={`${account.location.city.name}, ${account.location.country.name}`} style={{marginRight: '0.5em'}}>
                  {account.location.flag}
                </span>
              )
            : null
        }
        {
          (!!metrics.calamari.name)
            ? (
                <strong>{metrics.calamari.name}</strong>
              )
            : null
        }
        {
          (!!metrics.kusama.name && (metrics.calamari.name !== metrics.kusama.name))
            ? ` / ${metrics.kusama.name}`
            : null
        }
      </td>
      <td onClick={() => navigate(`/${account.ss58}`)} style={{cursor: 'pointer'}}>
        {
          (!!metrics.calamari.version)
            ? `${metrics.calamari.version.split('-')[0]}-${metrics.calamari.version.split('-')[1]}`
            : null
        }
      </td>
      <td onClick={() => navigate(`/${account.ss58}`)} style={{textAlign:'center', cursor: 'pointer'}}>
        <i className={account.icon.class} title={account.icon.title}></i>
      </td>
      <td onClick={() => navigate(`/${account.ss58}`)} style={{textAlign:'center', cursor: 'pointer'}}>
        {
          !!account.balance.loading
            ? (
                <Spinner animation="border" variant="secondary" size="sm">
                  <span className="visually-hidden">balance lookup in progress</span>
                </Spinner>
              )
            : (
                <i className={account.balance.icon.class} title={account.balance.icon.title}></i>
              )
        }
      </td>
      <td onClick={() => navigate(`/${account.ss58}`)} style={{textAlign:'center', cursor: 'pointer'}}>
        {
          !!account.session.loading
            ? (
                <Spinner animation="border" variant="secondary" size="sm">
                  <span className="visually-hidden">session keys lookup in progress</span>
                </Spinner>
              )
            : (
                <i className={account.session.icon.class} title={account.session.icon.title}></i>
              )
        }
      </td>
      <td onClick={() => navigate(`/${account.ss58}`)} style={{textAlign:'center', cursor: 'pointer'}}>
        {
          Object.keys(metrics).map((chain) => (
            !!metrics[chain].loading
              ? (
                  <Spinner animation="border" variant="secondary" size="sm" key={chain}>
                    <span className="visually-hidden">{chain} metrics lookup in progress</span>
                  </Spinner>
                )
              : !!metrics[chain].error
                ? (
                    <i className={`bi bi-exclamation-circle text-danger`} title={`${metrics[chain].error}`} key={chain}></i>
                  )
                : (
                    <i className={metrics[chain].sync.icon.class} title={metrics[chain].sync.icon.title} key={chain}></i>
                  )
          ))
        }
      </td>
      <td onClick={() => navigate(`/${account.ss58}`)} style={{textAlign:'center', cursor: 'pointer'}}>
        {
          Object.keys(alerts).map((chain) => (
            !!alerts[chain].loading
              ? (
                  <Spinner animation="border" variant="secondary" size="sm" key={chain}>
                    <span className="visually-hidden">{chain} alerts lookup in progress</span>
                  </Spinner>
                )
              : !!alerts[chain].error
                ? (
                    <i className={`bi bi-exclamation-circle text-danger`} title={`${alerts[chain].error}`} key={chain}></i>
                  )
                : (
                    <div key={chain}>
                      {
                        !!alerts[chain].alerts.length
                        ? alerts[chain].alerts.map((alert) => (
                            <a key={alert.fingerprint} href={alert.generatorURL}>
                              <i className={`bi bi-exclamation-diamond-fill text-${(alert.labels.severity === 'critical') ? 'danger' : 'warning'}`} title={!!alert.annotations.message
                                ? alert.annotations.message
                                : !!alert.annotations.description
                                  ? alert.annotations.description
                                  : alert.annotations.summary}></i>
                            </a>
                          ))
                        : (
                            <i className={`bi bi-activity text-success`} title={`no active ${chain} alerts`}></i>
                          )
                      }
                    </div>
                  )
          ))
        }
      </td>
      <td onClick={() => navigate(`/${account.ss58}`)} style={{textAlign:'center', cursor: 'pointer'}}>
        {
          Object.keys(account.ssl).map((chain) => (
            (account.ssl[chain] === 1)
              ? (
                  <i className={`bi bi-shield-fill-check text-success`} title={`${chain} ssl metrics url`} key={chain}></i>
                )
              : (account.ssl[chain] === 0)
                ? (
                    <i className={`bi bi-shield-x text-warning`} title={`${chain} http metrics url`} key={chain}></i>
                  )
                : (
                    <i className={`bi bi-exclamation-circle text-danger`} title={`no ${chain} metrics url`}></i>
                  )
          ))
        }
      </td>
      <td onClick={() => navigate(`/${account.ss58}`)} style={{textAlign:'center', cursor: 'pointer'}}>
        {
          !!metrics.calamari.loading
            ? (
                <Spinner animation="border" variant="secondary" size="sm">
                  <span className="visually-hidden">calamari metrics lookup in progress</span>
                </Spinner>
              )
            : !!metrics.calamari.error
              ? (
                  <i className={`bi bi-exclamation-circle text-danger`} title={`${metrics.calamari.error}`}></i>
                )
              : (
                  <span>
                    {dateDiff(metrics.calamari.process.start, null, 'significant')}
                  </span>
                )
        }
        <br />
        {
          Object.keys(outages).map((chain) => (
            !!outages[chain].loading
              ? (
                  <Spinner animation="border" variant="secondary" size="sm" key={chain}>
                    <span className="visually-hidden">{chain} outages lookup in progress</span>
                  </Spinner>
                )
              : !!outages[chain].error
                ? (
                    <i className={`bi bi-exclamation-circle text-danger`} title={`${outages[chain].error}`} key={chain}></i>
                  )
                : (
                    <Badge key={chain} title={`${outages[chain].outages} ${chain} outages in the last 10 days`} pill bg={
                      (outages[chain].outages === 0)
                        ? 'success'
                        : (outages[chain].outages < 3)
                          ? 'warning'
                          : 'danger'
                    }>
                      {outages[chain].outages}
                    </Badge>
                  )
          ))
        }
      </td>
    </tr>
  );
}

export default AccountRow;
