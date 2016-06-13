module.exports = function() {
  const BITCOIN_AVERAGE_URL = 'https://api.bitcoinaverage.com/ticker/global/all';
  return fetch(BITCOIN_AVERAGE_URL).then((res) => res.json());
};
