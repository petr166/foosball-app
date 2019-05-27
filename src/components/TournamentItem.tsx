import React, { FunctionComponent } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  Dimensions,
  View,
} from 'react-native';
import moment from 'moment';

import { ITournamentItem } from '../fragments';
import { TextX } from './TextX';
import { getBoxShadowStyles } from '../utils';
import { ImageX } from './ImageX';
import defaultCoverImg from '../assets/tournament-cover.jpg';

const screenPadding = 16;
export const TOURNAMENT_ITEM_SIZE =
  Dimensions.get('window').width / 2 - screenPadding - 16;

export interface TournamentItemProps extends TouchableOpacityProps {
  tournament: ITournamentItem;
}
export const TournamentItem: FunctionComponent<TournamentItemProps> = ({
  tournament: { name, cover, standings, startDate, endDate },
  style,
  ...props
}) => {
  let timeStr = '';
  const now = moment();
  const start = moment(Number(startDate));
  const end = moment(Number(endDate));
  if (now.isBefore(start)) {
    timeStr = 'starts ' + start.fromNow();
  } else if (now.isBefore(end)) {
    timeStr = 'ends ' + end.fromNow();
  } else {
    timeStr = 'ended on ' + end.format('DD/MM');
  }

  return (
    <TouchableOpacity style={styles.button} {...props}>
      <View style={[styles.container, style]}>
        <View>
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
          <TextX style={styles.name} adjustsFontSizeToFit numberOfLines={2}>
            {name}
          </TextX>
        </View>

        <View style={styles.contentContainer}>
          <TextX>
            {standings.length} player{standings.length !== 1 && 's'}
          </TextX>
          <TextX>{timeStr}</TextX>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    ...getBoxShadowStyles(),
    marginBottom: 10,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  container: {
    width: TOURNAMENT_ITEM_SIZE,
    height: TOURNAMENT_ITEM_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
  },
  name: {
    marginLeft: 8,
    position: 'absolute',
    bottom: 8,
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  img: {
    width: '100%',
    height: TOURNAMENT_ITEM_SIZE / 2.5,
  },
  contentContainer: {
    flex: 1,
    padding: 8,
    justifyContent: 'flex-end',
  },
});
