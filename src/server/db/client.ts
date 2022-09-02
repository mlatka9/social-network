import { PrismaClient } from '@prisma/client';
// eslint-disable-next-line import/extensions
import { env } from '../../env/server.mjs';

declare global {
  // eslint-disable-next-line no-var, vars-on-top
  var prisma: PrismaClient | undefined;
}

// eslint-disable-next-line import/prefer-default-export
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
