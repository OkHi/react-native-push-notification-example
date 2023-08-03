/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Button, View, ActivityIndicator} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {
  OkHiUser,
  OkCollectSuccessResponse,
  OkHiLocationManager,
  request,
  isLocationServicesEnabled,
  requestNotificationPermission,
  onNewToken,
} from 'react-native-okhi';

let USER: OkHiUser = {
  firstName: 'Jane',
  lastName: 'Doe',
  phone: '+254700000000',
  email: 'jane@myemail.com',
};

const App = () => {
  const [launch, setLaunch] = useState(false);

  useEffect(() => {
    return messaging().onTokenRefresh(onNewToken);
  }, []);

  const fetchPushNotificationToken = async () => {
    return messaging().getToken();
  };

  const handleVerifyAddress = async () => {
    const locationServicesAvailable = await isLocationServicesEnabled();
    if (locationServicesAvailable) {
      request('always', null, async (status, _) => {
        if (status === 'authorizedAlways') {
          const notificationPermissionStatus =
            await requestNotificationPermission();
          if (notificationPermissionStatus) {
            const fcmToken = await fetchPushNotificationToken();
            USER.fcmPushNotificationToken = fcmToken;
            setLaunch(true);
          }
        }
      });
    }
  };

  const handleOnSuccess = async (response: OkCollectSuccessResponse) => {
    response
      .startVerification()
      .then(locationId => {
        console.log('started verification for: ' + locationId);
      })
      .catch(error => {
        console.log(error.code);
        console.log(error.message);
      })
      .finally(() => {
        setLaunch(false);
      });
  };

  const renderLoader = () => {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator color="teal" />
      </View>
    );
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button title="Verify an address" onPress={handleVerifyAddress} />
      <OkHiLocationManager
        launch={launch}
        user={{...USER}}
        onCloseRequest={() => setLaunch(false)}
        onError={console.log}
        onSuccess={handleOnSuccess}
        config={{streetView: true}}
        loader={renderLoader()}
        theme={{
          appBar: {
            backgroundColor: '#333',
            logo: 'https://cdn.okhi.co/icon.png',
          },
          colors: {
            primary: '#333',
          },
        }}
      />
    </View>
  );
};

export default App;
