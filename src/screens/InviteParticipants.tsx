import React, { useEffect, useRef } from 'react';
import { Options } from 'react-native-navigation';
import { gql } from 'apollo-boost';
import { debounce } from 'lodash';
import {
  FlatList,
  View,
  SafeAreaView,
  Dimensions,
  Keyboard,
} from 'react-native';

import { ScreenComponentProps, IScreenComponent } from './index';
import SearchBar from '../components/SearchBar';
import { UserFragment, IUser } from '../fragments';
import { useQuery } from 'react-apollo-hooks';
import {
  UserItem,
  ListLoadingFooter,
  USER_ITEM_HEIGHT,
  ListEmpty,
} from '../components';
import { PaginatedDocument } from '../interfaces';
import {
  showBanner,
  parseError,
  listKeyExtractor,
  mergeWithConcat,
} from '../utils';
import { useLoading } from '../hooks';

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
export const InviteParticipants: IScreenComponent<
  InviteParticipantsProps
> = () => {
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
    { first: number; cursor: number; term?: string }
  >(GET_USERS, {
    variables: { first: firstToLoad, cursor: initialCursor },
    notifyOnNetworkStatusChange: true,
  });
  const [showSpinner, setShowSpinner] = useLoading(false);
  const shouldLoadMore = useRef(false);
  const termRef = useRef('');
  const listRef = useRef<any>();

  useEffect(() => {
    if (error) {
      showBanner({ type: 'error', message: parseError(error).text });
    }
  }, [error]);

  useEffect(() => {
    setShowSpinner(loading);
  }, [loading]);

  const itemList = edges.map(v => v.node);

  return (
    <React.Fragment>
      <SafeAreaView />

      <FlatList
        ref={listRef}
        contentContainerStyle={{ flexGrow: 1 }}
        stickyHeaderIndices={[0]}
        keyboardShouldPersistTaps="always"
        ListHeaderComponent={
          <View style={{ backgroundColor: '#fff' }}>
            <SearchBar
              onChangeText={debounce((rawVal: string) => {
                const val = rawVal.trim();
                if (val !== termRef.current) {
                  refetch({
                    cursor: initialCursor,
                    first: firstToLoad,
                    term: val,
                  }).finally(() => {
                    if (listRef.current) {
                      setTimeout(() => {
                        listRef.current.scrollToOffset({ offset: 0 });
                      }, 100);
                    }
                    termRef.current = val;
                  });
                }
              }, 300)}
            />
          </View>
        }
        ListFooterComponent={showSpinner ? <ListLoadingFooter /> : undefined}
        ListEmptyComponent={!loading ? <ListEmpty /> : undefined}
        onScrollBeginDrag={() => {
          if (!shouldLoadMore.current && !loading) {
            shouldLoadMore.current = true;
          }
          Keyboard.dismiss();
        }}
        onEndReachedThreshold={0.3}
        onEndReached={() => {
          if (shouldLoadMore.current && hasNextPage && !loading) {
            fetchMore({
              variables: { cursor: edges.length },
              updateQuery: (prev, { fetchMoreResult }) =>
                mergeWithConcat(prev, fetchMoreResult),
            });

            if (shouldLoadMore.current) shouldLoadMore.current = false;
          }
        }}
        keyExtractor={listKeyExtractor}
        data={itemList}
        renderItem={({ item, index }) => {
          const itemStyle: any = {};
          if (index === 0) itemStyle.borderTopWidth = 1;
          if (index === itemList.length - 1) itemStyle.borderBottomWidth = 1;
          return <UserItem style={itemStyle} user={item} />;
        }}
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
