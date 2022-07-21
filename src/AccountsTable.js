import { Fragment } from 'react';
import { useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import AccountRow from './AccountRow';

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function AccountsTable() {
  const [statii, setStatii] = useState(['applicant', 'funded', 'eligible', 'candidate', 'active', 'invulnerable']);
  const [collators, setCollators] = useState([]);
  useEffect(() => {
    if (!collators.length) {
      fetch(`https://raw.githubusercontent.com/Manta-Network/sparta/main/calamari.json`)
        .then(response => response.json())
        .then((collators) => {
          setStatii((statii) => statii.filter((status) => collators.some((c) => c.status === status)));
          setCollators(shuffle(collators));
        })
        .catch(console.error);
    }
  }, [collators.length]);
  return (
    <Fragment>
      <Row>
        <h2>calamari collators</h2>
      </Row>
      <Row>
        {
          (!!collators.length)
            ? (
                <Tabs defaultActiveKey="active">
                  {
                    statii.map((status) => ({ status, count: collators.filter(c => c.status === status).length })).map((tab) => (
                      <Tab key={tab.status} eventKey={tab.status} title={
                        (
                          <span>
                            {tab.status} <Badge pill bg="secondary">{tab.count}</Badge>
                          </span>
                        )
                      }>
                        <Table striped size="sm">
                          <thead>
                            <tr>
                              <th>
                                collator
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
                                ssl
                              </th>
                              <th style={{textAlign:'center'}}>
                                up
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {collators.filter((c) => c.status === tab.status).map((collator) => (<AccountRow key={collator.ss58} collator={collator} />))}
                          </tbody>
                        </Table>
                      </Tab>
                    ))
                  }
                </Tabs>
              )
            : (
                <Spinner animation="border" variant="secondary" size="sm">
                  <span className="visually-hidden">collator lookup in progress...</span>
                </Spinner>
              )
        }
      </Row>
    </Fragment>
  );
}

export default AccountsTable;