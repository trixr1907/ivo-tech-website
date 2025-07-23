'use client';

import React from 'react';
import Image from 'next/image';
import { CategoryTag } from './Category';

interface Category {
  id: string;
  name: string;
}

interface Author {
  name: string;
  image: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: Author;
  categories: Category[];
}

interface BlogPostProps {
  post: Post;
}

export const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  return (
    <article
      className="group transform rounded-xl bg-gray-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-gray-800/70"
    >
      <div className="flex items-center gap-4">
        <Image
          src={post.author.image}
          alt={post.author.name}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400">
            {post.title}
          </h3>
          <p className="text-sm text-gray-400">{post.author.name}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="line-clamp-3 text-gray-300">
          {post.content}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {post.categories.map(category => (
          <CategoryTag key={category.id} category={category} />
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-400">
        {new Date(post.createdAt).toLocaleDateString('de-DE', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
    </article>
  );
};
