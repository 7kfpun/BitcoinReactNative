module.exports = function() {
  const BITCOIN_AVERAGE_URL = 'https://api.bitcoinaverage.com/ticker/global/all';  // api v1
  // const BITCOIN_AVERAGE_URL = 'https://apiv2.bitcoinaverage.com/exchanges/all';  // api v2
  return fetch(BITCOIN_AVERAGE_URL).then((res) => res.json());
};
