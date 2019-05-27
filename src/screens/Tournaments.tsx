import React, { useEffect, useRef, useState } from 'react';
import { ImageURISource, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Options, Navigation } from 'react-native-navigation';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';
import { debounce } from 'lodash';

import { ScreenContainer, TournamentList, SearchBar } from '../components';
import { IScreenComponent, ScreenComponentProps } from './index';
import { TOP_BAR_ICON_SIZE } from '../config/styles';
import { useNavBtnPress, useLoading } from '../hooks';
import { CREATE_TOURNAMENT } from './screenNames';
import { TournamentItemFragment, ITournamentItem } from '../fragments';
import { PaginatedDocument } from '../interfaces';
import { parseError, mergeWithConcat } from '../utils';

const ADD_ID = 'Tournaments.add';

let addIcon: ImageURISource;
Icon.getImageSource('plus', TOP_BAR_ICON_SIZE, undefined).then(src => {
  addIcon = src;
});

const GET_TOURNAMENTS = gql`
  query GetTournaments(
    $term: String
    $category: String
    $first: Int!
    $cursor: Int!
  ) {
    tournaments(
      term: $term
      category: $category
      first: $first
      cursor: $cursor
    ) {
      pageInfo {
        hasNextPage
      }
      edges {
        node {
          ...TournamentItemFragment
        }
      }
    }
  }

  ${TournamentItemFragment}
`;

type GetTournamentsVariables = {
  first?: number;
  cursor: number;
  term?: string;
  category?: 'mine' | 'public' | 'private' | 'old';
};

const initialCursor = 0;

export interface TournamentsProps extends ScreenComponentProps {}
export const Tournaments: IScreenComponent<TournamentsProps> = () => {
  const termRef = useRef('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  useNavBtnPress(() => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: CREATE_TOURNAMENT,
              passProps: {
                onSuccess: () => {
                  doSearch(termRef.current);
                },
              },
            },
          },
        ],
      },
    });
  }, ADD_ID);
  const {
    data: {
      tournaments: {
        edges: mineEges = [],
        pageInfo: { hasNextPage: mineHasNextPage = false } = {},
      } = {},
    } = {},
    error: mineError,
    loading: mineLoading,
    fetchMore: mineFetchMore,
    refetch: mineRefetch,
  } = useQuery<
    { tournaments: PaginatedDocument<ITournamentItem> },
    GetTournamentsVariables
  >(GET_TOURNAMENTS, {
    variables: { first: 5, cursor: initialCursor, category: 'mine' },
    notifyOnNetworkStatusChange: true,
  });
  const [showMineSpinner, setShowMineSpinner] = useLoading(mineLoading);
  const mineListRef = useRef<any>(null);

  useEffect(() => {
    setShowMineSpinner(mineLoading);
  }, [mineLoading]);

  const {
    data: {
      tournaments: {
        edges: publicEges = [],
        pageInfo: { hasNextPage: publicHasNextPage = false } = {},
      } = {},
    } = {},
    error: publicError,
    loading: publicLoading,
    fetchMore: publicFetchMore,
    refetch: publicRefetch,
  } = useQuery<
    { tournaments: PaginatedDocument<ITournamentItem> },
    GetTournamentsVariables
  >(GET_TOURNAMENTS, {
    variables: { first: 5, cursor: initialCursor, category: 'public' },
    notifyOnNetworkStatusChange: true,
  });
  const [showPublicSpinner, setShowPublicSpinner] = useLoading(publicLoading);
  const publicListRef = useRef<any>(null);

  useEffect(() => {
    setShowPublicSpinner(publicLoading);
  }, [publicLoading]);

  const {
    data: {
      tournaments: {
        edges: oldEges = [],
        pageInfo: { hasNextPage: oldHasNextPage = false } = {},
      } = {},
    } = {},
    error: oldError,
    loading: oldLoading,
    fetchMore: oldFetchMore,
    refetch: oldRefetch,
  } = useQuery<
    { tournaments: PaginatedDocument<ITournamentItem> },
    GetTournamentsVariables
  >(GET_TOURNAMENTS, {
    variables: { first: 5, cursor: initialCursor, category: 'old' },
    notifyOnNetworkStatusChange: true,
  });
  const [showOldSpinner, setShowOldSpinner] = useLoading(oldLoading);
  const oldListRef = useRef<any>(null);

  useEffect(() => {
    setShowOldSpinner(oldLoading);
  }, [oldLoading]);

  const mineList = mineEges.map(v => v.node);
  const publicList = publicEges.map(v => v.node);
  const oldList = oldEges.map(v => v.node);

  const doSearch = (val: string) => {
    const listRefs = [mineListRef, publicListRef, oldListRef];

    Promise.map([mineRefetch, publicRefetch, oldRefetch], (refetchFn, i) => {
      return refetchFn({
        cursor: initialCursor,
        first: 5,
        term: val,
      }).finally(() => {
        setTimeout(() => {
          if (listRefs[i].current) {
            listRefs[i].current.scrollToOffset({ offset: 0 });
          }
        }, 100);
        return true;
      });
    }).finally(() => {
      termRef.current = val;
      return true;
    });
  };

  return (
    <ScreenContainer
      contentContainerStyle={{ paddingBottom: 60 }}
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag"
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => {
            setIsRefreshing(true);
            doSearch(termRef.current);
            setTimeout(() => {
              setIsRefreshing(false);
            }, 600);
          }}
        />
      }
    >
      <SearchBar
        onChangeText={debounce((rawVal: string) => {
          const val = rawVal.trim();
          if (val !== termRef.current) {
            doSearch(val);
          }
        }, 300)}
      />

      <TournamentList
        title="Your tournaments"
        refSet={mineListRef}
        data={mineList}
        showSpinner={showMineSpinner}
        isLoading={mineLoading}
        error={mineError ? parseError(mineError).message : undefined}
        onTryAgain={() => {
          mineRefetch({
            cursor: initialCursor,
          });
        }}
        loadMore={() => {
          if (mineHasNextPage && !mineLoading) {
            mineFetchMore({
              variables: { cursor: mineEges.length },
              updateQuery: (prev, { fetchMoreResult }) =>
                mergeWithConcat(prev, fetchMoreResult, 'node.id'),
            });
          }
        }}
      />

      <TournamentList
        title="Public tournaments"
        refSet={publicListRef}
        data={publicList}
        showSpinner={showPublicSpinner}
        isLoading={publicLoading}
        error={publicError ? parseError(publicError).message : undefined}
        onTryAgain={() => {
          publicRefetch({
            cursor: initialCursor,
          });
        }}
        loadMore={() => {
          if (publicHasNextPage && !publicLoading) {
            publicFetchMore({
              variables: { cursor: publicEges.length },
              updateQuery: (prev, { fetchMoreResult }) =>
                mergeWithConcat(prev, fetchMoreResult, 'node.id'),
            });
          }
        }}
      />

      <TournamentList
        title="Old tournaments"
        refSet={oldListRef}
        data={oldList}
        showSpinner={showOldSpinner}
        isLoading={oldLoading}
        error={oldError ? parseError(oldError).message : undefined}
        onTryAgain={() => {
          oldRefetch({
            cursor: initialCursor,
          });
        }}
        loadMore={() => {
          if (oldHasNextPage && !oldLoading) {
            oldFetchMore({
              variables: { cursor: oldEges.length },
              updateQuery: (prev, { fetchMoreResult }) =>
                mergeWithConcat(prev, fetchMoreResult, 'node.id'),
            });
          }
        }}
      />
    </ScreenContainer>
  );
};

Tournaments.options = (): Options => ({
  // @ts-ignore 2322
  topBar: {
    title: {
      text: 'Tournaments',
    },
    rightButtons: [
      {
        id: ADD_ID,
        icon: addIcon,
      },
    ],
  },
});
