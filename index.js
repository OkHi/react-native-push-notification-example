/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import * as OkHi from 'react-native-okhi';

OkHi.initialize({
  credentials: {
    branchId: '<my_branch_id>',
    clientKey: '<my_client_key>',
  },
  context: {
    mode: 'prod',
  },
  notification: {
    title: 'Address verification in progress',
    text: 'Tap here to view your verification status.',
    channelId: 'okhi',
    channelName: 'OkHi Channel',
    channelDescription: 'OkHi verification alerts',
  },
})
  .then(() => console.log('init done'))
  .catch(console.log);

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  OkHi.onMessageReceived();
});

AppRegistry.registerComponent(appName, () => App);
