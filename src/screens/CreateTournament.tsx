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

export interface TournamentsProps extends ScreenComponentProps {}
export const CreateTournament: IScreenComponent<TournamentsProps> = ({
  componentId,
}) => {
  const createTournamentReq = useMutation(CREATE_TOURNAMENT);
  const [, setLoading, error] = useLoading(false);
  useNavBtnPress(() => {
    Navigation.dismissModal(componentId);
  }, CLOSE_ID);

  useEffect(() => {
    if (error) showBanner({ type: 'error', message: error });
  }, [error]);

  // TODO: remove
  useEffect(() => {
    Navigation.push(componentId, {
      component: { name: INVITE_PARTICIPANTS, passProps: { inviteList: [] } },
    });
  }, []);

  return (
    <CreateTournamentView
      tournament={{}}
      onInviteParticipantsPress={(inviteList: string[] = []) => {
        Navigation.push(componentId, {
          component: { name: INVITE_PARTICIPANTS, passProps: { inviteList } },
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
            },
          },
        })
          .then(() => {
            Navigation.dismissModal(componentId).finally(() => {
              showBanner({ type: 'success' });
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