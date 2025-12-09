import { DateUtil, UniqueEntityID } from '@unsacad/shared-kernel';
import type {
  ApiErrorResponse,
  ApiMeta,
  ApiSuccessResponse,
  PaginationMeta,
} from '@unsacad/api-contract';

export interface SuccessParams<T> {
  readonly data: T;
  readonly message?: string;
  readonly traceId?: string;
  readonly meta?: Partial<ApiMeta>;
}

export interface PaginatedParams<T> {
  readonly data: T;
  readonly page: number;
  readonly limit: number;
  readonly totalItems: number;
  readonly message?: string;
  readonly traceId?: string;
  readonly meta?: Partial<ApiMeta>;
}

export interface ErrorParams {
  readonly code: string;
  readonly message: string;
  readonly httpStatus: number;
  readonly traceId?: string;
  readonly details?: unknown;
  readonly meta?: Partial<ApiMeta>;
}

const _buildMeta = Symbol('buildMeta');

export const ApiResponseFactory = {
  success<T>(params: Readonly<SuccessParams<T>>): ApiSuccessResponse<T> {
    return {
      success: true,
      message: params.message,
      data: params.data,
      meta: ApiResponseFactory[_buildMeta](params.traceId, params.meta),
    };
  },

  paginated<T>(params: Readonly<PaginatedParams<T>>): ApiSuccessResponse<T> {
    const totalPages = Math.ceil(params.totalItems / params.limit);

    const pagination: PaginationMeta = {
      page: params.page,
      limit: params.limit,
      totalItems: params.totalItems,
      totalPages,
      hasNextPage: params.page < totalPages,
      hasPreviousPage: params.page > 1,
    };

    return {
      success: true,
      message: params.message,
      data: params.data,
      meta: ApiResponseFactory[_buildMeta](params.traceId, { ...params.meta, pagination }),
    };
  },

  error(params: Readonly<ErrorParams>): ApiErrorResponse {
    return {
      success: false,
      message: params.message,
      error: {
        code: params.code,
        message: params.message,
        httpStatus: params.httpStatus,
        details: params.details,
      },
      meta: ApiResponseFactory[_buildMeta](params.traceId, params.meta),
    };
  },

  [_buildMeta](traceId?: string, extraMeta?: Partial<ApiMeta>): ApiMeta {
    return {
      timestamp: DateUtil.nowISO(),
      traceId: traceId ?? UniqueEntityID.generate().toString(),
      ...extraMeta,
    };
  },
} as const;
