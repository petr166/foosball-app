import { IStanding } from '../fragments';

interface ExtendedIStanding extends IStanding {
  inStandings?: boolean;
}

export const getTournamentStandings = (
  standings: IStanding[],
  minGames: number
): Array<ExtendedIStanding[]> => {
  standings.sort((a, b) => {
    if (a.points === b.points) return 0;
    return a.points > b.points ? -1 : 1;
  });

  return [
    standings
      .filter(v => v.played >= minGames)
      .map(v => ({ ...v, inStandings: true })),
    standings.filter(v => v.played < minGames),
  ];
};
