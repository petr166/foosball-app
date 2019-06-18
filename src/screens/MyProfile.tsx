import React, { useEffect, useState, useRef } from 'react';
import { useGlobal } from 'reactn';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Options, Navigation } from 'react-native-navigation';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';

import {
  ProfileView,
  ListLoadingFooter,
  ErrorWithTryAgain,
} from '../components';
import { IScreenComponent, ScreenComponentProps } from './index';
import { IGlobalState } from '../global';
import { ImageURISource } from 'react-native';
import { useNavBtnPress, useLoading } from '../hooks';
import { TOP_BAR_ICON_SIZE } from '../config/styles';
import { UserProfileFragment, GameFragment } from '../fragments';
import { mergeWith, isArray } from 'lodash';
import { SETTINGS } from './screenNames';
import { showBanner, parseError } from '../utils';

const SETTINGS_ID = 'MyProfile.settings';
const initialCursor = 0;

let settingsIcon: ImageURISource;
Icon.getImageSource('cog', TOP_BAR_ICON_SIZE).then(src => {
  settingsIcon = src;
});

const GET_USER = gql`
  query GetUser($id: ID!, $cursor: Int!) {
    user(id: $id) {
      ...UserProfileFragment
      games(first: 3, cursor: $cursor) {
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
export const MyProfile: IScreenComponent<MyProfileProps> = ({
  componentId,
}) => {
  const [showSpinner, setShowSpinner] = useLoading(false);
  const [currentUser, setCurrentUser] = useGlobal<IGlobalState>('currentUser');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data, error, loading, fetchMore, refetch } = useQuery(GET_USER, {
    variables: { id: currentUser.id, cursor: initialCursor },
    notifyOnNetworkStatusChange: true,
  });
  const shouldLoadMore = useRef(false);

  useNavBtnPress(() => {
    Navigation.push(componentId, { component: { name: SETTINGS } });
  }, SETTINGS_ID);

  useEffect(() => {
    updateUser(data);
  }, [data]);

  useEffect(() => {
    setShowSpinner(loading);
  }, [loading]);

  const updateUser = (data: any) => {
    const { user } = data;
    if (user) {
      setCurrentUser({ ...currentUser, ...user });
    }
  };

  if (error)
    return (
      <ErrorWithTryAgain
        errorText={parseError(error).text}
        onTryAgain={() => {
          refetch({ id: currentUser.id, cursor: initialCursor }).then(
            updateUser
          );
        }}
      />
    );
  if (showSpinner) return <ListLoadingFooter style={{ minHeight: 400 }} />;
  if (!currentUser) return null;

  return (
    <ProfileView
      componentId={componentId}
      user={currentUser}
      isCurrentUser
      onScrollBeginDrag={() => {
        if (!shouldLoadMore.current && !isRefreshing) {
          shouldLoadMore.current = true;
        }
      }}
      onEndReached={() => {
        if (
          shouldLoadMore.current &&
          data.user.games.pageInfo.hasNextPage &&
          !loading &&
          !isRefreshing
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

              updateUser(newData);
              return newData;
            },
          }).catch(err => {
            showBanner({ type: 'error', message: parseError(err).text });
          });

          if (shouldLoadMore.current) shouldLoadMore.current = false;
        }
      }}
      isLoading={loading}
      isRefreshing={isRefreshing}
      onRefresh={() => {
        setIsRefreshing(true);
        refetch({ id: currentUser.id, cursor: initialCursor })
          .then(updateUser)
          .finally(() => {
            setIsRefreshing(false);
          });
        if (shouldLoadMore.current) shouldLoadMore.current = false;
      }}
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
