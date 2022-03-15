function Counter(props) {
  return (
    <ul>
      {
        props.metrics.map((m, i) => (
          <li key={i}>
            {Number(m.value)}
            <span className="text-muted" style={{marginLeft: '0.5em'}}>
              {Object.keys(m.labels).map((l) => `${l}: ${m.labels[l]}`).join(', ')}
            </span>
          </li>
        ))
      }
    </ul>
  );
}

export default Counter;
