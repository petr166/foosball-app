import React, { useEffect, useRef, useState } from 'react';
import { View, Dimensions, FlatList } from 'react-native';
import gql from 'graphql-tag';

import {
  TextX,
  ListLoadingFooter,
  ErrorWithTryAgain,
  TournamentInvitation,
  MIN_INVITATION_HEIGHT,
} from '../components';
import { IScreenComponent, ScreenComponentProps } from './index';
import {
  TournamentInvitationFragment,
  ITournamentInvitation,
} from '../fragments';
import { useQuery } from 'react-apollo-hooks';
import { PaginatedDocument } from '../interfaces';
import { listKeyExtractor, parseError, mergeWithConcat } from '../utils';
import { useLoading } from '../hooks';

const GET_NOTIFICATIONS = gql`
  query GetNotifications($cursor: Int!, $first: Int!) {
    tournamentInvitations(cursor: $cursor, first: $first) {
      edges {
        node {
          ...TournamentInvitationFragment
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }

  ${TournamentInvitationFragment}
`;

const initialCursor = 0;
const firstToLoad =
  ~~(Dimensions.get('window').height / MIN_INVITATION_HEIGHT) + 2;

export const Notifications: IScreenComponent<ScreenComponentProps> = ({
  componentId,
}) => {
  const {
    data: {
      tournamentInvitations: {
        edges = [],
        pageInfo: { hasNextPage = false } = {},
      } = {},
    } = {},
    loading,
    error,
    fetchMore,
    refetch,
  } = useQuery<{
    tournamentInvitations: PaginatedDocument<ITournamentInvitation>;
  }>(GET_NOTIFICATIONS, {
    variables: { cursor: initialCursor, first: firstToLoad },
    notifyOnNetworkStatusChange: true,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSpinner, setShowSpinner] = useLoading(false);
  const shouldLoadMore = useRef(false);

  useEffect(() => {
    setShowSpinner(loading);
  }, [loading]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ paddingVertical: 20 }}
        ListEmptyComponent={
          !loading && !error ? (
            <View
              style={{
                marginTop: 200,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TextX>You don't have any notifications</TextX>
            </View>
          ) : (
            undefined
          )
        }
        ListFooterComponent={
          showSpinner ? (
            <ListLoadingFooter />
          ) : error ? (
            <ErrorWithTryAgain
              errorText={parseError(error).text}
              onTryAgain={() => {
                refetch();
              }}
            />
          ) : (
            undefined
          )
        }
        refreshing={isRefreshing}
        onRefresh={() => {
          setIsRefreshing(true);
          refetch({ cursor: initialCursor }).finally(() => {
            setIsRefreshing(false);
          });

          shouldLoadMore.current = false;
        }}
        onScrollBeginDrag={() => {
          if (!shouldLoadMore.current && !loading && !isRefreshing) {
            shouldLoadMore.current = true;
          }
        }}
        onEndReachedThreshold={0.3}
        onEndReached={() => {
          if (
            shouldLoadMore.current &&
            !loading &&
            hasNextPage &&
            !isRefreshing
          ) {
            fetchMore({
              variables: { cursor: edges.length },
              updateQuery: (prev, { fetchMoreResult }) =>
                mergeWithConcat(prev, fetchMoreResult, 'node.id'),
            });
          }

          shouldLoadMore.current = false;
        }}
        keyExtractor={listKeyExtractor}
        data={edges.map(v => v.node)}
        renderItem={({ item, index }) => (
          <TournamentInvitation
            navigationId={componentId}
            tournamentInvitation={item}
            style={index === 0 ? { borderTopWidth: 1 } : {}}
          />
        )}
      />
    </View>
  );
};

Notifications.options = {
  topBar: {
    title: {
      text: 'Notifications',
    },
  },
};
