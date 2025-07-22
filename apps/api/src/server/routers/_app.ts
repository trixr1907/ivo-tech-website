import { router, publicProcedure } from '../trpc';
import { authRouter } from './auth';
import { blogRouter } from './blog';
import { projectsRouter } from './projects';

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
