import React from 'react';
import {
  ListView,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import store from 'react-native-simple-store';
import timer from 'react-native-timer';

import Big from 'big.js';
import moment from 'moment';

// Flux
import CurrencyStore from '../stores/currency-store';

import AdmobCell from '../components/admob-cell'

import currencies from '../utils/currencies';
import bitcoin from '../utils/bitcoin';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFF4',
    marginBottom: 50,
  },
  navigatorBarIOS: {
    backgroundColor: '#455A64',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#37474F',
  },
  navigatorLeftButton: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 50,
  },
  navigatorRightButton: {
    paddingTop: 10,
    paddingLeft: 50,
    paddingRight: 10,
  },
  toolbar: {
    height: 56,
    backgroundColor: '#202020',
  },
  cell: {
    flex: 1,
    backgroundColor: '#EFEFF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 22,
    color: 'gray',
  },
});

export default class CalculatorView extends React.Component {
  constructor(props) {
    super(props);

    this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = Object.assign({
      dataSource: this.dataSource.cloneWithRows(currencies),
      key: Math.random(),
      value: '0',
      isDecimalPonit: false,
      rateFloat: 1,
      currency: 'usd',
    }, CurrencyStore.getState());
  }

  componentDidMount() {
    const that = this;
    store.get('currency').then((currency) => {
      if (currency) {
        that.setState({ currency });
      }
      that.checkBitcoin(currency);
    });

    timer.clearTimeout(this);
    timer.setInterval(this, 'checkBitcoin', () => that.checkBitcoin(this.state.currency), 15000);
  }

  componentWillUnmount() {
    timer.clearInterval(this);
  }

  onCurrencyStoreChange(state) {
    this.setState({
      currencies: state.currencies,
    });
  }

  onActionSelected(position) {
    if (position === 0) {  // index of 'Done'
      Actions.pop();
    }
  }

  setNumber(value) {
    if (this.state.value.includes('.') && value === 0) {
      this.setState({
        value: `${this.state.value}${value}`,
      });
    } else if (this.state.isDecimalPonit && !this.state.value.includes('.') && value === 0) {
      this.setState({
        value: `${this.state.value}.${value}`,
      });
    } else if (this.state.isDecimalPonit && !this.state.value.includes('.')) {
      this.setState({
        value: (new Big(`${this.state.value}.${value}0`)).toFixed(),
      });
    } else {
      this.setState({
        value: (new Big(`${this.state.value}${value}`)).toFixed(),
      });
    }

    this.setState({ isDecimalPonit: false });
    this.checkBitcoin(this.state.currency);
  }

  checkBitcoin(currency) {
    const that = this;
    bitcoin(currency).then((bitcoinData) => {
      console.log(bitcoinData);
      that.setState({
        rateFloat: bitcoinData.bpi && bitcoinData.bpi[currency.toUpperCase()] && bitcoinData.bpi[currency.toUpperCase()].rate_float,
        updatedISO: bitcoinData.time && moment(bitcoinData.time.updatedISO).fromNow(),
      });
    });
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          statusBar={{ tintColor: '#455A64', style: 'light-content' }}
          style={styles.navigatorBarIOS}
          title={{ title: this.props.title, tintColor: 'white' }}
          leftButton={<TouchableOpacity onPress={Actions.tab0more}>
            <Icon style={styles.navigatorLeftButton} name="info-outline" size={26} color="white" />
          </TouchableOpacity>}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          style={styles.toolbar}
          title={this.props.title}
          titleColor="white"
        />
      );
    }
  }

  render() {
    GoogleAnalytics.trackScreenView('calculator');
    const price = (new Big(this.state.value)).times(this.state.rateFloat).toFixed();
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <View style={{ flex: 4, alignItems: 'flex-end', justifyContent: 'space-around', padding: 14 }}>
          <Text style={{ fontSize: price.length < 11 ? 50 : 35 }}>{price}</Text>
          {price.length < 25 && <Text style={{ fontSize: price.length < 15 ? 18 : 14 }}>{this.state.currency.toUpperCase()}</Text>}
          {price.length < 25 && <Text style={{ fontSize: price.length < 15 ? 18 : 14 }}>{`${this.state.value.toString()}${this.state.isDecimalPonit && !this.state.value.toString().includes('.') ? '.' : ''}`}</Text>}
          {price.length < 25 && <Text style={{ fontSize: price.length < 15 ? 18 : 14 }}>{'BTC'}</Text>}
        </View>
        <View style={{ flex: 1 }}>
          <ListView
            horizontal
            dataSource={this.state.dataSource}
            renderRow={({ currency }) => <TouchableHighlight
              underlayColor="#EFEFF4"
              onPress={() => {
                this.setState({ currency });
                this.checkBitcoin(currency);
                store.save('currency', currency);
              }}
            >
              <View style={{ flex: 1, height: 30, width: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: 'gray' }}>
                <Text style={{ color: 'white' }}>{currency}</Text>
              </View>
            </TouchableHighlight>}
          />
        </View>
        <View style={{ flex: 6 }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableHighlight style={styles.cell} underlayColor="#EFEFF4" onPress={() => this.setNumber(7)}>
              <View>
                <Text style={styles.cellText}>7</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.cell} underlayColor="#EFEFF4" onPress={() => this.setNumber(8)}>
              <View>
                <Text style={styles.cellText}>8</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.cell} underlayColor="#EFEFF4" onPress={() => this.setNumber(9)}>
              <View>
                <Text style={styles.cellText}>9</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableHighlight style={styles.cell} underlayColor="#EFEFF4" onPress={() => this.setNumber(4)}>
              <View>
                <Text style={styles.cellText}>4</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.cell} underlayColor="#EFEFF4" onPress={() => this.setNumber(5)}>
              <View>
                <Text style={styles.cellText}>5</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.cell} underlayColor="#EFEFF4" onPress={() => this.setNumber(6)}>
              <View>
                <Text style={styles.cellText}>6</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableHighlight style={styles.cell} underlayColor="#EFEFF4" onPress={() => this.setNumber(1)}>
              <View>
                <Text style={styles.cellText}>1</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.cell} underlayColor="#EFEFF4" onPress={() => this.setNumber(2)}>
              <View>
                <Text style={styles.cellText}>2</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.cell} underlayColor="#EFEFF4" onPress={() => this.setNumber(3)}>
              <View>
                <Text style={styles.cellText}>3</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableHighlight style={styles.cell} underlayColor="#EFEFF4" onPress={() => this.setState({ value: '0' })}>
              <View>
                <Text style={styles.cellText}>AC</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.cell} underlayColor="#EFEFF4" onPress={() => this.setNumber(0)}>
              <View>
                <Text style={styles.cellText}>0</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.cell} underlayColor="#EFEFF4" onPress={() => this.setState({ isDecimalPonit: true })}>
              <View>
                <Text style={styles.cellText}>.</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>

        <AdmobCell />
      </View>
    );
  }
}

CalculatorView.propTypes = {
  title: React.PropTypes.string,
};

CalculatorView.defaultProps = {
  title: '',
};
