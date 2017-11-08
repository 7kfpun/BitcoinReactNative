import React from 'react';

import {
  Text,
  View,
} from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

export default class TabIcon extends React.PureComponent {
  render() {
    return (
      <View style={{
        alignItems: 'center',
        ...ifIphoneX({
          paddingBottom: 60,
        }, {}),
      }}
      >
        <Text style={{ color: this.props.selected ? '#00B9EA' : 'gray', fontSize: 15 }} >{this.props.title}</Text>
      </View>
    );
  }
}

TabIcon.propTypes = {
  title: React.PropTypes.string,
  selected: React.PropTypes.bool,
};

TabIcon.defaultProps = {
  title: '',
  selected: false,
};
