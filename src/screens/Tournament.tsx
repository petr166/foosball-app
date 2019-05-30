import React, { useEffect, useState, useRef } from 'react';
import { useGlobal } from 'reactn';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Options } from 'react-native-navigation';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';

import { ProfileView, TextX, ImageX } from '../components';
import { IScreenComponent, ScreenComponentProps } from './index';
import { IGlobalState } from '../global';
import { ImageURISource, View, StyleSheet } from 'react-native';
import { useNavBtnPress } from '../hooks';
import { TOP_BAR_ICON_SIZE } from '../config/styles';
import {
  UserProfileFragment,
  GameFragment,
  ITournamentItem,
} from '../fragments';
import { mergeWith, isArray } from 'lodash';
import defaultCoverImg from '../assets/tournament-cover.jpg';
import { getTournamentTimeString } from '../utils';

export interface TournamentProps extends ScreenComponentProps {
  tournament: ITournamentItem;
}
export const Tournament: IScreenComponent<TournamentProps> = ({
  tournament: { name, cover, startDate, endDate },
}) => {
  const timeStr = getTournamentTimeString({ startDate, endDate });

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
