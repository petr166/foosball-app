import React, { useState } from 'react';
import { Options } from 'react-native-navigation';
import { TabView, TabBar } from 'react-native-tab-view';
import { View, StyleSheet, Dimensions } from 'react-native';

import { TextX, ImageX, TournamentStandings } from '../components';
import { IScreenComponent, ScreenComponentProps } from './index';
import { colors } from '../config/styles';
import { ITournamentItem } from '../fragments';
import defaultCoverImg from '../assets/tournament-cover.jpg';
import { getTournamentTimeString } from '../utils';

// TODO: remove
const FirstRoute = () => <View style={[{ flex: 1 }]} />;

export interface TournamentProps extends ScreenComponentProps {
  tournament: ITournamentItem;
}
export const Tournament: IScreenComponent<TournamentProps> = ({
  tournament: { name, cover, startDate, endDate },
  tournament,
}) => {
  const [tabState, setTabState] = useState({
    index: 0,
    routes: [
      {
        key: 'standings',
        title: 'Standings',
        accessibilityLabel: 'Standings',
      },
      { key: 'games', title: 'Games', accessibilityLabel: 'Games' },
      { key: 'you', title: 'You', accessibilityLabel: 'You' },
    ],
  });
  const timeStr = getTournamentTimeString({ startDate, endDate });

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case 'standings':
        return <TournamentStandings tournament={tournament} />;
      case 'games':
        return <FirstRoute />;
      case 'you':
        return <FirstRoute />;
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <View style={styles.headerContainer}>
        <View style={styles.coverContainer}>
          <ImageX
            source={cover ? { uri: cover } : defaultCoverImg}
            style={[styles.img]}
            resizeMode="cover"
            isDefaultImg={!cover}
            defaultImageProps={{
              source: defaultCoverImg,
              resizeMode: 'cover',
              style: [styles.img],
            }}
          />
        </View>
        <View style={styles.nameContainer}>
          <TextX style={styles.text}>{name}</TextX>
          <TextX style={styles.text}>{timeStr}</TextX>
        </View>
      </View>

      <TabView
        lazy
        navigationState={tabState}
        renderScene={renderScene}
        onIndexChange={index => setTabState(prev => ({ ...prev, index }))}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: colors.secondary }}
            style={{ backgroundColor: '#fff' }}
            labelStyle={{ color: '#000' }}
          />
        )}
      />
    </React.Fragment>
  );
};

Tournament.options = (): Options => ({
  // @ts-ignore 2322
  topBar: {
    drawBehind: true,
    elevation: 0,
    background: {
      color: 'transparent',
      translucent: true,
    },
    backButton: {
      color: '#fff',
    },
  },
});

const styles = StyleSheet.create({
  img: {
    width: '100%',
    height: '100%',
  },
  headerContainer: { height: 170, justifyContent: 'flex-end' },
  coverContainer: { position: 'absolute', height: '100%', width: '100%' },
  nameContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: { color: '#fff', fontSize: 17 },
});
