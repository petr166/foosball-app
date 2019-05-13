import { gql } from 'apollo-boost';

export const UserFragments = gql`
  fragment UserFragment on User {
    id
    name
    email
    avatar
  }

  fragment UserProfileFragment on User {
    ...UserFragment
    winStats
  }
`;
