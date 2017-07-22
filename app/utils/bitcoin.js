module.exports = function bitcoin(currency = 'usd') {
  const URL = `http://api.coindesk.com/v1/bpi/currentprice/${currency}`;
  console.log(URL);
  return fetch(URL).then(res => res.json());
};
