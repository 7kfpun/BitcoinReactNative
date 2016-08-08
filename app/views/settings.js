import React from 'react';
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { AdMobBanner } from 'react-native-admob';
import {
  Cell,
  Section,
  TableView
} from 'react-native-tableview-simple';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';

import { config } from '../config';

export default class Main extends React.Component {
  onActionSelected(position) {
    if (position === 0) {  // index of 'Done'
      Actions.pop();
    }
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          statusBar={{tintColor: '#455A64', style: 'light-content'}}
          style={styles.navigatorBarIOS}
          title={{title: this.props.title, tintColor: 'white'}}
          rightButton={{
            title: 'Done',
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
            {title: 'Done', iconName: 'check', iconSize: 26, show: 'always'},
          ]}
          onActionSelected={(position) => this.onActionSelected(position)}
        />
      );
    }
  }

  render() {
    GoogleAnalytics.trackScreenView('settings');
    return (
      <View style={styles.container}>
        {this.renderToolbar()}

        <ScrollView contentContainerStyle={styles.stage}>
          <TableView>
            <Section header="INFO">
              <Cell cellstyle="RightDetail" title="Disclaimer" onPress={() => Alert.alert(
                'Disclaimer',
                'All data is gathered from Bitcoin Average, we do not guarantee its accuracy for any use.\n\nNothing presented here is an investment recommendation and any data or content should not be relied upon for any investment activities.\n\nIn no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this app.',
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ]
              )} />
              <Cell cellstyle="RightDetail" title="Rate us!" onPress={() => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('itms-apps://itunes.apple.com/app/id1123557731');
                } else if (Platform.OS === 'android') {
                  Linking.openURL('market://details?id=com.kfpun.bitcoin');
                }}}
              />
            </Section>

            <Section header="OTHERS">
              <Cell cellstyle="RightDetail" title="View More by This Developer" onPress={() => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('https://itunes.apple.com/us/developer/kf-pun/id1116896894');
                } else if (Platform.OS === 'android') {
                  Linking.openURL('https://play.google.com/store/apps/developer?id=Kf');
                }}}
              />
            </Section>
          </TableView>
        </ScrollView>

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
