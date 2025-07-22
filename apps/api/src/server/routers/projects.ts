import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';

export const projectsRouter = router({
  getAll: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(10),
        technology: z.string().optional(),
        featured: z.boolean().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, limit, technology, featured } = input;
      const skip = (page - 1) * limit;

      const where: any = {};
      if (technology) {
        where.technologies = { contains: technology };
      }
      if (featured !== undefined) {
        where.featured = featured;
      }

      const [projects, total] = await Promise.all([
        ctx.db.project.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        ctx.db.project.count({ where }),
      ]);

      return {
        projects,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const project = await ctx.db.project.findUnique({
        where: { slug: input.slug },
      });

      if (!project) {
        throw new Error('Project not found');
      }

      return project;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        description: z.string(),
        content: z.string().optional(),
        technologies: z.string().optional(),
        githubUrl: z.string().url().optional(),
        liveUrl: z.string().url().optional(),
        imageUrl: z.string().url().optional(),
        featured: z.boolean().default(false),
        status: z.string().default('development'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const project = await ctx.db.project.create({
        data: input,
      });

      return project;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        description: z.string().optional(),
        content: z.string().optional(),
        technologies: z.string().optional(),
        githubUrl: z.string().url().optional(),
        liveUrl: z.string().url().optional(),
        imageUrl: z.string().url().optional(),
        featured: z.boolean().optional(),
        status: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input;

      const project = await ctx.db.project.update({
        where: { id },
        data: updateData,
      });

      return project;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.project.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
