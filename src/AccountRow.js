import { useEffect, useState } from 'react';
import Identicon from '@polkadot/react-identicon';

import Spinner from 'react-bootstrap/Spinner';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { decodeAddress } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';

import BigNumber from 'bignumber.js';

const wsProvider = new WsProvider('wss://ws.calamari.systems');

function AccountRow(props) {
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
          : (props.collator.status === 'cabdidate')
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
  useEffect(() => {
    if (!!props.collator.ss58) {
      async function fetchData() {
        const api = await ApiPromise.create({ provider: wsProvider });
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
      }
      fetchData();
      return () => {
        setAccount((a) => (a));
      };
    }
  }, [props.collator.ss58]);
  return (
    <tr>
      <td>
        <Identicon value={account.ss58} size={20} theme={`substrate`} title={account.ss58} /> {account.ss58}
      </td>
      <td>
        <i className={account.icon.class} title={account.icon.title}></i>
      </td>
      <td>
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
      <td style={{textAlign:'right'}}>
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
    </tr>
  );
}

export default AccountRow;
