import { UserRoleEnum } from '@app/enums/user-role';

export type JwtPayload = {
  roles?: UserRoleEnum;
  id?: number;
};
