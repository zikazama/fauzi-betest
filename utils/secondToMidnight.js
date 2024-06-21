function secondsToMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0); // Set to midnight

  const timeDifference = midnight - now;
  const secondsRemaining = Math.floor(timeDifference / 1000);

  return secondsRemaining;
}

module.exports = secondsToMidnight;