import { Chart } from 'react-google-charts';

function Histogram(props) {
  return (
    <ul>
      {
        props.metrics.map((m, i) => (
          <li key={i}>
            {Object.keys(m.labels).map((l) => `${l}: ${m.labels[l]}`).join(', ')}
            <br />
            <Chart chartType="Histogram" data={Object.keys(m.buckets).map((k) => [k, m.buckets[k]])} width="100%" legendToggle />
          </li>
        ))
      }
    </ul>
  );
}

export default Histogram;
