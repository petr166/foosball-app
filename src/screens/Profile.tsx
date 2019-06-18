import React, { useEffect, useState, useRef } from 'react';
import { Options, Navigation } from 'react-native-navigation';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';

import { ProfileView, ListLoadingFooter } from '../components';
import { IScreenComponent, ScreenComponentProps } from './index';
import { UserProfileFragment, GameFragment } from '../fragments';
import { mergeWithConcat, showBanner, parseError } from '../utils';
import { useLoading } from '../hooks';

const initialCursor = 0;

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

export interface ProfileProps extends ScreenComponentProps {
  userId: string;
}
export const Profile: IScreenComponent<ProfileProps> = ({
  componentId,
  userId,
}) => {
  const [showSpinner, setShowSpinner] = useLoading(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data, error, loading, fetchMore, refetch } = useQuery(GET_USER, {
    variables: { id: userId, cursor: initialCursor },
  });
  const shouldLoadMore = useRef(false);

  useEffect(() => {
    setShowSpinner(loading);
  }, [loading]);

  if (error) {
    Navigation.pop(componentId);
    showBanner({ type: 'error', message: parseError(error).text });
  }

  if (showSpinner) return <ListLoadingFooter style={{ minHeight: 400 }} />;
  if (!data.user) return null;

  return (
    <ProfileView
      componentId={componentId}
      user={data.user}
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
              cursor: data.user.games.edges.length,
            },
            updateQuery: (prev, { fetchMoreResult }) =>
              mergeWithConcat(prev, fetchMoreResult, 'node.id'),
          }).catch(err => {
            showBanner({ type: 'error', message: parseError(err).text });
          });

          shouldLoadMore.current = false;
        }
      }}
      isLoading={showSpinner}
      isRefreshing={isRefreshing}
      onRefresh={() => {
        setIsRefreshing(true);
        refetch({ id: userId, cursor: initialCursor }).finally(() => {
          setIsRefreshing(false);
        });
        shouldLoadMore.current = false;
      }}
    />
  );
};

Profile.options = (): Options => ({
  // @ts-ignore 2322
  topBar: {
    drawBehind: true,
    elevation: 0,
    background: {
      color: 'transparent',
      translucent: true,
    },
  },
});
