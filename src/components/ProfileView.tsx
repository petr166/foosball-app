import React, { FunctionComponent } from 'react';
import {
  View,
  ViewProps,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { Avatar } from './Avatar';
import { TextX } from './TextX';
import { getNavBarHeight } from '../utils';

const SCREEN_MARGIN = 16;

export interface ProfileViewProps extends ViewProps {
  user: {
    name: string;
    avatar: string | null;
    winStats: number[];
  };
  isCurrentUser?: boolean;
}
export const ProfileView: FunctionComponent<ProfileViewProps> = ({
  user: { avatar, name, winStats },
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
                  progressColor="#000"
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
                <Icon name="award" size={circleSize} color="#000" />

                <View
                  style={[
                    styles.winsContainer,
                    {
                      justifyContent: 'flex-start',
                      paddingTop: winsFontSize / 1.6,
                    },
                  ]}
                >
                  <TextX style={[styles.winsText, { fontSize: winsFontSize }]}>
                    {winStats && winStats[0]}
                  </TextX>
                </View>
              </View>

              <TextX
                style={[styles.statsLabel, { fontSize: winsFontSize / 2 }]}
              >
                TOURNAMENTS
              </TextX>
            </View>
          </View>
        </View>
      }
      data={[]}
      renderItem={() => null}
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
});
