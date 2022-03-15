import Counter from './Counter';
import Gauge from './Gauge';
import Histogram from './Histogram';

function Metric(props) {
  switch (props.type) {
    case 'COUNTER':
      return (
        <Counter {...props} />
      );
    case 'GAUGE':
      return (
        <Gauge {...props} />
      );
    case 'HISTOGRAM':
      return (
        <Histogram {...props} />
      );
    default:
      return (
        <pre>{JSON.stringify(props.metrics, null, 2)}</pre>
      );
  }
}

export default Metric;
