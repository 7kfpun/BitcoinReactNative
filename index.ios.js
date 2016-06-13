import {
  AppRegistry,
  StatusBar,
} from 'react-native';
import Bitcoin from './Bitcoin';

StatusBar.setBarStyle('light-content', true);

AppRegistry.registerComponent('Bitcoin', () => Bitcoin);
