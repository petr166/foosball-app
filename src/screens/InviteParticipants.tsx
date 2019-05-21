import React, { FunctionComponent } from 'react';
import { Options, Navigation } from 'react-native-navigation';

import { ScreenContainer, TextX } from '../components';
import { ScreenComponentProps, IScreenComponent } from './index';
import SearchBar from '../components/SearchBar';
import { FlatList, View } from 'react-native';

export interface InviteParticipantsProps extends ScreenComponentProps {}
export const InviteParticipants: IScreenComponent<InviteParticipantsProps> = ({
  componentId,
}) => {
  return (
    <FlatList
      ListHeaderComponent={
        <View>
          <SearchBar
            inputProps={{
              onFocus: () => {
                Navigation.mergeOptions(componentId, {
                  topBar: { visible: false },
                });
              },
              onBlur: () => {
                Navigation.mergeOptions(componentId, {
                  topBar: { visible: true },
                });
              },
            }}
          />
        </View>
      }
      data={[]}
      renderItem={() => null}
    />
  );
};

InviteParticipants.options = (): Options => ({
  // @ts-ignore 2322
  popGesture: true,
  topBar: {
    title: {
      text: 'Invite Participants',
    },
    rightButtons: [
      {
        id: 'INVITE_PARTICIPANTS_COUNT',
        text: '0',
      },
    ],
  },
});
