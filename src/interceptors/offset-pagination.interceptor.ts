import { StatusResponse } from '@app/enums/status-response';
import {
  BasePaginationQuery,
  OffsetPagination,
  OffsetPaginationResponse,
} from '@app/interfaces/pagination.interface';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class OffsetPaginationInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<OffsetPagination<T>>,
  ): Observable<OffsetPaginationResponse<T>> {
    const request: Request<any, any, any, BasePaginationQuery> = context
      .switchToHttp()
      .getRequest();
    return next.handle().pipe(
      map<OffsetPagination<T>, OffsetPaginationResponse<T>>((content) => ({
        status: StatusResponse.SUCCESS,
        message: 'ok',
        meta: {
          totalRecords: content.totalCount,
          totalPages: Math.ceil(
            content.totalCount / (parseInt(request.query.pageSize) || 10),
          ),
          page: parseInt(request.query.pageNo) || 1,
          limit: parseInt(request.query.pageSize) || 10,
        },
        data: content.data,
      })),
    );
  }
}
