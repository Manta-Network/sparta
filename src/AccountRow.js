import { useEffect, useState } from 'react';
import Identicon from '@polkadot/react-identicon';

import Spinner from 'react-bootstrap/Spinner';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { decodeAddress } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';

import BigNumber from 'bignumber.js';

const wsProvider = new WsProvider('wss://ws.calamari.systems');
//const wsProvider = new WsProvider('ws://127.0.0.1:9144');

function AccountRow(props) {
  const [account, setAccount] = useState({
    ss58: props.ss58,
    hex: u8aToHex(decodeAddress(props.ss58))
  });
  
  useEffect(() => {
    if (!!props.ss58) {
      async function fetchData() {
        const api = await ApiPromise.create({ provider: wsProvider });
        api.query.system.account(props.ss58).then(
          ({ nonce, data: balance }) => {
            setAccount((a) => ({
              ...a,
              balance,
              nonce
            }));
          }
        );
        api.query.session.nextKeys(props.ss58).then(
          (nextKeys) => {
            setAccount((a) => ({
              ...a,
              session: {
                ...(nextKeys.isNone) && { unbound: true },
                ...(nextKeys.isSome) && { ...nextKeys.unwrap() },
              }
            }));
          }
        );
      }
      fetchData();
      return () => {
        setAccount((a) => (a));
      };
    }
  }, [props.ss58]);
  return (
    <tr>
      <td>
        <Identicon value={account.ss58} size={20} theme={`substrate`} title={account.ss58} /> {account.ss58}
      </td>
      <td>
        {
          !!account.session
            ? !!account.session.unbound
              ? <i className="bi bi-link-45deg text-danger" title={`no session key binding`}></i>
              : <i className="bi bi-link-45deg text-success" title={account.session.aura.toString()}></i>
            : (
                <Spinner animation="border" variant="secondary" size="sm">
                  <span className="visually-hidden">aura lookup in progress</span>
                </Spinner>
              )
        }
      </td>
      <td style={{textAlign:'right'}}>
        {
          account.balance
            ? (BigNumber(account.balance.reserved).dividedBy(1e12) >= 400000)
              ? (
                  <i className="bi bi-lock-fill text-success" title={new Intl.NumberFormat().format(BigNumber(account.balance.reserved).dividedBy(1e12))}></i>
                )
              : (BigNumber(account.balance.free).dividedBy(1e12) >= 400000)
                ? (
                    <i className="bi bi-unlock-fill text-success" title={new Intl.NumberFormat().format(BigNumber(account.balance.free).dividedBy(1e12))}></i>
                  )
                : (
                    <i className="bi bi-unlock text-danger" title={new Intl.NumberFormat().format(BigNumber(account.balance.free).dividedBy(1e12))}></i>
                  )
            : (
                <Spinner animation="border" variant="secondary" size="sm">
                  <span className="visually-hidden">balance lookup in progress</span>
                </Spinner>
              )
        }
      </td>
    </tr>
  );
}

export default AccountRow;
