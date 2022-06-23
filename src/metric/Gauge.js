import { Fragment } from 'react';

function Gauge(props) {
  return (
    (props.metrics.length === 1)
      ? (['substrate_build_info'].includes(props.name))
        ? (
            <dl className="row">
              {
                Object.keys(props.metrics[0].labels).filter(l => l !== 'chain').map((label, lI) => (
                  <Fragment key={lI}>
                    <dt className="col-sm-6">
                      {label}
                    </dt>
                    <dd className="col-sm-6">
                      {props.metrics[0].labels[label]}
                    </dd>
                  </Fragment>
                ))
              }
            </dl>
          )
        : (
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

export default Gauge;
