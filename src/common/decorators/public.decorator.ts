import { SetMetadata } from '@nestjs/common';

// @Public() decorator marks routes that DON'T need authentication
// Example: login and register routes are public
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
