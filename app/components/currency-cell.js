import React from 'react';
import {
  Text,
  TouchableHighlight,
  View,
  StyleSheet,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';

import currencies from '../utils/currencies';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    height: 55,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  selected: {
    backgroundColor: '#202020',
  },
  firstBlock: {
    flex: 1,
    marginLeft: 25,
  },
  firstBlockText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'left',
  },
  secondBlock: {
    flex: 1,
    marginRight: 25,
  },
  priceText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'right',
  },
  priceRedText: {
    color: '#FC3D39',
  },
  priceGreenText: {
    color: '#53D769',
  },
  currencyName: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'right',
  },
});

export default class CurrencyCell extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '0',
    };
  }

  render() {
    return (
      <TouchableHighlight
        onPress={() => Actions.details({
          title: currencies[this.props.currency],
          btctoothers: this.props.btctoothers,
          currency: this.props.currency,
          unit: this.props.unit,
        })} underlayColor="#202020"
      >
        <View>
          {this.props.btctoothers && <View style={styles.container}>
            <View style={styles.firstBlock}>
              <Text style={styles.firstBlockText}>
                {this.props.unit} BTC
              </Text>
            </View>
            <View style={styles.secondBlock}>
              {this.props.bitcoinData && this.props.bitcoinData[this.props.currency] && this.props.bitcoinDataPrevious && this.props.bitcoinDataPrevious[this.props.currency]
                && <Text style={styles.priceText}>
                  <Text
                    style={this.props.bitcoinData[this.props.currency].last > this.props.bitcoinDataPrevious[this.props.currency].last
                              ? styles.priceGreenText
                              : this.props.bitcoinData[this.props.currency].last < this.props.bitcoinDataPrevious[this.props.currency].last
                              ? styles.priceRedText : null}
                  >
                    {(this.props.unit * this.props.bitcoinData[this.props.currency].last).toFixed(2)}
                  </Text>
                  {` ${this.props.currency}`}
                </Text>}
              <Text style={styles.currencyName}>{currencies[this.props.currency]}</Text>
            </View>
          </View>}
          {!this.props.btctoothers && <View style={styles.container}>
            <View style={styles.firstBlock}>
              <Text style={styles.firstBlockText}>
                {`${this.props.unit} ${this.props.currency}`}
              </Text>
              <Text style={[styles.currencyName, { textAlign: 'left' }]}>{currencies[this.props.currency]}</Text>
            </View>
            <View style={styles.secondBlock}>
              {this.props.bitcoinData && this.props.bitcoinData[this.props.currency] && this.props.bitcoinDataPrevious && this.props.bitcoinDataPrevious[this.props.currency]
                && <Text style={styles.priceText}>
                  <Text
                    style={this.props.bitcoinData[this.props.currency].last > this.props.bitcoinDataPrevious[this.props.currency].last
                              ? styles.priceRedText
                              : this.props.bitcoinData[this.props.currency].last < this.props.bitcoinDataPrevious[this.props.currency].last
                              ? styles.priceGreenText : null}
                  >
                    {(this.props.unit / this.props.bitcoinData[this.props.currency].last).toFixed(4)}
                  </Text>
                    {' BTC'}
                </Text>}
            </View>
          </View>}
        </View>
      </TouchableHighlight>
    );
  }
}

CurrencyCell.propTypes = {
  currency: React.PropTypes.string,
  btctoothers: React.PropTypes.bool,
  unit: React.PropTypes.number,
  bitcoinData: React.PropTypes.objectOf(React.PropTypes.object),
  bitcoinDataPrevious: React.PropTypes.objectOf(React.PropTypes.object),
};

CurrencyCell.defaultProps = {
  currency: '',
  btctoothers: true,
  unit: 1,
  bitcoinData: {},
  bitcoinDataPrevious: {},
};
