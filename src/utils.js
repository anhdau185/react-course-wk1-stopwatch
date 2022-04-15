export const padStartNumber = (number, digits = 2) => number.toString().padStart(digits, '0');

export const convertTimestampToString = milliseconds => {
  let seconds = ~~(milliseconds / 1000);
  const rMilliseconds = milliseconds % 1000;

  const hh = ~~(seconds / 3600);
  seconds %= 3600;
  const mm = ~~(seconds / 60);
  seconds %= 60;
  return `${[hh, mm, seconds]
    .map(number => padStartNumber(number))
    .join(':')}.${padStartNumber(rMilliseconds, 3)}`; // only milliseconds require 3 digits, so here we are...
};
