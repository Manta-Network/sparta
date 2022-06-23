import { Fragment } from 'react';

function Counter(props) {
  return (
    (props.metrics.length === 1)
      ? (
          <p style={{fontWeight: 'bold'}}>
            {Number(props.metrics[0].value)}
          </p>
        )
      : (props.metrics.every(m => Object.keys(m.labels).filter(l => l !== 'chain').length === 1))
        ? (
            <dl className="row">
              {
                props.metrics.map((m, mI) => (
                  <Fragment key={mI}>
                    <dt className="col-sm-9">
                      {m.labels[Object.keys(m.labels).find(l => l !== 'chain')].replaceAll('_', ' ')}
                    </dt>
                    <dd className="col-sm-3">
                      {Number(m.value)}
                    </dd>
                  </Fragment>
                ))

              }
            </dl>
          )
        : (
            <dl className="row">
              {
                props.metrics.map((m, mI) => (
                  <Fragment key={mI}>
                    <dt className="col-sm-9">
                      {Object.keys(m.labels).filter(l => l !== 'chain').map((l) => `${l}: ${m.labels[l]}`).join(', ')}
                    </dt>
                    <dd className="col-sm-3">
                      {Number(m.value)}
                    </dd>
                  </Fragment>
                ))
              }
            </dl>
          )
  );
}

export default Counter;
