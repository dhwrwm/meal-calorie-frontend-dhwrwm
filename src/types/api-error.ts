export type ApiError = {
  error: string;
  message: string;
  status_code: number;
  retryAfter?: number;
};
