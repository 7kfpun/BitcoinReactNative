import React, { Component } from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import * as StoreReview from 'react-native-store-review';
import Icon from 'react-native-vector-icons/MaterialIcons';
import store from 'react-native-simple-store';
import timer from 'react-native-timer';

const STARS_TO_APP_STORE = 4;
const SHOW_RATING_AFTER = 30 * 60 * 1000;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 200,
    margin: 15,
    padding: 15,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 10,
  },
  button: {
    marginTop: 6,
    padding: 10,
    backgroundColor: '#3B5998',
    borderRadius: 2,
  },
  ratingTitleText: {
    fontSize: 16,
    marginTop: 20,
  },
  ratingDescriptionText: {
    fontSize: 14,
    marginVertical: 15,
    textAlign: 'center',
  },
  feedbackDescriptionText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  close: {
    position: 'absolute',
    padding: 5,
    top: 6,
    right: 10,
  },
});

export default class Rating extends Component {
  state = {
    starCount: 0,
    isRatingClose: false,
  };

  componentDidMount() {
    const that = this;
    store.get('isRatingGiven').then((isRatingGiven) => {
      if (isRatingGiven) {
        that.setState({ isRatingClose: true });
      }
    });
  }

  openFeedbackUrl = () => {
    Linking.openURL('https://goo.gl/forms/Vng3RgmkSpSMnel52');
    const that = this;
    timer.setTimeout(that, 'openFeedbackUrl', () => {
      this.setState({ isRatingClose: true });
    }, 2000);
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    });

    let type;
    if (rating >= STARS_TO_APP_STORE) {
      if (StoreReview.isAvailable) {
        StoreReview.requestReview();
        type = 'inapp-store-review';
      } else if (Platform.OS === 'ios') {
        Linking.openURL('itms-apps://itunes.apple.com/app/id1123557731');
        type = 'apple-store';
      } else if (Platform.OS === 'android') {
        Linking.openURL('market://details?id=com.kfpun.bitcoin');
        type = 'google-play';
      }

      const that = this;
      timer.setTimeout(that, 'isRatingClose', () => {
        this.setState({ isRatingClose: true });
      }, 2000);
    }

    store.save('isRatingGiven', true);
  }

  render() {
    if (this.state.isRatingClose) {
      return null;
    }

    return (
      <Animatable.View style={styles.container} animation="fadeIn">
        <TouchableOpacity style={styles.close} onPress={() => this.setState({ isRatingClose: true })}>
          <Icon name="clear" size={24} color="#616161" />
        </TouchableOpacity>
        <Icon name="thumb-up" size={32} color="#616161" />
        <Text style={styles.ratingTitleText}>{'Enjoy Bitcoin Calculator?'}</Text>
        <Text style={styles.ratingDescriptionText}>{'Please give us 5 stars to cheer we up if you like this app.'}</Text>
        {this.state.starCount === 0 && <View style={{ flexDirection: 'row' }}>
          <Icon name={this.state.starCount >= 1 ? 'star' : 'star-border'} size={26} color="#616161" onPress={() => this.onStarRatingPress(1)} />
          <Icon name={this.state.starCount >= 2 ? 'star' : 'star-border'} size={26} color="#616161" onPress={() => this.onStarRatingPress(2)} />
          <Icon name={this.state.starCount >= 3 ? 'star' : 'star-border'} size={26} color="#616161" onPress={() => this.onStarRatingPress(3)} />
          <Icon name={this.state.starCount >= 4 ? 'star' : 'star-border'} size={26} color="#616161" onPress={() => this.onStarRatingPress(4)} />
          <Icon name={this.state.starCount >= 5 ? 'star' : 'star-border'} size={26} color="#616161" onPress={() => this.onStarRatingPress(5)} />
        </View>}
        {this.state.starCount > 0 &&
          this.state.starCount < STARS_TO_APP_STORE &&
          <TouchableOpacity onPress={this.openFeedbackUrl}>
            <Animatable.View style={styles.button} animation="fadeIn">
              <Text style={styles.feedbackDescriptionText}>{'Give us some feedbacks. We will definitely keep improving.'}</Text>
            </Animatable.View>
          </TouchableOpacity>}
      </Animatable.View>
    );
  }
}
