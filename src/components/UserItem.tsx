import React, { FunctionComponent } from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

import { IUser } from '../fragments';
import { TextX } from './TextX';

export const USER_ITEM_HEIGHT = 200;

export interface UserItemProps extends TextProps {
  user: IUser;
}
export const UserItem: FunctionComponent<UserItemProps> = ({
  user: { name },
}) => {
  return (
    <TextX style={{ height: USER_ITEM_HEIGHT, borderWidth: 1, padding: '10%' }}>
      {name}
    </TextX>
  );
};

const styles = StyleSheet.create({});
