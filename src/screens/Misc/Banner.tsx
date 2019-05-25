import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getNavBarHeight } from '../../utils';
import { TextX } from '../../components';
import { colors } from '../../config/styles';
import { ScreenComponentProps } from '..';

const initialOpacity = 0;
const navBarHeight = getNavBarHeight();

type NotificationTypeValue =
  | 'error'
  | 'success'
  | 'warning'
  | 'information'
  | 'no-network';

export const getNotificationOptions = (type?: NotificationTypeValue) => {
  switch (type) {
    case 'success': {
      return {
        icon: 'check-circle',
        color: colors.success,
        message: 'Success!',
      };
    }
    case 'warning': {
      return {
        icon: 'exclamation-circle',
        color: colors.warning,
        message: 'Warning!',
      };
    }
    case 'error': {
      return {
        icon: 'times-circle',
        color: colors.error,
        message: 'There was an error!',
      };
    }
    case 'no-network': {
      return {
        icon: 'signal',
        color: '#000',
        message: 'There are no active network connections!',
      };
    }
    default: {
      return {
        icon: 'info-circle',
        color: colors.information,
        message: 'Notification message',
      };
    }
  }
};

export interface BannerProps extends ScreenComponentProps {
  timeout?: number;
  // you can specify onPress & onDismiss as separate actions,
  // or use onPressOrDismiss to trigger an action
  onPress?: () => void;
  onDismiss?: () => void;
  onPressOrDismiss?: () => void;
  type?: NotificationTypeValue;
}
export class Banner extends React.Component<
  BannerProps,
  { animatedPosition: Animated.Value }
> {
  static defaultProps = {
    timeout: 3500,
    type: 'error',
  };

  static options() {
    return {
      overlay: {
        interceptTouchOutside: true,
      },
    };
  }

  appearAnimation: any;
  disappearAnimation: any;

  constructor(props: BannerProps) {
    super(props);
    this.state = {
      animatedPosition: new Animated.Value(initialOpacity),
    };
    Navigation.events().bindComponent(this);
    this.appearAnimation = null;
    this.disappearAnimation = null;
  }

  componentDidAppear() {
    const { timeout = 0 } = this.props;

    this.appearAnimation = Animated.timing(this.state.animatedPosition, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && timeout > 0) {
        this.dismissNotification(timeout);
      }
    });
  }

  dismissNotification = (delay = 0, onPress?: () => void) => {
    const {
      componentId,
      onDismiss: rawOnDismiss,
      onPressOrDismiss,
    } = this.props;
    const onDismiss = onPressOrDismiss || rawOnDismiss;

    this.appearAnimation && this.appearAnimation.stop();
    this.disappearAnimation && this.disappearAnimation.stop();

    this.disappearAnimation = Animated.timing(this.state.animatedPosition, {
      toValue: 0,
      duration: onPress ? 100 : 400,
      easing: Easing.in(Easing.ease),
      delay,
      useNativeDriver: true,
    });

    this.disappearAnimation.start(({ finished }: { finished: boolean }) => {
      if (finished) {
        !onPressOrDismiss && onPress && onPress();
        Navigation.dismissOverlay(componentId)
          .catch(() => {})
          .finally(() => {
            onDismiss && onDismiss();
          });
      }
    });
  };

  handlePress = () => {
    const { type } = this.props;
    if (type !== 'no-network') {
      this.dismissNotification(0, this.props.onPress);
    }
  };

  render() {
    const { animatedPosition } = this.state;
    const { type } = this.props;
    const { message, icon, color } = {
      ...getNotificationOptions(type),
      ...this.props,
    };
    const animatedStyle = {
      opacity: animatedPosition,
      transform: [
        {
          translateY: animatedPosition.interpolate({
            inputRange: [0, 1],
            outputRange: [-100, navBarHeight],
          }),
        },
      ],
    };

    return (
      <Animated.View style={[styles.container, animatedStyle]}>
        <SafeAreaView />
        <TouchableWithoutFeedback
          onPress={this.handlePress}
          onLongPress={this.handlePress}
          delayLongPress={150}
        >
          <View style={[styles.warning, { backgroundColor: color }]}>
            <Icon name={icon} size={25} color="#fff" />
            <View style={{ marginRight: 15 }} />

            <View style={styles.textContainer}>
              <Text>
                <TextX style={styles.whiteText}>{message}</TextX>
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 1000,
    elevation: 3,
    paddingHorizontal: 13,
  },
  warning: {
    backgroundColor: colors.warning,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    minHeight: 40,
  },
  textContainer: {
    flex: 1,
  },
  icon: {
    marginRight: 14,
  },
  whiteText: {
    color: '#fff',
    fontSize: 16,
  },
});
