import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');

    const skip = (page - 1) * limit;

    // Base query
    const where = {
      published: true,
      ...(category && { category }),
    };

    // Get total count for pagination
    const total = await prisma.post.count({ where });

    // Get posts with relations
    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        categories: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      posts,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error: any) {
    console.error('Blog API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, authorId, categoryIds } = await request.json();

    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: {
          connect: { id: authorId },
        },
        categories: {
          connect: categoryIds.map((id: string) => ({ id })),
        },
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        categories: true,
      },
    });

    return NextResponse.json(post);
  } catch (error: any) {
    console.error('Blog API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
