import { gql } from 'apollo-boost';

import { UserFragment, IUser } from './User';

export const TournamentItemFragment = gql`
  fragment TournamentItemFragment on Tournament {
    id
    name
    cover
    standings {
      id
    }
    startDate
    endDate
  }
`;

export const StandingFragment = gql`
  fragment StandingFragment on Standing {
    id
    user {
      ...UserFragment
    }
    won
    played
    points
  }

  ${UserFragment}
`;

export interface ITournamentItem {
  id: string;
  name: string;
  cover: string | null;
  standings: string[];
  startDate: string;
  endDate: string;
}

export interface IStanding {
  id: string;
  user: IUser;
  won: number;
  played: number;
  points: number;
}
