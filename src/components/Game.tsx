import React, { FunctionComponent } from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import moment from 'moment';

import { IGame, IUser } from '../fragments';
import { TextX } from './TextX';
import { Avatar } from './Avatar';
import { separateName, getBoxShadowStyles } from '../utils';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../config/styles';

interface GameProps extends ViewProps {
  game: IGame;
}
export const Game: FunctionComponent<GameProps> = ({
  game: { team1, team2, score1, score2, time, tournament },
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, style]} {...props}>
      <View style={styles.header}>
        <TextX>
          <Icon name="trophy" color={colors.gold} />
          &nbsp;
          {tournament.name}
        </TextX>
        <TextX>{moment(Number(time)).fromNow()}</TextX>
      </View>

      <View style={styles.content}>
        <Team team={team1} />
        <TextX style={{ fontSize: 42, fontWeight: '900' }}>
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
  return (
    <View style={[styles.teamContainer]} {...props}>
      <Avatar avatar={team[0].avatar} size={64} />
      <TextX style={styles.name}>{separateName(team[0].name).firstName}</TextX>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth: 3,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 10,
    ...getBoxShadowStyles(),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    marginTop: 8,
    fontSize: 15,
  },
});
