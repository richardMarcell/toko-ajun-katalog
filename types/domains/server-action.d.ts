export type ServerActionResponse = {
  status: string;
  message: string;
  url?: string;
  errors?: { [key: string]: string };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  data?: any;
};
