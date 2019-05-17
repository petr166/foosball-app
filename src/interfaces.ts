export interface DocConnection<T> {
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    endCursor: number;
  };
  edges: Array<{
    node: T;
    cursor: number;
  }>;
}
