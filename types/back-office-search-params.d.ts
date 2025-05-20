type BackOfficeSearchParamsType = {
  pageSize: string;
  page: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type BackOfficeSearchParams<T = {}> = BackOfficeSearchParamsType & T;
