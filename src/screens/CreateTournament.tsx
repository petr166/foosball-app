import React, { useEffect } from 'react';
import { ImageURISource } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Options, Navigation } from 'react-native-navigation';
import { gql } from 'apollo-boost';

import { CreateTournamentView } from '../components';
import { IScreenComponent, ScreenComponentProps } from './index';
import { TOP_BAR_ICON_SIZE } from '../config/styles';
import { useNavBtnPress, useLoading } from '../hooks';
import { useMutation } from 'react-apollo-hooks';
import { showBanner } from '../utils';
import { INVITE_PARTICIPANTS } from './screenNames';

const CLOSE_ID = 'CreateTournament.close';

let closeIcon: ImageURISource;
Icon.getImageSource('times', TOP_BAR_ICON_SIZE, undefined).then(src => {
  closeIcon = src;
});

const CREATE_TOURNAMENT = gql`
  mutation CreateTournament($input: TournamentInput!) {
    createTournament(input: $input) {
      id
    }
  }
`;

export interface TournamentsProps extends ScreenComponentProps {
  onSuccess?: () => void;
}
export const CreateTournament: IScreenComponent<TournamentsProps> = ({
  componentId,
  onSuccess,
}) => {
  const createTournamentReq = useMutation(CREATE_TOURNAMENT);
  const [, setLoading, error, , disableButton] = useLoading(false);
  useNavBtnPress(() => {
    Navigation.dismissModal(componentId);
  }, CLOSE_ID);

  useEffect(() => {
    if (error) showBanner({ type: 'error', message: error });
  }, [error]);

  return (
    <CreateTournamentView
      tournament={{}}
      saveBtnDisabled={disableButton}
      onInviteParticipantsPress={(inviteList = [], onListUpdate) => {
        Navigation.push(componentId, {
          component: {
            name: INVITE_PARTICIPANTS,
            passProps: { inviteList, onListUpdate },
          },
        });
      }}
      onSavePress={(form: any) => {
        const {
          name,
          description,
          startDate,
          endDate,
          privacy,
          teamSize,
          maxPlayers,
          minGames,
          inviteList,
        } = form;

        setLoading(true);
        createTournamentReq({
          variables: {
            input: {
              name,
              description,
              startDate,
              endDate,
              privacy,
              teamSize,
              maxPlayers,
              minGames,
              inviteList,
            },
          },
        })
          .then(() => {
            !!onSuccess && onSuccess();
            return Navigation.dismissModal(componentId)
              .then(() => true)
              .finally(() => {
                showBanner({ type: 'success', message: 'Tournament created' });
                return true;
              });
          })
          .catch(err => {
            setLoading(false, err);
          });
      }}
    />
  );
};

CreateTournament.options = (): Options => ({
  // @ts-ignore 2322
  topBar: {
    title: {
      text: 'New Tournament',
    },
    leftButtons: [
      {
        id: CLOSE_ID,
        icon: closeIcon,
      },
    ],
  },
});
