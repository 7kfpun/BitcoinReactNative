module.exports = function bitcoin(currency = 'usd') {
  const URL = `http://api.coindesk.com/v1/bpi/currentprice/${currency}`;
  console.log(URL);
  const req = new Request(URL);
  console.log('req', req);
  return fetch(req).then(res => res.json());
};
