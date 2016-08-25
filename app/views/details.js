import React from 'react';
import {
  Text,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

// Flux
import CurrencyStore from '../stores/currency-store';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { AdMobBanner } from 'react-native-admob';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';

import { config } from '../config';
import currencies from '../utils/currencies';

import I18n from '../utils/i18n';

export default class Main extends React.Component {
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
      bitcoinData: state.bitcoinData,
      bitcoinDataPrevious: state.bitcoinDataPrevious,
      timestamp: state.timestamp,
    });
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          statusBar={{tintColor: '#455A64', style: 'light-content'}}
          style={styles.navigatorBarIOS}
          title={{title: this.props.title, tintColor: 'white'}}
          leftButton={<Icon
                        style={styles.navigatorLeftButton}
                        name="arrow-back"
                        size={26}
                        color="white"
                        onPress={Actions.pop} />}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          navIconName="arrow-back"
          onIconClicked={Actions.pop}
          style={styles.toolbar}
          title={this.props.title}
          titleColor="white"
        />
      );
    }
  }

  renderDetails() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.bitcoinData[this.props.currency]['24h_avg'] && <Text style={styles.detailsText}><Text style={styles.detailsBlackText}>{I18n.t('24h_average')}</Text> {this.state.bitcoinData[this.props.currency]['24h_avg']} / BTC</Text>}
        <Text style={styles.detailsText}><Text style={styles.detailsBlackText}>{I18n.t('ask')}</Text> {this.state.bitcoinData[this.props.currency].ask} / BTC</Text>
        <Text style={styles.detailsText}><Text style={styles.detailsBlackText}>{I18n.t('bid')}</Text> {this.state.bitcoinData[this.props.currency].bid} / BTC</Text>
        <Text style={styles.detailsText}><Text style={styles.detailsBlackText}>{I18n.t('last')}:</Text> {this.state.bitcoinData[this.props.currency].last} / BTC</Text>
      </View>
    );
  }

  render() {
    GoogleAnalytics.trackScreenView('details');
    if (this.props.btctoothers) {
      return (
        <View style={styles.container}>
          {this.renderToolbar()}
          <View style={styles.body}>
            <View style={styles.firstBlock}>
              <Text style={styles.firstBlockText}>
                {this.props.unit} BTC
              </Text>
            </View>
            <View style={styles.secondBlock}>
              {this.state.bitcoinData && this.state.bitcoinData[this.props.currency]
                && <Text style={styles.priceText}>
                    <Text style={this.state.bitcoinData[this.props.currency].last > this.state.bitcoinDataPrevious[this.props.currency].last
                                ? styles.priceGreenText
                                : this.state.bitcoinData[this.props.currency].last < this.state.bitcoinDataPrevious[this.props.currency].last
                                ? styles.priceRedText : null}>
                      {(this.props.unit * this.state.bitcoinData[this.props.currency].last).toFixed(2)}
                    </Text>
                    {' ' + this.props.currency}
                  </Text>}
              <Text style={styles.currencyName}>{currencies[this.props.currency]}</Text>
            </View>
            {this.renderDetails()}
          </View>

          {Platform.OS === 'android' && <AdMobBanner bannerSize={"smartBannerPortrait"} adUnitID={config.adUnitID.android} />}
          {Platform.OS === 'ios' && <AdMobBanner bannerSize={"smartBannerPortrait"} adUnitID={config.adUnitID.ios} />}
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          {this.renderToolbar()}
          <View style={styles.body}>
            <View style={styles.firstBlock}>
              <Text style={styles.firstBlockText}>
                {this.props.unit + ' ' + this.props.currency}
              </Text>
              <Text style={[styles.currencyName, {textAlign: 'left'}]}>{currencies[this.props.currency]}</Text>
            </View>
            <View style={styles.secondBlock}>
              {this.state.bitcoinData && this.state.bitcoinData[this.props.currency]
                && <Text style={styles.priceText}>
                    <Text style={this.state.bitcoinData[this.props.currency].last > this.state.bitcoinDataPrevious[this.props.currency].last
                                ? styles.priceRedText
                                : this.state.bitcoinData[this.props.currency].last < this.state.bitcoinDataPrevious[this.props.currency].last
                                ? styles.priceGreenText : null}>
                      {(this.props.unit / this.state.bitcoinData[this.props.currency].last).toFixed(4)}
                    </Text>
                    {' BTC'}
                  </Text>}
            </View>
            {this.renderDetails()}
          </View>

          {Platform.OS === 'android' && <AdMobBanner bannerSize={"smartBannerPortrait"} adUnitID={config.adUnitID.android} />}
          {Platform.OS === 'ios' && <AdMobBanner bannerSize={"smartBannerPortrait"} adUnitID={config.adUnitID.ios} />}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
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
  body: {
    flex: 1,
    margin: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  firstBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  firstBlockText: {
    fontSize: 35,
    color: '#212121',
    textAlign: 'center',
  },
  secondBlock: {
    flex: 1,
  },
  priceText: {
    fontSize: 38,
    color: '#212121',
    textAlign: 'center',
  },
  priceRedText: {
    color: '#FC3D39',
  },
  priceGreenText: {
    color: '#53D769',
  },
  currencyName: {
    fontSize: 20,
    color: '#757575',
    textAlign: 'center',
  },
  detailsBlackText: {
    color: '#212121',
  },
  detailsText: {
    fontSize: 18,
    color: '#757575',
    textAlign: 'center',
  },
});
