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
  TournamentForGameFragment,
  ITournamentForGame,
  ITournamentItem,
} from '../fragments';

const CLOSE_ID = 'CreateGame.close';

let closeIcon: ImageURISource;
Icon.getImageSource('times', TOP_BAR_ICON_SIZE, undefined).then(src => {
  closeIcon = src;
});

const CREATE_GAME = gql`
  mutation CreateGame($input: GameInput!) {
    createGame(input: $input) {
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
    tournament: ITournamentForGame | any;
  }>(GET_TOURNAMENT_INFO, {
    variables: { id: tournamentId },
  });
  const createGameReq = useMutation(CREATE_GAME);
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
        const { time, team1, team2, score1, score2 } = form;

        setLoading(true, undefined, { withLoadingOverlay: true });
        createGameReq({
          variables: {
            input: {
              tournament: tournamentId,
              time,
              team1,
              team2,
              score1: Number(score1),
              score2: Number(score2),
            },
          },
        })
          .then(() => {
            setLoading(false);
            !!onSuccess && onSuccess();
            return Navigation.dismissModal(componentId).finally(() => {
              showBanner({ type: 'success', message: 'Game logged' });
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
      text: 'Log Game',
    },
    leftButtons: [
      {
        id: CLOSE_ID,
        icon: closeIcon,
      },
    ],
  },
});
