import { Fragment } from 'react';
import {
  Chart as ChartJS,
  //CategoryScale,
  registerables
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
ChartJS.register(...registerables);

const options = {
  plugins: {
    legend: {
      display: false
    }
  }
};

function Histogram(props) {
  return props.metrics.map((m, i) => (
    <Fragment key={i}>
      <Chart type="bar" options={options} data={{
        labels: Object.keys(m.buckets),
        datasets: [{
          data: Object.values(m.buckets).map((v) => parseInt(v)),
          backgroundColor: 'rgb(158, 193, 249, .5)',
          borderColor: 'rgb(158, 193, 249)'
        }]
      }} />
      <hr />
      <dl className="row">
      {
        Object.keys(m.labels).filter(l => l !== 'chain').map((l, lI) => (
            <Fragment key={lI}>
              <dt className="col-sm-3">{l}</dt>
              <dd className="col-sm-9">{m.labels[l]}</dd>
            </Fragment>
        ))
      }
      </dl>
      <hr />
      <dl className="row">
        {
          Object.entries(m.buckets).map(([key, value], eI) => (
            <Fragment key={eI}>
              <dt className="col-sm-3">{key}</dt>
              <dd className="col-sm-9">{value}</dd>
            </Fragment>
          ))
        }
      </dl>
      <hr />
      <dl className="row">
        {
          Object.keys(m)
            .filter((k) => !['buckets', 'labels', ''].includes(k))
            .map((key, kI) => (
            <Fragment key={kI}>
              <dt className="col-sm-3">{key}</dt>
              <dd className="col-sm-9">{m[key]}</dd>
            </Fragment>
          ))
        }
      </dl>
      {
        /*
        <pre>
          {JSON.stringify(m, null, 2)}
        </pre>
        
        */
      }
    </Fragment>
  ));
}

export default Histogram;
