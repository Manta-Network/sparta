
export function dateDiff(a, b, output = 'object') {
  if (b === null || b === undefined) {
    b = new Date(new Date().getTime()); // utc now
  }
  const seconds = {
    // year: 31536000,
    // month: 2592000,
    // week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };
  let delta = Math.abs((a - b) / 1000);
  let diff = {};
  Object.keys(seconds).forEach((period) => {
    diff[period] = Math.floor(delta / seconds[period]);
    delta -= diff[period] * seconds[period];
  });
  return (output === 'object')
    ? diff
    : (output === 'significant')
      ? (diff.day > 0)
        ? `${diff.day} day${(diff.day > 1) ? 's' : ''}`
        : (diff.hour > 0)
          ? `${diff.hour} hour${(diff.hour > 1) ? 's' : ''}`
          : (diff.minute > 0)
            ? `${diff.minute} minute${(diff.minute > 1) ? 's' : ''}`
            : (diff.second > 0)
              ? `${diff.second} second${(diff.second > 1) ? 's' : ''}`
              : ''
      : Object.keys(diff).map((period) => `${(diff[period] > 0) ? `${diff[period]} ${period}${(diff[period] > 1) ? 's' : ''}`: ''}`).filter((x) => !!x).join(', ');
}
