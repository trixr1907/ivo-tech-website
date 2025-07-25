// import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { authRouter } from './auth.js';
import { blogRouter } from './blog.js';
import { projectsRouter } from './projects.js';

export const appRouter = router({
  auth: authRouter,
  blog: blogRouter,
  projects: projectsRouter,

  // Health check endpoint
  health: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
});

export type AppRouter = typeof appRouter;
