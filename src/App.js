import { Route, Routes } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import AccountDetail from './AccountDetail';
import AccountsTable from './AccountsTable';

function App() {
  return (
    <Container>
      <Row>
        <Col>
          <Routes>
            <Route path='/' element={<AccountsTable />} />
            <Route path='/:ss58' element={<AccountDetail />} />
          </Routes>
        </Col>
        <Col md="auto">
          <Table size="sm">
            <thead>
              <tr>
                <th colSpan="2">
                  legend
                </th>
              </tr>
            </thead>
            <thead>
              <tr>
                <th colSpan="2">
                  collator status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <i className="bi bi-shield-lock-fill"></i>
                </td>
                <td>
                  invulnerable
                </td>
              </tr>
              <tr>
                <td>
                  <i className="bi bi-shield-shaded"></i>
                </td>
                <td>
                  active
                </td>
              </tr>
              <tr>
                <td>
                  <i className="bi bi-shield-check"></i>
                </td>
                <td>
                  candidate
                </td>
              </tr>
              <tr>
                <td>
                  <i className="bi bi-shield"></i>
                </td>
                <td>
                  applicant
                </td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th colSpan="2">
                  bond balance status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <i className="bi bi-lock-fill text-success"></i>
                </td>
                <td>
                  reserved
                </td>
              </tr>
              <tr>
                <td>
                  <i className="bi bi-unlock-fill text-success"></i>
                </td>
                <td>
                  free
                </td>
              </tr>
              <tr>
                <td>
                  <i className="bi bi-unlock text-danger"></i>
                </td>
                <td>
                  missing
                </td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th colSpan="2">
                  session binding status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <i className="bi bi-link-45deg text-success"></i>
                </td>
                <td>
                  aura bound
                </td>
              </tr>
              <tr>
                <td>
                  <i className="bi bi-link-45deg text-danger"></i>
                </td>
                <td>
                  aura unbound
                </td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th colSpan="2">
                  sync status (calamari, kusama)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <i className="bi bi-arrow-repeat text-success"></i>
                </td>
                <td>
                  best block within ten<br />
                  blocks of target
                </td>
              </tr>
              <tr>
                <td>
                  <i className="bi bi-arrow-repeat text-warning"></i>
                </td>
                <td>
                  best block not within ten<br />
                  blocks of target
                </td>
              </tr>
              <tr>
                <td>
                  <i className="bi bi-exclamation-circle text-danger"></i>
                </td>
                <td>
                  metrics endpoint unknown
                </td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th colSpan="2">
                  alert status (calamari, kusama)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <i className="bi bi-activity text-success"></i>
                </td>
                <td>
                  no active alerts
                </td>
              </tr>
              <tr>
                <td>
                  <i className="bi bi-exclamation-diamond-fill text-warning"></i>
                </td>
                <td>
                  warning alert firing
                </td>
              </tr>
              <tr>
                <td>
                  <i className="bi bi-exclamation-diamond-fill text-danger"></i>
                </td>
                <td>
                  critical alert firing
                </td>
              </tr>
              <tr>
                <td>
                  <i className="bi bi-exclamation-circle text-danger"></i>
                </td>
                <td>
                  metrics endpoint unknown
                </td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th colSpan="2">
                  uptime status (calamari, kusama)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Badge pill bg="success" style={{ marginRight: '0.5em'}}>0</Badge>
                </td>
                <td>
                  up consistently for 10 days
                </td>
              </tr>
              <tr>
                <td>
                  <Badge pill bg="warning" style={{ marginRight: '0.5em'}}>2</Badge>
                </td>
                <td>
                  unreachable once or twice<br />
                  in the last 10 days
                </td>
              </tr>
              <tr>
                <td>
                  <Badge pill bg="danger" style={{ marginRight: '0.5em'}}>3</Badge>
                </td>
                <td>
                  unreachable three times or<br />
                  more in the last 10 days
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            a shortlisting for a calamari collator candidacy requires (at a minimum):
          </p>
          <ul>
            <li>
              <strong>a collator account id</strong> in calamari network format (always starts with <code>dm</code>). applications with a missing or incorrectly formatted account id are not being considered for shortlisting.
            </li>
            <li>
              <strong>a free balance</strong> greater than the minimum reserve of 400,000 (four hundred thousand) KMA. applications with a free balance lower than the minimum reserve will only be considered after the balance meets the minimum requirement.
            </li>
            <li>
              <strong>a binding to an aura session account</strong>. applications with a missing aura binding will only be considered after the binding has taken place.
            </li>
            <li>
              <strong>metrics exposed</strong> to the <a href="https://pulse.pelagos.systems/targets">pulse</a> server at: <code>18.156.192.254</code>.
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
              metrics endpoints are exposed to <a href="https://pulse.pelagos.systems/targets">pulse</a>. nodes supplying metrics over ssl on port 443 with a valid ssl certificate, will be prioritised over nodes using plain http. ssl allows the metrics aggregator to validate that metrics are supplied by the authentic dns host noted in pulse configuration.
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
