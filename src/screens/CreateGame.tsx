import React, { useEffect } from 'react';
import { ImageURISource, ActivityIndicator, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Options, Navigation } from 'react-native-navigation';
import { gql } from 'apollo-boost';

import { CreateGameView } from '../components';
import { IScreenComponent, ScreenComponentProps } from './index';
import { TOP_BAR_ICON_SIZE } from '../config/styles';
import { useNavBtnPress, useLoading } from '../hooks';
import { useMutation, useQuery } from 'react-apollo-hooks';
import { showBanner } from '../utils';
import {
  UserFragment,
  TournamentForGameFragment,
  ITournamentForGame,
  ITournamentItem,
} from '../fragments';

const CLOSE_ID = 'CreateGame.close';

let closeIcon: ImageURISource;
Icon.getImageSource('times', TOP_BAR_ICON_SIZE, undefined).then(src => {
  closeIcon = src;
});

const CREATE_TOURNAMENT = gql`
  mutation CreateGame($input: TournamentInput!) {
    createTournament(input: $input) {
      id
    }
  }
`;

const GET_TOURNAMENT_INFO = gql`
  query GetTournamentInfo($id: ID!) {
    tournament(id: $id) {
      ...TournamentForGameFragment
    }
  }

  ${TournamentForGameFragment}
`;

export interface CreateGameProps extends ScreenComponentProps {
  onSuccess?: () => void;
  tournament: ITournamentItem;
}
export const CreateGame: IScreenComponent<CreateGameProps> = ({
  componentId,
  onSuccess,
  tournament: { id: tournamentId },
}) => {
  const { data: { tournament = {} } = {}, loading } = useQuery<{
    tournament: ITournamentForGame;
  }>(GET_TOURNAMENT_INFO, {
    variables: { id: tournamentId },
  });
  const createTournamentReq = useMutation(CREATE_TOURNAMENT);
  const [, setLoading, error, , disableButton] = useLoading(false);
  const [isLoadingTournament, setIsLoadingTournament] = useLoading(loading);

  useNavBtnPress(() => {
    Navigation.dismissModal(componentId);
  }, CLOSE_ID);

  useEffect(() => {
    if (error) showBanner({ type: 'error', message: error });
  }, [error]);

  useEffect(() => {
    setIsLoadingTournament(loading);
  }, [loading]);

  if (isLoadingTournament)
    return (
      <View
        style={{
          minHeight: 200,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator />
      </View>
    );

  return (
    <CreateGameView
      tournament={tournament}
      saveBtnDisabled={disableButton}
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
                showBanner({ type: 'success', message: 'Game created' });
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

CreateGame.options = (): Options => ({
  // @ts-ignore 2322
  topBar: {
    visible: true,
    drawBehind: false,
    background: {
      translucent: false,
    },
    title: {
      text: 'New Game',
    },
    leftButtons: [
      {
        id: CLOSE_ID,
        icon: closeIcon,
      },
    ],
  },
});
