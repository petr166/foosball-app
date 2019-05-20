export interface PaginatedDocument<T> {
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
