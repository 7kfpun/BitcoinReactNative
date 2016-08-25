import React from 'react';

// 3rd party libraries
import { Actions, Router, Scene } from 'react-native-router-flux';
import DeviceInfo from 'react-native-device-info';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

import I18n from './app/utils/i18n';
import { config } from './app/config';

GoogleAnalytics.setTrackerId(config.trackerId);

if (DeviceInfo.getDeviceName() === 'iPhone Simulator' || DeviceInfo.getManufacturer() === 'Genymotion') {
  GoogleAnalytics.setDryRun(true);
}

// Views
import MainView from './app/views/main';
import MoreView from './app/views/more';
import AddView from './app/views/add';
import DetailsView from './app/views/details';

// @todo remove when RN upstream is fixed
console.ignoredYellowBox = [
  'Warning: In next release empty section headers will be rendered.',
  'Warning: setState(...): Can only update a mounted or mounting component.',
];

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="main" title={I18n.t('main')} component={MainView} hideNavBar={true} initial={true} />
    <Scene key="add" title={I18n.t('add')} component={AddView} hideNavBar={true} direction="vertical"/>
    <Scene key="details" title={I18n.t('details')} component={DetailsView} hideNavBar={true} />
    <Scene key="more" title={I18n.t('more')} component={MoreView} hideNavBar={true} direction="vertical"/>
  </Scene>
);

export default class Periods extends React.Component {
  render() {
    return <Router scenes={scenes} />;
  }
}
