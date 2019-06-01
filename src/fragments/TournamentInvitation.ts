import { gql } from 'apollo-boost';

import { UserFragment, IUser } from './User';

export const TournamentInvitationFragment = gql`
  fragment TournamentInvitationFragment on TournamentInvitation {
    id
    tournament {
      id
      name
      creatorUser {
        ...UserFragment
      }
    }
  }

  ${UserFragment}
`;

export interface ITournamentInvitation {
  id: string;
  tournament: {
    id: string;
    name: string;
    creatorUser: IUser;
  };
}
