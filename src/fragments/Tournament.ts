import { gql } from 'apollo-boost';

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

export interface ITournamentItem {
  id: string;
  name: string;
  cover: string | null;
  standings: string[];
  startDate: string;
  endDate: string;
}
