import { ViewProps, StyleSheet, View, FlatList } from 'react-native';
import React, { FunctionComponent, useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';

import { TextX } from '../TextX';
import { ITournamentItem, StandingFragment, IStanding } from '../../fragments';
import {
  getTournamentStandings,
  listKeyExtractor,
  parseError,
} from '../../utils';
import { colors } from '../../config/styles';
import { Avatar } from '../Avatar';
import { ButtonX } from '../ButtonX';
import { useLoading } from '../../hooks';
import { ListLoadingFooter } from '../ListLoadingFooter';

const GET_TOURNAMENT_STANDINGS = gql`
  query GetTournamentStandings($id: ID!) {
    tournament(id: $id) {
      id
      minGames
      standings {
        ...StandingFragment
      }
    }
  }

  ${StandingFragment}
`;

const renderItem = (data: any[], { rowStyle = {}, textStyle = {} } = {}) => (
  <View style={[styles.standingRow, rowStyle]}>
    <View style={[styles.standingCell, styles.positionCell]}>
      <TextX style={[textStyle]}>{data[0]}</TextX>
    </View>
    <View style={[styles.standingCell, styles.nameCell]}>
      {data[1].avatar !== undefined && (
        <Avatar style={{ marginRight: 5 }} size={20} avatar={data[1].avatar} />
      )}
      <TextX style={[textStyle]}>{data[1].name}</TextX>
    </View>
    <View style={[styles.standingCell]}>
      <TextX style={[textStyle]}>{data[2]}</TextX>
    </View>
    <View style={[styles.standingCell]}>
      <TextX style={[textStyle]}>{data[3]}</TextX>
    </View>
    <View style={[styles.standingCell, { flex: 1.3 }]}>
      <TextX style={[textStyle]}>{data[4]}</TextX>
    </View>
  </View>
);

export interface TournamentStandingsProps extends ViewProps {
  tournament: ITournamentItem;
  doRefresh: number;
}
export const TournamentStandings: FunctionComponent<
  TournamentStandingsProps
> = ({ tournament: { id }, doRefresh = 0 }) => {
  const {
    data: { tournament: { minGames = 0, standings = [] } = {} } = {},
    loading,
    error,
    refetch,
  } = useQuery<{ tournament: { minGames: number; standings: IStanding[] } }>(
    GET_TOURNAMENT_STANDINGS,
    {
      variables: { id },
      notifyOnNetworkStatusChange: true,
    }
  );
  const [showSpinner, setShowSpinner] = useLoading(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setShowSpinner(loading);
  }, [loading]);

  useEffect(() => {
    if (doRefresh) {
      setIsRefreshing(true);
      refetch().finally(() => {
        setIsRefreshing(false);
      });
    }
  }, [doRefresh]);

  const [enoughGamesList, notEnoughGamesList] = getTournamentStandings(
    standings,
    minGames
  );

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <TextX style={{ marginBottom: 8 }} shadowed={false}>
            {parseError(error).text}
          </TextX>
          <ButtonX
            style={{ backgroundColor: colors.secondary, width: 120 }}
            title="Try again"
            onPress={() => refetch()}
          />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ paddingTop: 20 }}
          refreshing={isRefreshing}
          onRefresh={() => {
            setIsRefreshing(true);
            refetch().finally(() => {
              setIsRefreshing(false);
            });
          }}
          ListHeaderComponent={
            showSpinner ? (
              <ListLoadingFooter style={{ minHeight: 200 }} />
            ) : (
              renderItem(['#', { name: 'PLAYER' }, 'GP', 'GW', 'PTS'], {
                rowStyle: { borderTopWidth: 1 },
              })
            )
          }
          keyExtractor={listKeyExtractor}
          data={[...enoughGamesList, ...notEnoughGamesList]}
          renderItem={({ item, index }) =>
            renderItem(
              [
                index + 1,
                { name: item.user.name, avatar: item.user.avatar },
                item.played,
                item.won,
                item.points,
              ],
              {
                rowStyle: {
                  backgroundColor: !item.inStandings
                    ? colors.helper
                    : index === 0
                    ? colors.primary
                    : '#fff',
                },
                textStyle:
                  index === 0 && item.inStandings
                    ? {
                        color: '#fff',
                      }
                    : {},
              }
            )
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  standingRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  standingCell: {
    borderRightWidth: 1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  nameCell: {
    flex: 3.8,
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
    flexDirection: 'row',
  },
  positionCell: {
    flex: 0.5,
    paddingHorizontal: 0,
    borderLeftWidth: 1,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
});
