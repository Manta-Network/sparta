import { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import AccountRow from './AccountRow';

import BigNumber from 'bignumber.js';

function AccountsTable() {
  const [collators, setCollators] = useState([]);
  useEffect(() => {
    if (!collators.length) {
      fetch(`https://raw.githubusercontent.com/Manta-Network/sparta/main/calamari.json`)
        .then(response => response.json())
        .then((collators) => setCollators(collators.filter((c) => (BigNumber(c.balance.free).dividedBy(1e12) >= 400000 || BigNumber(c.balance.reserved).dividedBy(1e12) >= 400000 || c.status === 'invulnerable') && c.metrics.calamari.startsWith('https://'))))
        .catch(console.error);
    }
  }, [collators.length]);
  return (
    <>
      <Row>
        <h2>calamari collators and eligible applicants</h2>
      </Row>
      <Row>
        <Table striped size="sm">
          <thead>
            <tr>
              <th>
                account
              </th>
              <th>
                node
              </th>
              <th>
                version
              </th>
              <th style={{textAlign:'center'}}>
                status
              </th>
              <th style={{textAlign:'center'}}>
                bond
              </th>
              <th style={{textAlign:'center'}}>
                session
              </th>
              <th style={{textAlign:'center'}}>
                sync
              </th>
              <th style={{textAlign:'center'}}>
                alerts
              </th>
              <th style={{textAlign:'center'}}>
                up
              </th>
            </tr>
          </thead>
          <tbody>
            {collators.map((collator) => (<AccountRow key={collator.ss58} collator={collator} />))}
          </tbody>
        </Table>
      </Row>
    </>
  );
}

export default AccountsTable;