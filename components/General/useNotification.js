import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { useEffect } from 'react';
import { Platform } from 'react-native';

const useNotification = () => {
  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notifications!');
        return;
      }

      // For iOS, ensure notifications are displayed when the app is in foreground
      if (Platform.OS === 'ios') {
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
          }),
        });
      }
    };

    registerForPushNotificationsAsync();
  }, []);
};

export default useNotification;
