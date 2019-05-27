import React, { useEffect, useRef } from 'react';
import { ImageURISource } from 'react-native';
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

const initialCursor = 0;

export interface TournamentsProps extends ScreenComponentProps {}
export const Tournaments: IScreenComponent<TournamentsProps> = () => {
  const termRef = useRef('');
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
    {
      first: number;
      cursor: number;
      term?: string;
      category?: 'mine' | 'public' | 'private';
    }
  >(GET_TOURNAMENTS, {
    variables: { first: 5, cursor: initialCursor, category: 'mine' },
    notifyOnNetworkStatusChange: true,
  });
  const [showMineSpinner, setShowMineSpinner] = useLoading(mineLoading);
  const mineListRef = useRef<any>(null);

  useEffect(() => {
    setShowMineSpinner(mineLoading);
  }, [mineLoading]);

  const mineList = mineEges.map(v => v.node);

  const doSearch = (val: string) => {
    const listRefs = [mineListRef];

    Promise.map([mineRefetch], (refetchFn, i) => {
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
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag"
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
            first: 5,
            category: 'mine',
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

      <TournamentList title="Public tournaments" data={[]} />
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
