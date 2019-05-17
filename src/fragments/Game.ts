import { gql } from 'apollo-boost';

import { UserFragment, IUser } from './User';

export const GameFragment = gql`
  fragment GameFragment on Game {
    id
    tournament {
      id
      name
    }
    time
    team1 {
      ...UserFragment
    }
    team2 {
      ...UserFragment
    }
    score1
    score2
  }

  ${UserFragment}
`;

export interface IGame {
  id: string;
  tournament: {
    id: string;
    name: string;
  };
  time: string;
  team1: IUser[];
  team2: IUser[];
  score1: number;
  score2: number;
}
