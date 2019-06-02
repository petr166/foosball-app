import {
  ViewProps,
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, { FunctionComponent, useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo-hooks';

import { TextX } from '../TextX';
import { ITournamentItem } from '../../fragments';
import { useLoading } from '../../hooks';
import { ListLoadingFooter } from '../ListLoadingFooter';
import { ErrorWithTryAgain } from '../ErrorWithTryAgain';
import { parseError, showBanner } from '../../utils';
import { ButtonX } from '../ButtonX';

const GET_TOURNAMENT_INFO = gql`
  query GetTournamentInfo($id: ID!) {
    tournament(id: $id) {
      id
      description
      canJoin
    }
  }
`;

const JOIN_TOURNAMENT = gql`
  mutation JoinTournament($id: ID!) {
    joinTournament(id: $id) {
      id
    }
  }
`;

export interface TournamentInfoProps extends ViewProps {
  tournament: ITournamentItem;
  doRefresh: number;
  hasJoined: () => void;
}
export const TournamentInfo: FunctionComponent<TournamentInfoProps> = ({
  tournament: { id },
  doRefresh = 0,
  hasJoined,
}) => {
  const {
    data: { tournament: { description = '', canJoin = false } = {} } = {},
    loading,
    error,
    refetch,
  } = useQuery<{ tournament: { description: string; canJoin: boolean } }>(
    GET_TOURNAMENT_INFO,
    {
      variables: { id },
      notifyOnNetworkStatusChange: true,
    }
  );
  const joinTournamentReq = useMutation(JOIN_TOURNAMENT, {
    variables: { id: id },
  });
  const [showSpinner, setShowSpinner] = useLoading(loading);
  const [, setIsJoining, joinError, , disableJoinBtn] = useLoading(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setShowSpinner(loading);
  }, [loading]);

  useEffect(() => {
    if (doRefresh) {
      refetch();
    }
  }, [doRefresh]);

  useEffect(() => {
    if (joinError) showBanner({ type: 'error', message: joinError });
  }, [joinError]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => {
            setIsRefreshing(true);
            refetch().finally(() => {
              setIsRefreshing(false);
            });
          }}
        />
      }
    >
      {showSpinner ? (
        <ListLoadingFooter />
      ) : error ? (
        <ErrorWithTryAgain
          errorText={parseError(error).text}
          onTryAgain={() => {
            refetch();
          }}
        />
      ) : (
        <View>
          {!!description && description.length ? (
            <View style={{ marginBottom: 16 }}>
              <TextX style={{ marginBottom: 16, color: 'darkgrey' }}>
                Tournament description
              </TextX>
              <TextX>{description}</TextX>
            </View>
          ) : (
            <TextX style={{ marginBottom: 16, color: 'darkgrey' }}>
              Tournament has no description
            </TextX>
          )}

          {canJoin && (
            <View
              style={{
                marginTop: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ButtonX
                disabled={disableJoinBtn}
                style={{ width: 200 }}
                title="Join"
                onPress={() => {
                  setIsJoining(true);
                  joinTournamentReq()
                    .then(() => {
                      showBanner({
                        type: 'success',
                        message: 'You joined the tournament!',
                      });
                      setIsJoining(false);
                      hasJoined();
                      return true;
                    })
                    .catch(err => {
                      setIsJoining(false, err);
                    });
                }}
              />
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
});
