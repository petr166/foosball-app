import React, { FunctionComponent } from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import moment from 'moment';

import { IGame, IUser } from '../fragments';
import { TextX } from './TextX';
import { Avatar } from './Avatar';
import { separateName, getBoxShadowStyles } from '../utils';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../config/styles';

export const MIN_GAME_HEIGHT = 150;

export interface GameProps extends ViewProps {
  game: IGame;
  showTournament?: boolean;
}
export const Game: FunctionComponent<GameProps> = ({
  game: { team1, team2, score1, score2, time, tournament },
  style,
  showTournament = true,
  ...props
}) => {
  return (
    <View style={[styles.container, style]} {...props}>
      <View style={styles.header}>
        {showTournament && (
          <TextX style={styles.headerText}>
            <Icon name="trophy" color={colors.gold} />
            &nbsp;
            {tournament.name}
          </TextX>
        )}
        <View />
        <TextX style={styles.headerText}>
          {moment(Number(time)).fromNow()}
        </TextX>
      </View>

      <View style={styles.content}>
        <Team team={team1} />
        <TextX style={styles.scoreText}>
          {score1} - {score2}
        </TextX>
        <Team team={team2} />
      </View>
    </View>
  );
};

interface TeamProps extends ViewProps {
  team: IUser[];
}
export const Team: FunctionComponent<TeamProps> = ({
  team,
  style,
  ...props
}) => {
  const avatarSize = team[1] ? 58 : 64;

  return (
    <View style={[styles.teamContainer]} {...props}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Avatar
          style={{ zIndex: 1, elevation: 1 }}
          avatar={team[0].avatar}
          size={avatarSize}
        />
        {team[1] && (
          <Avatar
            style={{ marginLeft: -22 }}
            avatar={team[1].avatar}
            size={avatarSize}
          />
        )}
      </View>

      <TextX adjustsFontSizeToFit numberOfLines={1} style={styles.name}>
        {separateName(team[0].name).firstName}
        {team[1] && ' & ' + separateName(team[1].name).firstName}
      </TextX>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: MIN_GAME_HEIGHT,
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth: 3,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 10,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    ...getBoxShadowStyles(),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 13,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 40,
    fontWeight: '900',
    marginHorizontal: 12,
    transform: [{ translateY: -10 }],
  },
  teamContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    marginTop: 8,
    fontSize: 16,
    maxWidth: 100,
  },
});
