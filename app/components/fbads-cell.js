import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { withNativeAd } from 'react-native-fbads';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 5,
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CCCCCC',
    backgroundColor: 'white',
  },
  iconAction: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 3,
    marginTop: 4,
  },
  action: {
    fontSize: 13,
    color: 'white',
  },
  title: {
    fontSize: 13,
    fontWeight: '300',
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '300',
    fontStyle: 'italic',
  },
  description: {
    fontSize: 11,
    fontWeight: '300',
    opacity: 0.8,
  },
});

const FullNativeAd = withNativeAd(({ nativeAd }) => (
  <View style={styles.container}>
    {nativeAd.icon && (
      <View style={styles.iconAction}>
        <Image style={styles.icon} source={{ uri: nativeAd.icon }} />
        <View style={styles.button}>
          <Text style={styles.action}>{nativeAd.callToActionText}</Text>
        </View>
      </View>
    )}
    {!nativeAd.icon && (
      <View style={styles.button}>
        <Text style={styles.action}>{nativeAd.callToActionText}</Text>
      </View>
    )}
    <View style={{ flex: 1, padding: 8 }}>
      <Text style={styles.title}>{nativeAd.title}</Text>
      {nativeAd.subtitle && (
        <Text style={styles.subtitle}>{nativeAd.subtitle}</Text>
      )}
      {nativeAd.description && (
        <Text style={styles.description}>{nativeAd.description}</Text>
      )}
    </View>
    {/* <TouchableOpacity style={{ position: 'absolute', top: 5, right: 5, backgroundColor: '#E0E0E0' }} onPress={() => this.setState({ isFbAdsHided: true })} >
      <Icon name="close" size={14} color="#424242" />
    </TouchableOpacity> */}
  </View>
));

export default FullNativeAd;
