import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Identicon from '@polkadot/react-identicon';

import Spinner from 'react-bootstrap/Spinner';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { decodeAddress } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';

import BigNumber from 'bignumber.js';

const wsProvider = new WsProvider('wss://ws.calamari.systems');

function AccountRow(props) {
  const navigate = useNavigate();
  const [account, setAccount] = useState({
    ss58: props.collator.ss58,
    hex: u8aToHex(decodeAddress(props.collator.ss58)),
    balance: {
      loading: true,
    },
    session: {
      loading: true,
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
  });
  const [metrics, setMetrics] = useState({
    calamari: {
      loading: true
    },
    kusama: {
      loading: true
    },
  });
  useEffect(() => {
    if (!!props.collator.ss58) {
      ApiPromise.create({ provider: wsProvider })
        .then((api) => {
          api.query.system.account(props.collator.ss58)
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
          api.query.session.nextKeys(props.collator.ss58)
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
  }, [props.collator.ss58]);
  return (
    <tr onClick={() => navigate(`/${account.ss58}`)}>
      <td>
        <Identicon value={account.ss58} size={20} theme={`substrate`} title={account.ss58} />
        <span style={{cursor: 'pointer', marginLeft: '0.5em'}}>{account.ss58}</span>
      </td>
      <td style={{textAlign:'center', cursor: 'pointer'}}>
        <i className={account.icon.class} title={account.icon.title}></i>
      </td>
      <td style={{textAlign:'center', cursor: 'pointer'}}>
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
      <td style={{textAlign:'center', cursor: 'pointer'}}>
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
      <td style={{textAlign:'center', cursor: 'pointer'}}>
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
                  <i className={metrics.calamari.sync.icon.class} title={metrics.calamari.sync.icon.title}></i>
                )
        }
      </td>
      <td style={{textAlign:'center', cursor: 'pointer'}}>
        {
          !!metrics.kusama.loading
            ? (
                <Spinner animation="border" variant="secondary" size="sm">
                  <span className="visually-hidden">kusama metrics lookup in progress</span>
                </Spinner>
              )
            : !!metrics.kusama.error
              ? (
                  <i className={`bi bi-exclamation-circle text-danger`} title={`${metrics.kusama.error}`}></i>
                )
              : (
                  <i className={metrics.kusama.sync.icon.class} title={metrics.kusama.sync.icon.title}></i>
                )
        }
      </td>
    </tr>
  );
}

export default AccountRow;
