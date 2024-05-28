import { SetMetadata } from '@nestjs/common';

export const HAS_ROLE_KEY = 'hasRole';
export const HasRole = (...roles: string[]) => SetMetadata(HAS_ROLE_KEY, roles);
