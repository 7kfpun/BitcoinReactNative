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

// Flux
import CurrencyActions from '../actions/currency-actions';
import CurrencyStore from '../stores/currency-store';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { AdMobBanner } from 'react-native-admob';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import Slider from 'react-native-slider';
import timer from 'react-native-timer';

import moment from 'moment';

import CurrencyCell from '../components/currency-cell';

import { config } from '../config';

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
      value: 1,
      btctoothers: true,
      refreshing: false,
      key: Math.random(),
    }, CurrencyStore.getState());
  }

  componentDidMount() {
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

  prepareRows() {
    this.setState({refreshing: true});
    CurrencyActions.updatePrice();
    this.setState({refreshing: false});
  }

  onActionSelected(position) {
    if (position === 0) {  // index of 'Add'
      Actions.add();
    }
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          statusBar={{tintColor: '#455A64', style: 'light-content'}}
          style={styles.navigatorBarIOS}
          title={{title: this.props.title, tintColor: 'white'}}
          rightButton={<Icon
                        style={styles.navigatorRightButton}
                        name="add"
                        size={26}
                        color="white"
                        onPress={Actions.add} />}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          style={styles.toolbar}
          title={this.props.title}
          titleColor="white"
          actions={[
            {title: 'Add', iconName: 'add', iconSize: 26, show: 'always'},
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
              onRefresh={this.prepareRows.bind(this)}
            />
          }
          dataSource={this.state.dataSource}
          renderRow={(currency) => <CurrencyCell
                                    btctoothers={this.state.btctoothers}
                                    currency={currency}
                                    bitcoinData={this.state.bitcoinData}
                                    bitcoinDataPrevious={this.state.bitcoinDataPrevious}
                                    unit={this.state.value} />}
        />

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => this.setState({
              btctoothers: !this.state.btctoothers,
              value: !this.state.btctoothers && this.state.value > 100 ? 100 : this.state.value,
              key: Math.random(),
            })}>
            <View>
              {this.state.btctoothers && <View style={styles.convert}>
                <Text>{this.state.value} bitcoin</Text>
                <Icon style={{marginHorizontal: 15}} name="compare-arrows" size={20} />
                <Text>x currency</Text>
              </View>}
              {!this.state.btctoothers && <View style={styles.convert}>
                <Text>{this.state.value} currency</Text>
                <Icon style={{marginHorizontal: 15}} name="compare-arrows" size={20} />
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
            thumbTintColor="#1A9274"
            value={this.state.value}
            onValueChange={(value) => {this.setState({value}); this.setState({key: Math.random()});}} />
          <View style={styles.timestampBlock}>
            <Text key={this.state.key}>{moment(new Date(this.state.timestamp)).format('LLLL')}</Text>
          </View>
        </View>

        {Platform.OS === 'android' && <AdMobBanner bannerSize={"smartBannerPortrait"} adUnitID={config.adUnitID.android} />}
        {Platform.OS === 'ios' && <AdMobBanner bannerSize={"smartBannerPortrait"} adUnitID={config.adUnitID.ios} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
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
});
