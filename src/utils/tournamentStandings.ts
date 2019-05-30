import { IStanding } from '../fragments';

interface ExtendedIStanding extends IStanding {
  inStandings?: boolean;
}

export const getTournamentStandings = (
  standings: IStanding[],
  minGames: number
): Array<ExtendedIStanding[]> => {
  standings.sort((a, b) => {
    if (a.played === b.played) return 0;
    return a.played < b.played ? -1 : 1;
  });

  return [
    standings
      .filter(v => v.played >= minGames)
      .map(v => ({ ...v, inStandings: true })),
    standings.filter(v => v.played < minGames),
  ];
};
