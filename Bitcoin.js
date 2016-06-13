import React from 'react';
import {
  Text,
  View,
} from 'react-native';

// 3rd party libraries
import {
  Actions,
  Router,
  Scene,
} from 'react-native-router-flux';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { config } from './app/config';
GoogleAnalytics.setTrackerId(config.trackerId);

// Views
import MainView from './app/views/main';
import SettingsView from './app/views/settings';
import AddView from './app/views/add';

// @todo remove when RN upstream is fixed
console.ignoredYellowBox = [
  'Warning: In next release empty section headers will be rendered.',
  'Warning: setState(...): Can only update a mounted or mounting component.',
];

class TabIcon extends React.Component {
  render() {
    return (
      <View style={{alignItems: 'center'}}>
        <Icon style={{color: this.props.selected ? '#455A64' : '#9E9E9E'}} name={this.props.tabIcon} size={24} />
        <Text style={{color: this.props.selected ? '#455A64' : '#9E9E9E', fontSize: 10}}>{this.props.tabName}</Text>
      </View>
    );
  }
}

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="tabbar" tabs={true}>
      <Scene key="main" title="Bitcoin Calculator" component={MainView} tabIcon="home" tabName="Home" icon={TabIcon} hideNavBar={true} initial={true} />
      <Scene key="settings" title="Settings" component={SettingsView} tabIcon="settings" tabName="Settings" icon={TabIcon} hideNavBar={true} />
    </Scene>

    <Scene key="add" title="Add" component={AddView} hideNavBar={true} direction="vertical"/>
  </Scene>
);

export default class Periods extends React.Component {
  render() {
    return <Router scenes={scenes} />;
  }
}
