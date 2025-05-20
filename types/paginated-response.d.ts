type PaginatedResponseType = {
  currentPageSize: number;
  currentPage: number;
  offset: number;
  lastPage: number;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type PaginatedResponse<T = {}> = PaginatedResponseType & T;
