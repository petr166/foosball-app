import {
  ViewProps,
  StyleSheet,
  View,
  FlatList,
  Dimensions,
} from 'react-native';
import React, { FunctionComponent, useEffect, useState, useRef } from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';

import { TextX } from '../TextX';
import { ITournamentItem, GameFragment, IGame } from '../../fragments';
import { listKeyExtractor, parseError, mergeWithConcat } from '../../utils';
import { colors } from '../../config/styles';
import { useLoading } from '../../hooks';
import { ListLoadingFooter } from '../ListLoadingFooter';
import { Game, MIN_GAME_HEIGHT } from '../Game';
import { PaginatedDocument } from '../../interfaces';
import { ErrorWithTryAgain } from '../ErrorWithTryAgain';

const GET_TOURNAMENT_GAMES = gql`
  query GetTournamentGames($id: ID!, $first: Int!, $cursor: Int!) {
    tournament(id: $id) {
      games(first: $first, cursor: $cursor) {
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

  ${GameFragment}
`;

const initialCursor = 0;
const firstToLoad =
  ~~(Dimensions.get('window').height / (MIN_GAME_HEIGHT + 20)) + 2;

export interface TournamentGamesProps extends ViewProps {
  tournament: ITournamentItem;
  doRefresh: number;
}
export const TournamentGames: FunctionComponent<TournamentGamesProps> = ({
  tournament: { id },
  doRefresh = 0,
}) => {
  const {
    data: {
      tournament: {
        games: { pageInfo: { hasNextPage = true } = {}, edges = [] } = {},
      } = {},
    } = {},
    loading,
    error,
    fetchMore,
    refetch,
  } = useQuery<{ tournament: { games: PaginatedDocument<IGame> } }>(
    GET_TOURNAMENT_GAMES,
    {
      variables: { id, first: firstToLoad, cursor: initialCursor },
    }
  );
  const [showSpinner, setShowSpinner] = useLoading(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const shouldLoadMore = useRef(false);

  useEffect(() => {
    setShowSpinner(loading);
  }, [loading]);

  useEffect(() => {
    if (doRefresh) {
      setIsRefreshing(true);
      refetch({ cursor: initialCursor }).finally(() => {
        setIsRefreshing(false);
      });
    }
  }, [doRefresh]);

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{ paddingTop: 20 }}
        refreshing={isRefreshing}
        onRefresh={() => {
          setIsRefreshing(true);
          refetch({ cursor: initialCursor }).finally(() => {
            setIsRefreshing(false);
          });
        }}
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
        ListEmptyComponent={
          !loading ? (
            <View style={{ marginBottom: 14, paddingTop: 200 }}>
              <TextX
                style={{ color: colors.helper, textAlign: 'center' }}
                shadowed={false}
              >
                There are no games logged yet.
              </TextX>
            </View>
          ) : (
            undefined
          )
        }
        onScrollBeginDrag={() => {
          if (!shouldLoadMore.current && !isRefreshing) {
            shouldLoadMore.current = true;
          }
        }}
        onEndReachedThreshold={0.3}
        onEndReached={() => {
          if (
            shouldLoadMore.current &&
            hasNextPage &&
            !loading &&
            !isRefreshing
          ) {
            fetchMore({
              variables: { cursor: edges.length },
              updateQuery: (prev, { fetchMoreResult }) =>
                mergeWithConcat(prev, fetchMoreResult, 'node.id'),
            });
            shouldLoadMore.current = false;
          }
        }}
        keyExtractor={listKeyExtractor}
        data={edges.map(v => v.node)}
        renderItem={({ item }) => <Game game={item} showTournament={false} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
});
