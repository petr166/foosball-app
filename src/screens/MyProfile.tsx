import React, { useEffect, useState } from 'react';
import { useGlobal } from 'reactn';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Options } from 'react-native-navigation';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';

import { ProfileView } from '../components';
import { IScreenComponent, ScreenComponentProps } from './index';
import { IGlobalState } from '../global';
import { ImageURISource } from 'react-native';
import { useNavBtnPress } from '../hooks';
import { TOP_BAR_ICON_SIZE } from '../config/styles';
import { UserProfileFragment, GameFragment } from '../fragments';
import { mergeWith, isArray } from 'lodash';

const SETTINGS_ID = 'MyProfile.settings';

let settingsIcon: ImageURISource;
Icon.getImageSource('cog', TOP_BAR_ICON_SIZE).then(src => {
  settingsIcon = src;
});

const GET_USER = gql`
  query GetUser($id: ID!, $cursor: Int!) {
    user(id: $id) {
      ...UserProfileFragment
      games(first: 2, cursor: $cursor) {
        edges {
          node {
            ...GameFragment
          }
          cursor
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }

  ${UserProfileFragment}
  ${GameFragment}
`;

export interface MyProfileProps extends ScreenComponentProps {}
export const MyProfile: IScreenComponent<MyProfileProps> = () => {
  const [currentUser, setCurrentUser] = useGlobal<IGlobalState>('currentUser');
  const [shouldLoadMore, setShouldLoadMore] = useState(false);
  const { data, error, loading, fetchMore } = useQuery(GET_USER, {
    variables: { id: currentUser.id, cursor: 0 },
    notifyOnNetworkStatusChange: true,
  });

  useNavBtnPress(() => {
    console.log('====================================');
    console.log('pressed settings');
    console.log('====================================');
  }, SETTINGS_ID);

  useEffect(() => {
    const { user } = data;
    if (user) {
      setCurrentUser({ ...currentUser, ...user });
    }
  }, [data]);

  return (
    <ProfileView
      user={currentUser}
      isCurrentUser
      onMomentumScrollBegin={() => {
        if (!shouldLoadMore) setShouldLoadMore(true);
      }}
      onEndReached={() => {
        if (
          !loading &&
          data.user.games.pageInfo.hasNextPage &&
          shouldLoadMore
        ) {
          fetchMore({
            variables: {
              cursor: currentUser.games.edges.length,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              let newData = { ...prev };
              mergeWith(newData, fetchMoreResult, (objValue, srcValue) => {
                if (isArray(objValue)) {
                  return objValue.concat(srcValue);
                }
              });

              const { user } = newData;
              if (user) {
                setCurrentUser({ ...currentUser, ...user });
              }

              return newData;
            },
          });

          if (shouldLoadMore) setShouldLoadMore(false);
        }
      }}
      isLoading={loading}
    />
  );
};

MyProfile.options = (): Options => ({
  // @ts-ignore 2322
  topBar: {
    drawBehind: true,
    elevation: 0,
    background: {
      color: 'transparent',
      translucent: true,
    },
    rightButtons: [
      {
        id: SETTINGS_ID,
        icon: settingsIcon,
      },
    ],
  },
});
