import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import AccountRow from './AccountRow';

const accounts = [...new Set([
  'dmu7rmwTa35Ec5cnNMpn8EpnFPA727sDtpCQwu9uCo2sfnmg1',
  'dmvvqrfK5AUYH294zTCCiimJRV7CQDDQyC7RAkd5aZgUn9S6f',
  'dmxjZSec4Xj3xz3nBEwSHjQSnRGhvcoB4eRabkiw7pSDuv8fW',
  'dmu63DLez715hRyhzdigz6akxS2c9W6RQvrToUWuQ1hntcBwF',
  'dmxvivs72h11DBNyKbeF8KQvcksoZsK9uejLpaWygFHZ2fU9z',
  'dmuomPgt6hJzKpDcEbz2BNNo9uPFXDvzBk7vnLQx6TLBQG85L',
  'dmzbLejekGYZmfo5FoSznv5bBik7vGowuLxvzqFs2gZo2kANh',
  'dmu7rmwTa35Ec5cnNMpn8EpnFPA727sDtpCQwu9uCo2sfnmg1',
  'dmu8uRzeiS7CjrKFiSU6bKMftbvJ16o6C4Z1yymQnQkCcrNou',
  'dmuBBGBxRRLhZa7QEfZvMPZsV3YXEgNeTkA1vhwhBhpLrSyH2',
  'dmud8aJzwQ5H8v1Zw9AekV8TXwEe412JCeCEcwKwsvkpeeCAU',
  'dmuMp3ZDzrggjgRmCsXLuriE2wB8qfAwhrwCskAsepqGnYyAD',
  'dmuomPgt6hJzKpDcEbz2BNNo9uPFXDvzBk7vnLQx6TLBQG85L',
  'dmuuG83f3JeXBmMp7e3XssJzq7rUAuNgAT3z7HoUPWueqpD1V',
  'dmv2KUDD1JHCgtYDSds8FUBf7bd59SLkGXLz979PV7V4DbX8G',
  'dmvejwLsRVWLFNfWMm2potXvYU3TXBzxndun1zKqFRFs2nDP6',
  'dmvK7LAuPAAdSzFWqkXiS9AwxMhc7vCYmvZHg8iHveaFYG5HL',
  'dmvoKqM8n2PVKyiYhm5VpMMnzMdk1z1WZAYDJEDmSLSqRgrbQ',
  'dmvPNCD8YaHusmrdtvpB6HG72BibVSpnbHugT893x4Hw9P186',
  'dmvQL8XfiJcfufCowNHCkJ8qxMAdw39i1nPsH8jf7AbEgnvNW',
  'dmvu53ayeLxRSf14ejMEBMpePQxSVwBDSvyQXC789miKprvgq',
  'dmvVY24KwgNwoYnHw5EbC8mTUF9CtZeJzCnSGBawWzaRkNHH4',
  'dmvXcSGBjyW4cq3ban3L4LJB6RtHQhBmtztZZ4o6TYKjoZ7Ye',
  'dmwcJrQm4ShNd1ASnksCG465hchJKrjTGiSoFsC9vMJcgbsPV',
  'dmwkmhm6YZgBihxdgvDLcwRy7ZuvzFDhEyntTYuy7QeXddxdN',
  'dmwtABggtvqJovSnFYi3KX5jCoPs66cZro8et9PJiRk7VGQ1f',
  'dmww5oaqM52Tg9WHLe9WJ9bKhyekZH1SiT4mYdb2khY1zLQg6',
  'dmx4WhyUDhAjsMf1mRD55qApjxnqSXcSsmweHgcv8seGkrN4R',
  'dmx7NaUig7rdhwTJcnj6VPFaeou4KsvTqkMTcvHz25LcZtNrT',
  'dmxa3MJczFGT92BUQjwsxguUC2t5qFaDdagfpBQWdGkNPJYQ5',
  'dmxARc22SyzyD29ca92pWkbcGjJcMibatAnAQnwEbo7zwiPFW',
  'dmxbgDpKK6V3Sayr3jz8MpoUJyxiWese6FtL42RRfZXnWewTD',
  'dmxo6FdaDHxPJPdUMDvVzEcqE8UuV2Ve1JURt4jF9efNDyk2o',
  'dmxRC8PY2FbFhSjsx1RpcqJpiYoZ2ubGR8rAMhW3ocxpWkArh',
  'dmy6hUYKvUqpo7QxFFK5bgmnGYLpfSMxFDw2t3XpC6MjMkLJa',
  'dmy6WPM2KfD7WBxJYS6UG17GHJVCv8kewiwTr6ciVeXLbBpvf',
  'dmy9gzyanK9FpAxVamGa7TLz2t9RAn1SLzuy6fr5Pq5Sztqje',
  'dmyhGCWjejSyze6Hcqx43f8PNR9RWwm4EEobo8HehtBb8W8aU',
  'dmyhNFR1qUuA8efaYvpW75qGKrYfzrK8ejygttHojeL4ujzUb',
  'dmynx7uZ8HE1gNSQhXiiqVrKX5yPkHka99HjfY98z8DqRtEw3',
  'dmyxfU1bJM5UR5RWsypKm9KQDkVofm3ifp5gVjzs8uQHUmBZb',
  'dmyyAnvDKvWePe7d6yWzVnqVhJp9HbNMs5RDoKjUSABNQcVf5',
  'dmyZopEVaerkgSWWTd4WScPkhQgHTeLfMcHVCkQUyL1gu29c3',
  'dmzCAH7F9E6QoSuFWq2Hfq4b3XNzUz73zV82PzUiv4QUp5tH3',
  'dmzEUqQGSWsFewzpomYcjhLYkeSAvHYwEoKzG2yXcF8YQoJkL',
  'dmzUQzg7MjgxQDSA73hezRUBo3GysC42q4pxJE8qExy1CMMAm',
  'dmzWDne3MxniVDcF4i2nGkfPZa4pfkWL1AXqgSvWgZmDoTcYw',
])];

function App() {
  return (
    <Container>
      <Table striped size="sm">
        <thead>
          <tr>
            <th>
              account
            </th>
            <th>
              session
            </th>
            <th style={{textAlign:'right'}}>
              bond
            </th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((ss58) => (<AccountRow key={ss58} ss58={ss58} />))}
        </tbody>
      </Table>
      <Row>
        <p style={{ listStyleType: 'none', marginBottom: 0}}>
          legend
        </p>
        <ul style={{ listStyleType: 'none', marginTop: 0}}>
          <li>
            <i className="bi bi-link-45deg text-success" style={{ marginRight: '0.5em'}}></i>
            session bound
          </li>
          <li>
            <i className="bi bi-link-45deg text-danger" style={{ marginRight: '0.5em'}}></i>
            session unbound
          </li>
          <li>
            <i className="bi bi-lock-fill text-success" style={{ marginRight: '0.5em'}}></i>
            bond reserved
          </li>
          <li>
            <i className="bi bi-unlock-fill text-success" style={{ marginRight: '0.5em'}}></i>
            bond free
          </li>
          <li>
            <i className="bi bi-unlock text-danger" style={{ marginRight: '0.5em'}}></i>
            bond missing
          </li>
        </ul>
      </Row>
    </Container>
  );
}

export default App;
