import React, { FunctionComponent } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
  Platform,
  ActivityIndicator,
  ViewProps,
} from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { Avatar } from './Avatar';
import { TextX } from './TextX';
import { getNavBarHeight } from '../utils';
import { colors } from '../config/styles';
import { DocConnection } from '../interfaces';
import { Game } from './Game';
import { IGame, IUserProfile } from '../fragments';

const SCREEN_MARGIN = 16;

export interface IUserProfileWithGames extends IUserProfile {
  games: DocConnection<IGame>;
}

export interface ProfileViewProps extends ViewProps {
  user: IUserProfileWithGames;
  isCurrentUser?: boolean;
  onEndReached?: () => void;
  onScrollBeginDrag?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  isRefreshing?: boolean;
}
export const ProfileView: FunctionComponent<ProfileViewProps> = ({
  user: {
    avatar,
    name,
    winStats,
    trophyCount,
    games: { edges: gameList = [] } = { edges: [] },
  },
  onEndReached,
  onScrollBeginDrag,
  onRefresh,
  isLoading,
  isRefreshing,
}) => {
  let circleSize =
    (Dimensions.get('window').width - SCREEN_MARGIN * 3) / 2 - 18;
  circleSize = circleSize > 160 ? 160 : circleSize;

  const progress = winStats ? winStats[0] / winStats[1] : 0;
  const winsFontSize = circleSize / 3.5;

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.listHeader}>
          <SafeAreaView />

          {Platform.OS === 'android' && (
            <View style={{ height: getNavBarHeight() }} />
          )}

          <Avatar style={styles.avatar} avatar={avatar} size={140} />
          <TextX style={styles.name}>{name}</TextX>

          <View style={styles.statsContainer}>
            <View style={{ marginHorizontal: SCREEN_MARGIN / 4 }}>
              <View
                style={[
                  styles.statsIconContainer,
                  {
                    height: circleSize,
                    width: circleSize,
                  },
                ]}
              >
                <ProgressCircle
                  style={{ height: circleSize, width: circleSize }}
                  progress={progress}
                  strokeWidth={26}
                  progressColor={colors.primary}
                  animate
                />

                <View style={styles.winsContainer}>
                  <TextX style={[styles.winsText, { fontSize: winsFontSize }]}>
                    {winStats && winStats[0]}
                  </TextX>
                </View>
              </View>

              <TextX
                style={[styles.statsLabel, { fontSize: winsFontSize / 2 }]}
              >
                WINS
              </TextX>
            </View>

            <View style={{ marginHorizontal: SCREEN_MARGIN / 4 }}>
              <View
                style={[
                  styles.statsIconContainer,
                  {
                    height: circleSize,
                    width: circleSize,
                  },
                ]}
              >
                <Icon name="award" size={circleSize} color={colors.gold} />

                <View
                  style={[
                    styles.winsContainer,
                    {
                      justifyContent: 'flex-start',
                      paddingTop: winsFontSize / 1.4,
                    },
                  ]}
                >
                  <TextX
                    style={[styles.winsText, { fontSize: winsFontSize - 10 }]}
                  >
                    {trophyCount}
                  </TextX>
                </View>
              </View>

              <TextX
                style={[styles.statsLabel, { fontSize: winsFontSize / 2 }]}
              >
                TROPHIES
              </TextX>
            </View>
          </View>

          {!!gameList.length && (
            <View style={styles.gamesHeader}>
              <TextX style={{ fontSize: 18 }}>LAST GAMES</TextX>
            </View>
          )}
        </View>
      }
      ListFooterComponent={
        isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          undefined
        )
      }
      data={gameList.map(v => v.node)}
      renderItem={({ item }) => <Game game={item} />}
      keyExtractor={item => item.id}
      onScrollBeginDrag={onScrollBeginDrag}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.3}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
  },
  listHeader: {
    alignItems: 'center',
  },
  gamesHeader: {
    alignSelf: 'flex-start',
    marginHorizontal: SCREEN_MARGIN,
    marginTop: 34,
    marginBottom: 20,
  },
  avatar: {
    marginTop: 55,
    marginBottom: 18,
  },
  name: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  statsContainer: {
    marginTop: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SCREEN_MARGIN,
  },
  winsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  winsText: {
    fontWeight: '900',
  },
  statsLabel: {
    fontWeight: '500',
    textAlign: 'center',
  },
  statsIconContainer: {
    marginBottom: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    marginVertical: 30,
    alignItems: 'center',
  },
});
