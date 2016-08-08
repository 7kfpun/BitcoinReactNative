import React from 'react';

// 3rd party libraries
import {
  Actions,
  Router,
  Scene,
} from 'react-native-router-flux';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

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

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="main" title="Bitcoin Calculator" component={MainView} hideNavBar={true} initial={true} />
    <Scene key="settings" title="Settings" component={SettingsView} hideNavBar={true} direction="vertical"/>
    <Scene key="add" title="Add" component={AddView} hideNavBar={true} direction="vertical"/>
  </Scene>
);

export default class Periods extends React.Component {
  render() {
    return <Router scenes={scenes} />;
  }
}
