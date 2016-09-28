// 3rd party libraries
import store from 'react-native-simple-store';

import alt from '../alt';

// Flux
import CurrencyActions from '../actions/currency-actions';

// Utils
import bitcoin from '../utils/bitcoin';

class BitcoinStore {
  constructor() {
    const that = this;
    store.get('currencies').then((currencies) => {
      if (!currencies) {
        currencies = ['USD', 'EUR', 'CNY', 'GBP', 'CAD'];
      }
      if (currencies[0] === 'BTC') {
        // currencies = ['BTC'].concat(currencies);
        currencies.shift();
      }
      that.setState({
        currencies,
      });
      store.save('currencies', currencies);
    });

    store.get('bitcoinData').then((bitcoinData) => {
      that.setState({
        bitcoinData: bitcoinData || {},
        bitcoinDataPrevious: bitcoinData || {},
      });
    });

    store.get('timestamp').then((timestamp) => {
      that.setState({
        timestamp: timestamp || '',
      });
    });

    bitcoin().then((bitcoinData) => {
      const timestamp = bitcoinData.timestamp;
      delete bitcoinData.timestamp;
      that.setState({
        timestamp,
        bitcoinData,
        bitcoinDataPrevious: bitcoinData || {},
      });
      store.save('bitcoinData', bitcoinData);
      store.save('timestamp', timestamp);
    });

    this.bindListeners({
      handleUpdatePrice: CurrencyActions.UPDATE_PRICE,
      handleAddCurrency: CurrencyActions.ADD_CURRENCY,
      handleRemoveCurrency: CurrencyActions.REMOVE_CURRENCY,
    });

    this.state = {
      currencies: [],
      bitcoinData: {},
      bitcoinDataPrevious: {},
      timestamp: '',
    };
  }

  handleUpdatePrice() {
    console.log('handleUpdatePrice');
    const that = this;
    store.get('bitcoinData').then((bitcoinDataPrevious) => {
      that.setState({
        bitcoinDataPrevious: bitcoinDataPrevious || {},
      });

      bitcoin().then((bitcoinData) => {
        const timestamp = bitcoinData.timestamp;
        delete bitcoinData.timestamp;
        that.setState({
          timestamp,
          bitcoinData,
        });
        store.save('bitcoinData', bitcoinData);
        store.save('timestamp', timestamp);
      });
    });
  }

  handleAddCurrency(currency) {
    console.log('handleAddCurrency', currency);
    const currencies = this.state.currencies;
    currencies.push(currency);
    this.setState({ currencies });
    store.save('currencies', currencies);
  }

  handleRemoveCurrency(currency) {
    console.log('handleRemoveCurrency', currency);
    const currencies = this.state.currencies.filter(item => item !== currency);
    this.setState({ currencies });
    store.save('currencies', currencies);
  }
}

module.exports = alt.createStore(BitcoinStore, 'BitcoinStore');
