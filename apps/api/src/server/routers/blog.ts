import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';

export const blogRouter = router({
  getAll: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(10),
        category: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, limit, category } = input;
      const skip = (page - 1) * limit;

      const where = category ? { category } : {};

      const [posts, total] = await Promise.all([
        ctx.db.blogPost.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: { id: true, email: true },
            },
          },
        }),
        ctx.db.blogPost.count({ where }),
      ]);

      return {
        posts,
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
      const post = await ctx.db.blogPost.findUnique({
        where: { slug: input.slug },
        include: {
          author: {
            select: { id: true, email: true },
          },
        },
      });

      if (!post) {
        throw new Error('Post not found');
      }

      return post;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        excerpt: z.string(),
        content: z.string().min(1),
        category: z.string().optional(),
        tags: z.string().optional(),
        featured: z.boolean().default(false),
        published: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // In a real app, you'd extract the user ID from the JWT token
      const authorId = 'user-id-from-jwt'; // Replace with actual user ID extraction

      const post = await ctx.db.blogPost.create({
        data: {
          ...input,
          authorId,
        },
      });

      return post;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        excerpt: z.string().optional(),
        content: z.string().min(1).optional(),
        category: z.string().optional(),
        tags: z.string().optional(),
        featured: z.boolean().optional(),
        published: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input;

      const post = await ctx.db.blogPost.update({
        where: { id },
        data: updateData,
      });

      return post;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.blogPost.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
