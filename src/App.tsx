import { Navigation } from 'react-native-navigation';
import Icon, { FA5Style } from 'react-native-vector-icons/FontAwesome5';
import { addCallback } from 'reactn';
import { UIManager } from 'react-native';
import Promise from 'bluebird';

import {
  registerAppScreens,
  REGISTER,
  HOME,
  LOGIN,
  TOURNAMENTS,
  NOTIFICATIONS,
  MY_PROFILE,
} from './screens';
import { initApolloClient } from './apollo';
import { initGlobal, ROOT, IGlobalState } from './global';
import { BOTTOM_TAB_ICON_SIZE, colors } from './config/styles';

global.Promise = Promise;

// activate LayoutAnimation on android
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

let oldRoot: ROOT;
const handleRootChange = (globalState: IGlobalState) => {
  const { root } = globalState;

  if (oldRoot !== root) {
    startApp(root);
  }

  return null;
};

const getImg = (name: string) =>
  Icon.getImageSource(name, BOTTOM_TAB_ICON_SIZE, undefined, FA5Style.solid);
let appIcons: any[];
const getAppIcons = async () => {
  if (!appIcons) {
    appIcons = await Promise.all([
      getImg('stream'),
      getImg('trophy'),
      getImg('bell'),
      getImg('user-alt'),
    ]);
  }

  return appIcons;
};

const startApp = async (root: ROOT) => {
  console.log('START APP:', root);
  oldRoot = root;

  Navigation.setDefaultOptions({
    topBar: {
      animate: true,
      // @ts-ignore 2322
      leftButtonColor: '#000',
      rightButtonColor: '#000',
      alignment: 'center',
      title: {
        alignment: 'center',
        color: '#000',
      },
      backButton: {
        color: '#000',
        title: '',
        showTitle: false,
      },
    },
    bottomTabs: {
      animate: true,
      titleDisplayMode: 'alwaysShow',
      currentTabIndex: 0, // TODO: dev remove
    },
    bottomTab: {
      selectedIconColor: colors.primary,
    },
  });

  switch (root) {
    case ROOT.REGISTER:
    default:
      Navigation.setRoot({
        root: {
          component: {
            name: REGISTER,
          },
        },
      });
      break;
    case ROOT.LOGIN:
      Navigation.setRoot({
        root: {
          component: {
            name: LOGIN,
          },
        },
      });
      break;
    case ROOT.HOME:
      const [
        homeIcon,
        tournamentsIcon,
        notificationsIcon,
        profileIcon,
      ] = await getAppIcons();

      Navigation.setRoot({
        root: {
          bottomTabs: {
            children: [
              {
                stack: {
                  children: [
                    {
                      component: {
                        name: HOME,
                      },
                    },
                  ],
                  options: {
                    bottomTab: {
                      text: 'Feed',
                      icon: homeIcon,
                    },
                  },
                },
              },
              {
                stack: {
                  children: [
                    {
                      component: {
                        name: TOURNAMENTS,
                      },
                    },
                  ],
                  options: {
                    bottomTab: {
                      text: 'Tournaments',
                      icon: tournamentsIcon,
                    },
                  },
                },
              },
              {
                stack: {
                  children: [
                    {
                      component: {
                        name: NOTIFICATIONS,
                      },
                    },
                  ],
                  options: {
                    bottomTab: {
                      text: 'Notifications',
                      icon: notificationsIcon,
                    },
                  },
                },
              },
              {
                stack: {
                  children: [
                    {
                      component: {
                        name: MY_PROFILE,
                      },
                    },
                  ],
                  options: {
                    bottomTab: {
                      text: 'You',
                      icon: profileIcon,
                    },
                  },
                },
              },
            ],
          },
        },
      });
      break;
  }
};

const initApp = async () => {
  const { root } = await initGlobal();

  const apolloClient = initApolloClient();
  registerAppScreens(apolloClient);

  startApp(root);
  addCallback(handleRootChange);
};

initApp();
