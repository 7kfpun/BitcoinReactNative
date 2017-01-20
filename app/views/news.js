import React from 'react';
import {
  Linking,
  ListView,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { NativeAdsManager } from 'react-native-fbads';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';

import moment from 'moment';

// Components
import AdmobCell from '../components/admob-cell';
import FbAdsCell from '../components/fbads-cell';

import rss from '../utils/rss';

import { config } from '../config';

const adsManager = new NativeAdsManager(config.fbads[Platform.OS].native);

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
  card: {
    padding: 10,
    backgroundColor: 'white',
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontWeight: '400',
  },
  body: {
    fontWeight: '200',
    marginTop: 10,
  },
});

export default class NewsView extends React.Component {
  constructor(props) {
    super(props);

    this.dataSource = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });

    this.state = {
      dataSource: this.dataSource.cloneWithRows([]),
      refreshing: false,
    };
  }

  componentDidMount() {
    this.prepareRows();
  }

  onActionSelected(position) {
    if (position === 0) {  // index of 'Settings'
      Actions.more();
    }
  }

  prepareRows() {
    this.setState({
      refreshing: true,
    });

    const that = this;
    rss('https://www.google.com.hk/alerts/feeds/11814817070903655005/3734401395512079727')
      .then((json) => {
        console.log(json);
        if (json.query && json.query.results && json.query.results.entry) {
          that.setState({
            dataSource: this.dataSource.cloneWithRows(json.query.results.entry),
            key: Math.random(),
          });
        }
        that.setState({
          refreshing: false,
        });
      });
  }

  removeTag(text) {
    let tempText = text.replace(/(<([^>]+)>)/g, '');
    const entities = [
      ['amp', '&'],
      ['apos', '\''],
      ['#x27', '\''],
      ['#x2F', '/'],
      ['#39', '\''],
      ['#47', '/'],
      ['lt', '<'],
      ['gt', '>'],
      ['nbsp', ' '],
      ['quot', '"'],
    ];

    for (let i = 0, max = entities.length; i < max; ++i) {
      tempText = tempText.replace(new RegExp(`&${entities[i][0]};`, 'g'), entities[i][1]);
    }

    return tempText;
  }

  openURL(item) {
    if (item.link) {
      Linking.openURL(item.link.href);
    }
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
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          style={styles.toolbar}
          title={this.props.title}
          titleColor="white"
          actions={[
            { title: 'Settings', iconName: 'info-outline', iconSize: 26, show: 'always' },
          ]}
          onActionSelected={position => this.onActionSelected(position)}
        />
      );
    }
  }

  render() {
    GoogleAnalytics.trackScreenView('news');
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.prepareRows()}
            />
          }
          dataSource={this.state.dataSource}
          renderRow={(item, secId, rowId) => <View>
            <TouchableHighlight underlayColor="#EFEFF4" onPress={() => this.openURL(item)}>
              <View style={styles.card}>
                <Text style={styles.title}>{item.title && this.removeTag(item.title.content)}</Text>
                <Text style={styles.body}>{item.published && moment(item.published).fromNow()}</Text>
                <Text style={styles.body}>{item.content && this.removeTag(item.content.content)}</Text>
              </View>
            </TouchableHighlight>
            {rowId % 10 === 0 && <FbAdsCell adsManager={adsManager} />}
          </View>}
        />

        <AdmobCell />
      </View>
    );
  }
}

NewsView.propTypes = {
  title: React.PropTypes.string,
};

NewsView.defaultProps = {
  title: '',
};
