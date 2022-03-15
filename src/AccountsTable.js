import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import AccountRow from './AccountRow';

function AccountsTable() {
  const navigate = useNavigate();
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
        {collators.map((collator) => (<AccountRow key={collator.ss58} collator={collator} onClick={() => navigate(`/${collator.ss58}`)} />))}
      </tbody>
    </Table>
  );
}

export default AccountsTable;