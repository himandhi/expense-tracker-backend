import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

// @Roles(Role.ADMIN) decorator marks routes that need a specific role
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
