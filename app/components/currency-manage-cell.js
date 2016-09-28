import React from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

// Flux
import CurrencyActions from '../actions/currency-actions';
import CurrencyStore from '../stores/currency-store';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    height: 50,
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
  secondBlock: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 25,
  },
});

export default class CurrencyManageCell extends React.Component {
  constructor(props) {
    super(props);

    this.state = CurrencyStore.getState();
  }

  componentDidMount() {
    CurrencyStore.listen((state) => this.onCurrencyStoreChange(state));
  }

  componentWillUnmount() {
    CurrencyStore.unlisten((state) => this.onCurrencyStoreChange(state));
  }

  onCurrencyStoreChange(state) {
    this.setState({
      currencies: state.currencies,
    });
  }

  toggleCurrency(currency, value) {
    console.log(currency, value);
    if (value === true) {
      CurrencyActions.addCurrency(currency);
    } else {
      CurrencyActions.removeCurrency(currency);
    }
  }

  render() {
    return (
      <TouchableHighlight>
        <View style={styles.container}>
          <View style={styles.firstBlock}>
            <Text style={styles.firstBlockText}>
              {this.props.currency}
            </Text>
          </View>
          <View style={styles.secondBlock}>
            <Switch
              onValueChange={() => this.toggleCurrency(this.props.currency)}
              value={this.state.currencies.indexOf(this.props.currency) !== -1}
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

CurrencyManageCell.propTypes = {
  title: React.PropTypes.string,
  currency: React.PropTypes.string,
  toggleCurrency: React.PropTypes.string,
};

CurrencyManageCell.defaultProps = {
  title: '',
};
