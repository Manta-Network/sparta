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
          <p>
            legend
          </p>
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
                  <i className="bi bi-arrow-repeat text-warning" style={{ marginRight: '0.5em'}}></i>
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
      <Row>
        <Col>
          <p>
            a shortllisting for a calamari collator candidacy requires (at a minimum):
          </p>
          <ul>
            <li>
              <strong>a collator account id</strong> in calamari network format. applications with a missing or incorrectly formatted account id are not being considered for shortlisting.
            </li>
            <li>
              <strong>a free balance</strong> greater than the minimum reserve of 400,000 (four hundred thousand) KMA. applications with a free balance lower than the minimum reserve will only be considered after the balance meets the minimum requirement.
            </li>
            <li>
              <strong>a binding to an aura session account</strong>. applications with a missing aura binding will only be considered after the binding has taken place.
            </li>
            <li>
              <strong>metrics exposed</strong> to the pulse server at: <code>18.156.192.254</code>.
            </li>
            <li>
              <strong>synced</strong> calamari and kusama blockchain databases.
            </li>
          </ul>
          <p>
            once the minimum requirements are met, other technical evaluations are used to consider shortlist priority. these include:
          </p>
          <ul>
            <li>
              rpc methods in the <code>unsafe</code> category are not exposed (automatic disqualification if <code>unsafe</code> rpc is discovered)
            </li>
            <li>
              metrics endpoints are exposed, preferably over ssl.
            </li>
            <li>
              length of time that metrics have been available and in the <code>up</code> state.
            </li>
            <li>
              p2p ports are exposed.
            </li>
            <li>
              telemetry is available on <a href="https://telemetry.manta.systems">telemetry.manta.systems</a>. preferably, both kusama and calamari.
            </li>
          </ul>
          <p>
            this list is not exhaustive. we are continuing to develop the selection criteria in light of the many excellent applications.
          </p>
          <ul>
            <li>
              if you do not see your collator id listed, submit a pr to: <a href="https://github.com/Manta-Network/sparta/blob/main/calamari.json">Manta-Network/sparta</a>.
            </li>
            <li>
              if your metrics/sync-states are missing, submit a pr to both <a href="https://github.com/Manta-Network/sparta/blob/main/calamari.json">Manta-Network/sparta</a> and <a href="https://github.com/Manta-Network/pulse/blob/main/config/prometheus.yml">Manta-Network/pulse</a>.
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
