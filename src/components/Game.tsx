import React, { FunctionComponent } from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';

import { IGame } from '../fragments';
import { TextX } from './TextX';

interface Props extends ViewProps {
  game: IGame;
}
export const Game: FunctionComponent<Props> = ({
  game: { team1, team2, score1, score2 },
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, style]} {...props}>
      <TextX>
        {score1} - {score2}
      </TextX>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth: 3,
    borderRadius: 12,
    padding: 16,
  },
});
