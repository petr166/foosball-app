import React, { useEffect, useRef, useState } from 'react';
import { View, Dimensions, FlatList } from 'react-native';
import gql from 'graphql-tag';

import { TextX, ListLoadingFooter, ErrorWithTryAgain } from '../components';
import { IScreenComponent, ScreenComponentProps } from './index';
import { GameFragment, IGame } from '../fragments';
import { useQuery } from 'react-apollo-hooks';
import { MIN_GAME_HEIGHT, Game } from '../components/Game';
import { PaginatedDocument } from '../interfaces';
import { listKeyExtractor, parseError, mergeWithConcat } from '../utils';
import { useLoading } from '../hooks';

const GET_FEED_GAMES = gql`
  query GetFeedGames($cursor: Int!, $first: Int!) {
    feedGames(cursor: $cursor, first: $first) {
      edges {
        node {
          ...GameFragment
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }

  ${GameFragment}
`;

const initialCursor = 0;
const firstToLoad =
  ~~(Dimensions.get('window').height / (MIN_GAME_HEIGHT + 20)) + 2;

export const Home: IScreenComponent<ScreenComponentProps> = () => {
  const {
    data: {
      feedGames: { edges = [], pageInfo: { hasNextPage = false } = {} } = {},
    } = {},
    loading,
    error,
    fetchMore,
    refetch,
  } = useQuery<{
    feedGames: PaginatedDocument<IGame>;
  }>(GET_FEED_GAMES, {
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
              <TextX>Games from your tournaments will appear here</TextX>
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
        renderItem={({ item }) => <Game game={item} />}
      />
    </View>
  );
};

Home.options = {
  topBar: {
    title: {
      text: 'Feed',
    },
  },
};
