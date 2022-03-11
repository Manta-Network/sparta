//import React, { useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
//import Identicon from '@polkadot/react-identicon';

const accounts = [
  'dmv2KUDD1JHCgtYDSds8FUBf7bd59SLkGXLz979PV7V4DbX8G',
  'dmxRC8PY2FbFhSjsx1RpcqJpiYoZ2ubGR8rAMhW3ocxpWkArh',
  'dmwtABggtvqJovSnFYi3KX5jCoPs66cZro8et9PJiRk7VGQ1f',
  'dmzUQzg7MjgxQDSA73hezRUBo3GysC42q4pxJE8qExy1CMMAm',
  'dmzUQzg7MjgxQDSA73hezRUBo3GysC42q4pxJE8qExy1CMMAm',
  'dmvu53ayeLxRSf14ejMEBMpePQxSVwBDSvyQXC789miKprvgq',
  'dmuMp3ZDzrggjgRmCsXLuriE2wB8qfAwhrwCskAsepqGnYyAD',
  'dmx4WhyUDhAjsMf1mRD55qApjxnqSXcSsmweHgcv8seGkrN4R',
  'dmuuG83f3JeXBmMp7e3XssJzq7rUAuNgAT3z7HoUPWueqpD1V',
  'dmzEUqQGSWsFewzpomYcjhLYkeSAvHYwEoKzG2yXcF8YQoJkL',
  'dmww5oaqM52Tg9WHLe9WJ9bKhyekZH1SiT4mYdb2khY1zLQg6',
  'dmww5oaqM52Tg9WHLe9WJ9bKhyekZH1SiT4mYdb2khY1zLQg6',
  'dmu8uRzeiS7CjrKFiSU6bKMftbvJ16o6C4Z1yymQnQkCcrNou',
  'dmy6hUYKvUqpo7QxFFK5bgmnGYLpfSMxFDw2t3XpC6MjMkLJa',
  'dmwkmhm6YZgBihxdgvDLcwRy7ZuvzFDhEyntTYuy7QeXddxdN',
  'dmyyAnvDKvWePe7d6yWzVnqVhJp9HbNMs5RDoKjUSABNQcVf5',
  'dmzCAH7F9E6QoSuFWq2Hfq4b3XNzUz73zV82PzUiv4QUp5tH3',
  'dmyxfU1bJM5UR5RWsypKm9KQDkVofm3ifp5gVjzs8uQHUmBZb',
  'dmx7NaUig7rdhwTJcnj6VPFaeou4KsvTqkMTcvHz25LcZtNrT',
  'dmyhNFR1qUuA8efaYvpW75qGKrYfzrK8ejygttHojeL4ujzUb',
  'dmxa3MJczFGT92BUQjwsxguUC2t5qFaDdagfpBQWdGkNPJYQ5',
  'dmvoKqM8n2PVKyiYhm5VpMMnzMdk1z1WZAYDJEDmSLSqRgrbQ',
  'dmud8aJzwQ5H8v1Zw9AekV8TXwEe412JCeCEcwKwsvkpeeCAU',
  'dmvQL8XfiJcfufCowNHCkJ8qxMAdw39i1nPsH8jf7AbEgnvNW',
  'dmu7rmwTa35Ec5cnNMpn8EpnFPA727sDtpCQwu9uCo2sfnmg1',
  'dmyhGCWjejSyze6Hcqx43f8PNR9RWwm4EEobo8HehtBb8W8aU',
  'dmvejwLsRVWLFNfWMm2potXvYU3TXBzxndun1zKqFRFs2nDP6',
  'dmyZopEVaerkgSWWTd4WScPkhQgHTeLfMcHVCkQUyL1gu29c3',
  'dmzWDne3MxniVDcF4i2nGkfPZa4pfkWL1AXqgSvWgZmDoTcYw',
  'dmyZopEVaerkgSWWTd4WScPkhQgHTeLfMcHVCkQUyL1gu29c3',
  'dmynx7uZ8HE1gNSQhXiiqVrKX5yPkHka99HjfY98z8DqRtEw3',
  'dmvXcSGBjyW4cq3ban3L4LJB6RtHQhBmtztZZ4o6TYKjoZ7Ye',
  'dmvVY24KwgNwoYnHw5EbC8mTUF9CtZeJzCnSGBawWzaRkNHH4',
  'dmvK7LAuPAAdSzFWqkXiS9AwxMhc7vCYmvZHg8iHveaFYG5HL',
  'dmy9gzyanK9FpAxVamGa7TLz2t9RAn1SLzuy6fr5Pq5Sztqje',
  'dmuomPgt6hJzKpDcEbz2BNNo9uPFXDvzBk7vnLQx6TLBQG85L',
  'dmxARc22SyzyD29ca92pWkbcGjJcMibatAnAQnwEbo7zwiPFW',
  'dmxbgDpKK6V3Sayr3jz8MpoUJyxiWese6FtL42RRfZXnWewTD',
  'dmvPNCD8YaHusmrdtvpB6HG72BibVSpnbHugT893x4Hw9P186',
  'dmwcJrQm4ShNd1ASnksCG465hchJKrjTGiSoFsC9vMJcgbsPV',
  'dmuBBGBxRRLhZa7QEfZvMPZsV3YXEgNeTkA1vhwhBhpLrSyH2',
  'dmvoKqM8n2PVKyiYhm5VpMMnzMdk1z1WZAYDJEDmSLSqRgrbQ',
  'dmx7NaUig7rdhwTJcnj6VPFaeou4KsvTqkMTcvHz25LcZtNrT',
  'dmy6WPM2KfD7WBxJYS6UG17GHJVCv8kewiwTr6ciVeXLbBpvf',
  'dmxo6FdaDHxPJPdUMDvVzEcqE8UuV2Ve1JURt4jF9efNDyk2o'
];

function App() {
  return (
    <Container>
      {
        accounts.map((ss58) => (
          <Row key={ss58}>
            <Col>
              {ss58}
            </Col>
            <Col>
            </Col>
          </Row>
          ))
      }
    </Container>
  );
}

export default App;
