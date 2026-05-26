export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiError = {
  success: false;
  error: string;
  details?: unknown;
};

export type PaginatedResponse<T> = ApiSuccess<T[]> & {
  total: number;
  page: number;
  pageSize: number;
};
