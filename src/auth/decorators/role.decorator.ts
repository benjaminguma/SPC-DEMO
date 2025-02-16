import { SetMetadata } from '@nestjs/common';
export const ROLES_KEY = 'ROLES';

export const RolesSetter = (...roles: number[]) =>
  SetMetadata(ROLES_KEY, roles);
