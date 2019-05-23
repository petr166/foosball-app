import React, { useEffect, useRef } from 'react';
import { Options, Navigation } from 'react-native-navigation';
import { gql } from 'apollo-boost';

import { ScreenComponentProps, IScreenComponent } from './index';
import SearchBar from '../components/SearchBar';
import { FlatList, View, SafeAreaView, Dimensions } from 'react-native';
import { UserFragment, IUser } from '../fragments';
import { useQuery } from 'react-apollo-hooks';
import { UserItem, ListLoadingFooter, USER_ITEM_HEIGHT } from '../components';
import { PaginatedDocument } from '../interfaces';
import { showBanner, parseError, listKeyExtractor } from '../utils';

const GET_USERS = gql`
  query GetUsers($term: String, $first: Int!, $cursor: Int!) {
    users(term: $term, first: $first, cursor: $cursor) {
      pageInfo {
        hasNextPage
      }
      edges {
        node {
          ...UserFragment
        }
      }
    }
  }

  ${UserFragment}
`;

const initialCursor = 0;
const firstToLoad = ~~(Dimensions.get('window').height / USER_ITEM_HEIGHT) * 2;

export interface InviteParticipantsProps extends ScreenComponentProps {}
export const InviteParticipants: IScreenComponent<InviteParticipantsProps> = ({
  componentId,
}) => {
  const {
    data: {
      users: { edges = [], pageInfo: { hasNextPage = false } = {} } = {},
    } = {},
    error,
    loading,
    fetchMore,
    refetch,
  } = useQuery<
    { users: PaginatedDocument<IUser> },
    { first: number; cursor: number }
  >(GET_USERS, {
    variables: { first: firstToLoad, cursor: initialCursor },
    notifyOnNetworkStatusChange: true,
  });
  const shouldLoadMore = useRef(false);

  useEffect(() => {
    if (error) {
      showBanner({ type: 'error', message: parseError(error).text });
    }
  }, [error]);

  const itemList = edges.map(v => v.node);

  return (
    <React.Fragment>
      <SafeAreaView />

      <FlatList
        stickyHeaderIndices={[0]}
        keyboardShouldPersistTaps="always"
        ListHeaderComponent={
          <View style={{ backgroundColor: '#fff' }}>
            <SearchBar
              inputProps={{
                onFocus: () => {
                  Navigation.mergeOptions(componentId, {
                    topBar: { visible: false },
                  });
                },
                onBlur: () => {
                  Navigation.mergeOptions(componentId, {
                    topBar: { visible: true },
                  });
                },
              }}
            />
          </View>
        }
        ListFooterComponent={loading ? <ListLoadingFooter /> : undefined}
        onScrollBeginDrag={() => {
          if (!shouldLoadMore.current && !loading) {
            shouldLoadMore.current = true;
          }
        }}
        onEndReachedThreshold={0.3}
        onEndReached={() => {
          if (shouldLoadMore.current && hasNextPage && !loading) {
            // TODO: loadmore
            console.log('====================================');
            console.log('LOAD MORE HERE');
            console.log('====================================');

            if (shouldLoadMore.current) shouldLoadMore.current = false;
          }
        }}
        keyExtractor={listKeyExtractor}
        data={itemList}
        renderItem={({ item }) => <UserItem user={item} />}
      />
    </React.Fragment>
  );
};

InviteParticipants.options = (): Options => ({
  // @ts-ignore 2322
  popGesture: true,
  topBar: {
    title: {
      text: 'Invite Participants',
    },
    rightButtons: [
      {
        id: 'INVITE_PARTICIPANTS_COUNT',
        text: '0',
      },
    ],
  },
});
