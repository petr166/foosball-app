import {
  Navigation,
  NavigationButtonPressedEvent,
} from 'react-native-navigation';
import { useEffect } from 'react';

export const useNavBtnPress = (
  handler: (event: NavigationButtonPressedEvent) => void,
  buttonId: string
) => {
  useEffect(() => {
    const listener = Navigation.events().registerNavigationButtonPressedListener(
      (event: NavigationButtonPressedEvent) => {
        if (event.buttonId === buttonId) {
          handler(event);
        }
      }
    );

    return () => {
      listener.remove();
    };
  }, [buttonId]);
};
