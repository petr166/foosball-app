import React, { useEffect, useRef, useState } from 'react';
import { Options, Navigation } from 'react-native-navigation';
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
import { UserFragment, IUser } from '../fragments';
import { useQuery } from 'react-apollo-hooks';
import {
  UserItem,
  ListLoadingFooter,
  USER_ITEM_HEIGHT,
  ListEmpty,
  SearchBar,
} from '../components';
import { PaginatedDocument } from '../interfaces';
import {
  showBanner,
  parseError,
  listKeyExtractor,
  mergeWithConcat,
  toggleItemInArray,
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

export interface InviteParticipantsProps extends ScreenComponentProps {
  inviteList: string[];
  onListUpdate?: (updatedList: string[]) => void;
}
export const InviteParticipants: IScreenComponent<InviteParticipantsProps> = ({
  inviteList,
  onListUpdate,
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
    { first: number; cursor: number; term?: string }
  >(GET_USERS, {
    variables: { first: firstToLoad, cursor: initialCursor },
    notifyOnNetworkStatusChange: true,
  });
  const [invitedListState, setInvitedListState] = useState(inviteList);
  const [showSpinner, setShowSpinner] = useLoading(false);
  const shouldLoadMore = useRef(false);
  const termRef = useRef('');
  const listRef = useRef<any>();
  const invitedListRef = useRef(invitedListState);
  invitedListRef.current = invitedListState;

  useEffect(() => {
    if (error) {
      showBanner({ type: 'error', message: parseError(error).text });
    }
  }, [error]);

  useEffect(() => {
    setShowSpinner(loading);
  }, [loading]);

  const itemList = edges.map(({ node }) => ({
    ...node,
    isSelected: !!invitedListState.find(v => v === node.id),
  }));

  // unmount
  useEffect(() => {
    return () => {
      onListUpdate && onListUpdate(invitedListRef.current);
    };
  }, []);

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        rightButtons: [
          {
            id: 'INVITE_PARTICIPANTS_COUNT',
            text: String(invitedListState.length),
          },
        ],
      },
    });
  }, [invitedListState]);

  return (
    <React.Fragment>
      <SafeAreaView />

      <FlatList
        ref={listRef}
        contentContainerStyle={{ flexGrow: 1 }}
        stickyHeaderIndices={[0]}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
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
                    setTimeout(() => {
                      if (listRef.current) {
                        listRef.current.scrollToOffset({ offset: 0 });
                      }
                    }, 100);
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
        }}
        onEndReachedThreshold={0.3}
        onEndReached={() => {
          if (shouldLoadMore.current && hasNextPage && !loading) {
            fetchMore({
              variables: { cursor: edges.length },
              updateQuery: (prev, { fetchMoreResult }) =>
                mergeWithConcat(prev, fetchMoreResult),
            });

            shouldLoadMore.current = false;
          }
        }}
        keyExtractor={listKeyExtractor}
        data={itemList}
        renderItem={({ item, index }) => {
          const itemStyle: any = {};
          if (index === 0) itemStyle.borderTopWidth = 1;
          if (index === itemList.length - 1) itemStyle.borderBottomWidth = 1;
          return (
            <UserItem
              style={itemStyle}
              user={item}
              isSelected={item.isSelected}
              onPress={() => {
                setInvitedListState(prev => toggleItemInArray(item.id, prev));
              }}
            />
          );
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
