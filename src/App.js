import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import AccountRow from './AccountRow';

function App() {
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
    <Container>
      <Row>
        <Col>
          <Table striped size="sm">
            <thead>
              <tr>
                <th>
                  account
                </th>
                <th>
                  status
                </th>
                <th>
                  bond
                </th>
                <th>
                  session
                </th>
                <th>
                  calamari
                </th>
                <th>
                  kusama
                </th>
              </tr>
              <tr>
                <th>
                </th>
                <th>
                </th>
                <th>
                </th>
                <th>
                </th>
                <th>
                  sync
                </th>
                <th>
                  sync
                </th>
              </tr>
            </thead>
            <tbody>
              {collators.map((collator) => (<AccountRow key={collator.ss58} collator={collator} />))}
            </tbody>
          </Table>
        </Col>
        <Col md="auto">
          legend
          <ul>
            <li>
              collator status
              <ul style={{ listStyleType: 'none', marginTop: 0}}>
                <li>
                  <i className="bi bi-shield-lock-fill" style={{ marginRight: '0.5em'}}></i>
                  invulnerable
                </li>
                <li>
                  <i className="bi bi-shield-shaded" style={{ marginRight: '0.5em'}}></i>
                  active
                </li>
                <li>
                  <i className="bi bi-shield-check" style={{ marginRight: '0.5em'}}></i>
                  candidate
                </li>
                <li>
                  <i className="bi bi-shield" style={{ marginRight: '0.5em'}}></i>
                  applicant
                </li>
              </ul>
            </li>
            <li>
              bond balance status
              <ul style={{ listStyleType: 'none', marginTop: 0}}>
                <li>
                  <i className="bi bi-lock-fill text-success" style={{ marginRight: '0.5em'}}></i>
                  reserved
                </li>
                <li>
                  <i className="bi bi-unlock-fill text-success" style={{ marginRight: '0.5em'}}></i>
                  free
                </li>
                <li>
                  <i className="bi bi-unlock text-danger" style={{ marginRight: '0.5em'}}></i>
                  missing
                </li>
              </ul>
            </li>
            <li>
              session binding status
              <ul style={{ listStyleType: 'none', marginTop: 0}}>
                <li>
                  <i className="bi bi-link-45deg text-success" style={{ marginRight: '0.5em'}}></i>
                  aura bound
                </li>
                <li>
                  <i className="bi bi-link-45deg text-danger" style={{ marginRight: '0.5em'}}></i>
                  aura unbound
                </li>
              </ul>
            </li>
            <li>
              sync status
              <ul style={{ listStyleType: 'none', marginTop: 0}}>
                <li>
                  <i className="bi bi-arrow-repeat text-success" style={{ marginRight: '0.5em'}}></i>
                  best block within ten blocks of target
                </li>
                <li>
                  <i className="bi bi-arrow-repeat text-danger" style={{ marginRight: '0.5em'}}></i>
                  best block not within ten blocks of target
                </li>
                <li>
                  <i className="bi bi-exclamation-circle text-danger" style={{ marginRight: '0.5em'}}></i>
                  metrics endpoint unknown
                </li>
              </ul>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
