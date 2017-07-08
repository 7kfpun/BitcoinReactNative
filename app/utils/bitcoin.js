module.exports = function bitcoin(currency = 'usd') {
  const BITCOIN_AVERAGE_URL = `http://api.coindesk.com/v1/bpi/currentprice/${currency}`;
  console.log(BITCOIN_AVERAGE_URL);
  return fetch(BITCOIN_AVERAGE_URL).then(res => res.json());
};
