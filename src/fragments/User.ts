import { gql } from 'apollo-boost';

export const UserFragment = gql`
  fragment UserFragment on User {
    id
    name
    avatar
  }
`;

export interface IUser {
  id: string;
  name: string;
  avatar: string | null;
}

export const UserProfileFragment = gql`
  fragment UserProfileFragment on User {
    ...UserFragment
    winStats
    trophyCount
  }

  ${UserFragment}
`;

export interface IUserProfile extends IUser {
  winStats: [number, number];
  trophyCount: number;
}
