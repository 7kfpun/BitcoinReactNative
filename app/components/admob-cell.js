import React from 'react';

import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';

// 3rd party libraries
import { AdMobBanner, AdMobInterstitial } from 'react-native-admob';
import store from 'react-native-simple-store';
import timer from 'react-native-timer';

import { config } from '../config';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

export default class AdmobCell extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    timer.clearTimeout(this);
    timer.setInterval(this, 'adRefresh', () => this.setState({ adRefresh: Math.random() }), this.props.refreshInterval);

    store.get('isRatingGiven').then((isRatingGiven) => {
      if (isRatingGiven && Math.random() > 0.4) {
        timer.setTimeout(this, 'AdMobInterstitial', () => {
          AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd(error => error && console.log(error)));
        }, 1000 * 1);
      }
    });
  }

  componentWillUnmount() {
    timer.clearInterval(this);
  }

  render() {
    return (
      <View style={[styles.container, { margin: this.props.margin }]}>
        <AdMobBanner key={this.state.adRefresh} bannerSize={this.props.bannerSize} adUnitID={config.admob[Platform.OS].banner} />
      </View>
    );
  }
}

AdmobCell.propTypes = {
  margin: React.PropTypes.number,
  bannerSize: React.PropTypes.string,
  refreshInterval: React.PropTypes.number,
};

AdmobCell.defaultProps = {
  margin: 0,
  bannerSize: 'smartBannerPortrait',
  refreshInterval: 30000,
};
