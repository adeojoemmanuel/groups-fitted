import { SetMetadata } from '@nestjs/common';
import { userRoles } from 'src/users/models/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: userRoles[]) => SetMetadata(ROLES_KEY, roles);
