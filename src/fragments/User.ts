import { gql } from 'apollo-boost';

export const UserFragment = gql`
  fragment UserFragment on User {
    id
    name
    avatar
  }
`;

export const UserProfileFragment = gql`
  fragment UserProfileFragment on User {
    ...UserFragment
    winStats
  }

  ${UserFragment}
`;
