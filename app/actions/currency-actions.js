import alt from '../alt';

class CurrencyActions {
  updatePrice() {
    return true;
  }

  addCurrency(currency) {
    return currency;
  }

  removeCurrency(currency) {
    return currency;
  }
}

module.exports = alt.createActions(CurrencyActions);
