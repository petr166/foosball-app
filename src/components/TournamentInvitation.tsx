import React, { FunctionComponent } from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';

import { ITournamentInvitation } from '../fragments';
import { TextX } from './TextX';
import { Avatar } from './Avatar';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../config/styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Navigation } from 'react-native-navigation';
import { TOURNAMENT } from '../screens';

export const MIN_INVITATION_HEIGHT = 55;

export interface TournamentInvitationProps extends ViewProps {
  tournamentInvitation: ITournamentInvitation;
  navigationId: string;
}
export const TournamentInvitation: FunctionComponent<
  TournamentInvitationProps
> = ({
  tournamentInvitation: {
    tournament: {
      id,
      name,
      creatorUser: { id: creatorUserId, name: creatorUserName, avatar },
    },
  },
  style,
  navigationId,
  ...props
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        Navigation.push(navigationId, {
          component: { name: TOURNAMENT, passProps: { tournamentId: id } },
        });
      }}
    >
      <View style={[styles.container, style]} {...props}>
        <View style={[styles.fakeTextLine, styles.fakeText]}>
          <Avatar style={[styles.fakeText]} avatar={avatar} size={20} />
          <TextX>{creatorUserName}</TextX>
        </View>
        <TextX style={[styles.fakeText]}>invited you to</TextX>
        <View style={[styles.fakeTextLine]}>
          <Icon
            style={[styles.fakeText]}
            name="trophy"
            color={colors.gold}
            size={15}
          />
          <TextX>{name}</TextX>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: MIN_INVITATION_HEIGHT,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fakeText: {
    marginRight: 4,
  },
  fakeTextLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
