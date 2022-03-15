import { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import AccountRow from './AccountRow';

function AccountsTable() {
  const [collators, setCollators] = useState([]);
  useEffect(() => {
    if (!collators.length) {
      fetch(`https://raw.githubusercontent.com/Manta-Network/sparta/main/calamari.json`)
        .then(response => response.json())
        .then(setCollators)
        .catch(console.error);
    }
  }, [collators.length]);
  return (
    <>
      <Row>
        <h2>calamari collator list</h2>
      </Row>
      <Row>
        <Table striped size="sm">
          <thead>
            <tr>
              <th>
                account
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
                calamari
              </th>
              <th style={{textAlign:'center'}}>
                kusama
              </th>
            </tr>
            <tr>
              <td style={{textAlign:'center'}}>
              </td>
              <td style={{textAlign:'center'}}>
              </td>
              <td style={{textAlign:'center'}}>
              </td>
              <td style={{textAlign:'center'}}>
              </td>
              <td style={{textAlign:'center'}}>
                sync
              </td>
              <td style={{textAlign:'center'}}>
                sync
              </td>
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