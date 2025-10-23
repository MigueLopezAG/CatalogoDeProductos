import { SetMetadata } from '@nestjs/common';

enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
//We define the metadata to control the roles
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);