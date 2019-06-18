import React, { useState, useEffect } from 'react';
import { Options, Navigation } from 'react-native-navigation';
import { TabView, TabBar } from 'react-native-tab-view';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import { gql } from 'apollo-boost';

import {
  TextX,
  ImageX,
  TournamentStandings,
  TournamentGames,
  TournamentInfo,
  ErrorWithTryAgain,
} from '../components';
import { IScreenComponent, ScreenComponentProps } from './index';
import { colors } from '../config/styles';
import { ITournamentItem, TournamentItemFragment } from '../fragments';
import defaultCoverImg from '../assets/tournament-cover.jpg';
import {
  getTournamentTimeString,
  getBoxShadowStyles,
  parseError,
} from '../utils';
import { CREATE_GAME } from './screenNames';
import { useQuery } from 'react-apollo-hooks';
import { useLoading } from '../hooks';

const GET_TOURNAMENT = gql`
  query GetTournament($id: ID!) {
    tournament(id: $id) {
      ...TournamentItemFragment
    }
  }

  ${TournamentItemFragment}
`;

export interface TournamentProps extends ScreenComponentProps {
  tournament?: ITournamentItem;
  tournamentId?: string;
}
export const Tournament: IScreenComponent<TournamentProps> = ({
  tournament: tournamentFromProps,
  tournamentId,
  componentId,
}) => {
  const {
    data: { tournament } = {
      tournament: tournamentFromProps,
    },
    loading,
    error,
    refetch,
  } = useQuery<{
    tournament: ITournamentItem;
  }>(GET_TOURNAMENT, {
    variables: { id: tournamentId },
    notifyOnNetworkStatusChange: true,
    skip: !tournamentId,
  });
  const [tabState, setTabState] = useState({
    index: 0,
    routes: [
      {
        key: 'standings',
        title: 'Standings',
        accessibilityLabel: 'Standings',
      },
      { key: 'games', title: 'Games', accessibilityLabel: 'Games' },
      { key: 'you', title: 'Info', accessibilityLabel: 'Info' },
    ],
  });
  const [doRefresh, setDoRefresh] = useState(0);
  const [, setFetching] = useLoading(false);

  useEffect(() => {
    setFetching(loading, undefined, { withLoadingOverlay: true });
  }, [loading]);

  if (!tournament) return <View />;
  const { name, cover, startDate, endDate, teamSize, standings } = tournament;

  const timeStr = getTournamentTimeString({ startDate, endDate });

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case 'standings':
        return (
          <TournamentStandings
            tournament={tournament}
            doRefresh={doRefresh}
            componentId={componentId}
          />
        );
      case 'games':
        return (
          <TournamentGames
            tournament={tournament}
            doRefresh={doRefresh}
            componentId={componentId}
          />
        );
      case 'you':
        return (
          <TournamentInfo
            tournament={tournament}
            doRefresh={doRefresh}
            hasJoined={() => {
              setDoRefresh(prev => prev + 1);
            }}
          />
        );
      default:
        return null;
    }
  };

  const now = moment();
  const showAddGameBtn =
    !!standings &&
    standings.length >= teamSize * 2 &&
    moment(Number(endDate)).isAfter(now) &&
    moment(Number(startDate)).isBefore(now);

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <React.Fragment />
      ) : error ? (
        <ErrorWithTryAgain
          errorText={parseError(error).text}
          onTryAgain={() => {
            refetch();
          }}
        />
      ) : (
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

          {showAddGameBtn && (
            <TouchableOpacity
              style={styles.addGameButton}
              onPress={() => {
                Navigation.showModal({
                  stack: {
                    children: [
                      {
                        component: {
                          name: CREATE_GAME,
                          passProps: {
                            tournament,
                            onSuccess: () => {
                              setDoRefresh(prev => prev + 1);
                            },
                          },
                        },
                      },
                    ],
                  },
                });
              }}
            >
              <Icon name="plus" size={30} color="#fff" />
            </TouchableOpacity>
          )}
        </React.Fragment>
      )}
    </View>
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
  headerContainer: {
    height: 170,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  coverContainer: { position: 'absolute', height: '100%', width: '100%' },
  nameContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: { color: '#fff', fontSize: 17 },
  addGameButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...getBoxShadowStyles({
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowRadius: 4,
    }),
  },
});
