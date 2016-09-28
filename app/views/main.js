import React from 'react';
import {
  ListView,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { AdMobInterstitial } from 'react-native-admob';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import Slider from 'react-native-slider';
import timer from 'react-native-timer';

import moment from 'moment';

// Flux
import CurrencyActions from '../actions/currency-actions';
import CurrencyStore from '../stores/currency-store';

// Components
import AdmobCell from '../components/admob-cell';
import CurrencyCell from '../components/currency-cell';

import { config } from '../config';

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
  convert: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EEEEEE',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEEEEE',
  },
  timestampBlock: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumb: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    backgroundColor: 'white',
    borderColor: '#30A935',
    borderWidth: 2,
  },
});

export default class MainView extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
      value: 1,
      btctoothers: true,
      refreshing: false,
      key: Math.random(),
    }, CurrencyStore.getState());
  }

  componentDidMount() {
    timer.clearTimeout(this);
    AdMobInterstitial.setAdUnitID(config.admob[Platform.OS].interstital);
    timer.setTimeout(this, 'AdMobInterstitial', () => {
      AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd((error) => error && console.log(error)));
    }, 1000 * 10);

    CurrencyStore.listen((state) => this.onCurrencyStoreChange(state));

    this.prepareRows();
    timer.setInterval(this, 'prepareRows', () => CurrencyActions.updatePrice(), 10000);
  }

  componentWillUnmount() {
    CurrencyStore.unlisten((state) => this.onCurrencyStoreChange(state));

    timer.clearInterval(this);
  }

  onCurrencyStoreChange(state) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(state.currencies),
      bitcoinData: state.bitcoinData,
      bitcoinDataPrevious: state.bitcoinDataPrevious,
      timestamp: state.timestamp,
      key: Math.random(),
    });
  }

  onActionSelected(position) {
    if (position === 0) {  // index of 'Add'
      Actions.add();
    } else if (position === 1) {  // index of 'Settings'
      Actions.more();
    }
  }

  prepareRows() {
    this.setState({ refreshing: true });
    CurrencyActions.updatePrice();
    this.setState({ refreshing: false });
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          statusBar={{ tintColor: '#455A64', style: 'light-content' }}
          style={styles.navigatorBarIOS}
          title={{ title: this.props.title, tintColor: 'white' }}
          leftButton={<Icon
            style={styles.navigatorLeftButton}
            name="info-outline"
            size={26}
            color="white"
            onPress={Actions.more}
          />}
          rightButton={<Icon
            style={styles.navigatorRightButton}
            name="add"
            size={26}
            color="white"
            onPress={Actions.add}
          />}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          style={styles.toolbar}
          title={this.props.title}
          titleColor="white"
          actions={[
            { title: 'Add', iconName: 'add', iconSize: 26, show: 'always' },
            { title: 'Settings', iconName: 'info-outline', iconSize: 26, show: 'always' },
          ]}
          onActionSelected={(position) => this.onActionSelected(position)}
        />
      );
    }
  }

  render() {
    GoogleAnalytics.trackScreenView('main');
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <ListView
          key={this.state.key}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.prepareRows()}
            />
          }
          dataSource={this.state.dataSource}
          renderRow={(currency) => <CurrencyCell
            btctoothers={this.state.btctoothers}
            currency={currency}
            bitcoinData={this.state.bitcoinData}
            bitcoinDataPrevious={this.state.bitcoinDataPrevious}
            unit={this.state.value}
          />}
        />

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => this.setState({
              btctoothers: !this.state.btctoothers,
              value: !this.state.btctoothers && this.state.value > 100 ? 100 : this.state.value,
              key: Math.random(),
            })}
          >
            <View>
              {this.state.btctoothers && <View style={styles.convert}>
                {this.state.value <= 1 && <Text>{this.state.value} bitcoin</Text>}
                {this.state.value > 1 && <Text>{this.state.value} bitcoins</Text>}
                <Icon style={{ marginHorizontal: 15 }} name="compare-arrows" size={20} />
                <Text>x unit(s)</Text>
              </View>}
              {!this.state.btctoothers && <View style={styles.convert}>
                <Text>{this.state.value} unit(s)</Text>
                <Icon style={{ marginHorizontal: 15 }} name="compare-arrows" size={20} />
                <Text>x bitcoin(s)</Text>
              </View>}
            </View>
          </TouchableOpacity>
          <Slider
            minimumValue={1}
            maximumValue={this.state.btctoothers ? 100 : 10000}
            step={1}
            minimumTrackTintColor="#1FB28A"
            maximumTrackTintColor="#D3D3D3"
            thumbStyle={styles.thumb}
            value={this.state.value}
            onValueChange={(value) => { this.setState({ value }); this.setState({ key: Math.random() }); }}
          />
          <View style={styles.timestampBlock}>
            <Text key={this.state.key}>{moment(new Date(this.state.timestamp)).format('LLLL')}</Text>
          </View>
        </View>

        <AdmobCell />
      </View>
    );
  }
}

MainView.propTypes = {
  title: React.PropTypes.string,
};

MainView.defaultProps = {
  title: '',
};
