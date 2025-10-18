import { StatusResponse } from '@app/enums/status-response';

export interface IBaseApiResponse<T> {
  status: StatusResponse;
  message: string;
  data: T[];
}
