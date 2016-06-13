import alt from '../alt';

// Flux
import CurrencyActions from '../actions/currency-actions';

// 3rd party libraries
import store from 'react-native-simple-store';

// Utils
import bitcoin from '../utils/bitcoin';

class BitcoinStore {
  constructor() {
    let that = this;
    store.get('currencies').then((currencies) => {
      if (!currencies) {
        currencies = ['USD', 'EUR', 'CNY', 'GBP', 'CAD'];
      }
      that.setState({
        currencies: currencies,
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
      let timestamp = bitcoinData.timestamp;
      console.log(bitcoinData);
      delete bitcoinData.timestamp;
      that.setState({
        timestamp: timestamp,
        bitcoinData: bitcoinData,
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
    let that = this;
    store.get('bitcoinData').then((bitcoinDataPrevious) => {
      that.setState({
        bitcoinDataPrevious: bitcoinDataPrevious || {},
      });

      bitcoin().then((bitcoinData) => {
        delete bitcoinData.timestamp;
        console.log(bitcoinData);
        that.setState({
          bitcoinData: bitcoinData,
        });
        store.save('bitcoinData', bitcoinData);
      });
    });
  }

  handleAddCurrency(currency) {
    console.log('handleAddCurrency', currency);
    let currencies = this.state.currencies;
    currencies.push(currency);
    this.setState({currencies: currencies});
    store.save('currencies', currencies);
  }

  handleRemoveCurrency(currency) {
    console.log('handleRemoveCurrency', currency);
    let currencies = this.state.currencies.filter(item => item !== currency);
    this.setState({currencies: currencies});
    store.save('currencies', currencies);
  }
}

module.exports = alt.createStore(BitcoinStore, 'BitcoinStore');
