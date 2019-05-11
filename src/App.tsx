import { Navigation } from 'react-native-navigation';

import { registerAppScreens, REGISTER, HOME, LOGIN } from './screens';
import { initApolloClient } from './apollo';
import { initGlobal, ROOT, IGlobalState } from './global';
import { addCallback } from 'reactn';

let oldRoot: ROOT;
const handleRootChange = (globalState: IGlobalState) => {
  const { root } = globalState;

  if (oldRoot !== root) {
    startApp(root);
  }

  return null;
};

const startApp = (root: ROOT) => {
  console.log('START APP:', root);
  oldRoot = root;

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
      Navigation.setRoot({
        root: {
          component: {
            name: HOME,
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
