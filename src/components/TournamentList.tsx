import React, { FunctionComponent, useRef, MutableRefObject } from 'react';
import { View, ViewProps, FlatList, StyleSheet } from 'react-native';

import { TextX } from './TextX';
import { ITournamentItem } from '../fragments';
import { listKeyExtractor } from '../utils';
import { TournamentItem, TOURNAMENT_ITEM_SIZE } from './TournamentItem';
import { ListLoadingFooter } from './ListLoadingFooter';
import { colors } from '../config/styles';
import { ButtonX } from './ButtonX';

export interface TournamentListProps extends ViewProps {
  title: string;
  data: ITournamentItem[];
  onItemPress?: (tournament: ITournamentItem) => void;
  loadMore?: () => void;
  isLoading?: boolean;
  showSpinner?: boolean;
  error?: string;
  onTryAgain?: () => void;
  refSet?: MutableRefObject<null>;
}
export const TournamentList: FunctionComponent<TournamentListProps> = ({
  title,
  data,
  showSpinner,
  isLoading,
  loadMore,
  error,
  onTryAgain,
  refSet = null,
  onItemPress,
}) => {
  const shouldLoadMore = useRef(false);

  return (
    <View>
      <TextX style={styles.title}>{title}</TextX>
      {error ? (
        <View style={styles.errorContainer}>
          <TextX style={{ marginBottom: 8 }} shadowed={false}>
            {error}
          </TextX>
          <ButtonX
            style={{ backgroundColor: colors.secondary, width: 120 }}
            title="Try again"
            onPress={onTryAgain}
          />
        </View>
      ) : (
        <FlatList
          ref={refSet}
          contentContainerStyle={[
            { paddingLeft: 16 },
            !!data.length && { minHeight: TOURNAMENT_ITEM_SIZE },
          ]}
          horizontal
          ListFooterComponent={
            showSpinner ? (
              <ListLoadingFooter style={{ minHeight: TOURNAMENT_ITEM_SIZE }} />
            ) : (
              undefined
            )
          }
          ListEmptyComponent={
            !isLoading ? (
              <View style={{ marginBottom: 14 }}>
                <TextX style={{ color: colors.helper }} shadowed={false}>
                  There are no results matching your search
                </TextX>
              </View>
            ) : (
              undefined
            )
          }
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          onScrollBeginDrag={() => {
            if (!shouldLoadMore.current && !isLoading) {
              shouldLoadMore.current = true;
            }
          }}
          onEndReachedThreshold={0.3}
          onEndReached={() => {
            if (shouldLoadMore.current) {
              !!loadMore && loadMore();
              shouldLoadMore.current = false;
            }
          }}
          keyExtractor={listKeyExtractor}
          data={data}
          renderItem={({ item }) => (
            <TournamentItem
              tournament={item}
              onPress={() => {
                onItemPress && onItemPress(item);
              }}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    margin: 16,
    textTransform: 'uppercase',
  },
  errorContainer: {
    marginBottom: 14,
    marginLeft: 16,
    alignItems: 'center',
  },
});
