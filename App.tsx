/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Button, View, Text} from 'react-native';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  const [token, setToken] = useState<null | string>(null);

  useEffect(() => {
    return messaging().onTokenRefresh(setToken);
  }, []);

  const isNotificationPermissionGranted = async () => {
    const result = await messaging().hasPermission();
    return (
      result === messaging.AuthorizationStatus.AUTHORIZED ||
      result === messaging.AuthorizationStatus.PROVISIONAL
    );
  };

  const handleNotificationPermissionRequest = async () => {
    const result = await isNotificationPermissionGranted();
    if (!result) {
      await messaging().requestPermission();
    }
  };

  const handleFetchNotificationTokenRequest = async () => {
    const result = await isNotificationPermissionGranted();
    if (result) {
      messaging().getToken().then(setToken);
    }
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button
        title="Request Notification Permission"
        onPress={handleNotificationPermissionRequest}
      />
      <Button
        title="Fetch Notification Token"
        onPress={handleFetchNotificationTokenRequest}
      />
      {token ? <Text>{token}</Text> : null}
    </View>
  );
};
export default App;
