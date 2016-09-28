import React from 'react';
import {
  ListView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';

// Flux
import CurrencyStore from '../stores/currency-store';

import CurrencyManageCell from '../components/currency-manage-cell';

import I18n from '../utils/i18n';

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
});

export default class AddView extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
      key: Math.random(),
    }, CurrencyStore.getState());
  }

  componentDidMount() {
    CurrencyStore.listen((state) => this.onCurrencyStoreChange(state));

    this.prepareRows();
  }

  componentWillUnmount() {
    CurrencyStore.unlisten((state) => this.onCurrencyStoreChange(state));
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

  prepareRows() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(Object.keys(this.state.bitcoinData)),
      key: Math.random(),
    });
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          statusBar={{ tintColor: '#455A64', style: 'light-content' }}
          style={styles.navigatorBarIOS}
          title={{ title: this.props.title, tintColor: 'white' }}
          rightButton={{
            title: I18n.t('done'),
            tintColor: '#3CABDA',
            handler: Actions.pop,
          }}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          style={styles.toolbar}
          title={this.props.title}
          titleColor="white"
          actions={[
            { title: I18n.t('done'), iconName: 'check', iconSize: 26, show: 'always' },
          ]}
          onActionSelected={(position) => this.onActionSelected(position)}
        />
      );
    }
  }

  render() {
    GoogleAnalytics.trackScreenView('add');
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <ListView
          key={this.state.key}
          dataSource={this.state.dataSource}
          renderRow={(currency) => <CurrencyManageCell currency={currency} />}
        />
      </View>
    );
  }
}

AddView.propTypes = {
  title: React.PropTypes.string,
};

AddView.defaultProps = {
  title: '',
};
