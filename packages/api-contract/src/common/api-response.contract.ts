export interface ApiMeta {
  readonly timestamp: string;
  readonly traceId: string;
  readonly requestId?: string;
  readonly durationMs?: number;
  readonly pagination?: PaginationMeta;
}

export interface PaginationMeta {
  readonly page: number;
  readonly limit: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}

export interface ApiErrorDetail {
  readonly code: string;
  readonly message: string;
  readonly httpStatus: number;
  readonly details?: unknown;
}

export interface ApiSuccessResponse<T> {
  readonly success: true;
  readonly message?: string;
  readonly data: T;
  readonly meta: ApiMeta;
  readonly error?: never;
}

export interface ApiErrorResponse {
  readonly success: false;
  readonly message: string;
  readonly error: ApiErrorDetail;
  readonly meta: ApiMeta;
  readonly data?: never;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
