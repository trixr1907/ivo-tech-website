'use client';

import { useState, useEffect } from 'react';
import { SkeletonCard } from './SkeletonCard';
import { BlogPost } from './BlogPost';

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    image: string;
  };
  categories: Array<{
    id: string;
    name: string;
  }>;
}

interface BlogListProps {
  initialPosts?: Post[];
}

export function BlogList({ initialPosts = [] }: BlogListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(!initialPosts.length);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/blog?page=${pageNum}&limit=6`
      );
      const data = await response.json();
      
      if (pageNum === 1) {
        setPosts(data.posts);
      } else {
        setPosts(prev => [...prev, ...data.posts]);
      }
      
      setHasMore(data.pagination.currentPage < data.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialPosts.length) {
      fetchPosts(1);
    }
  }, [initialPosts.length]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  if (loading && !posts.length) {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
{Array.from({ length: 6 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <BlogPost key={post.id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-medium text-white transition-all hover:from-blue-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Lade weitere Beiträge...' : 'Mehr anzeigen'}
          </button>
        </div>
      )}
    </div>
  );
}
