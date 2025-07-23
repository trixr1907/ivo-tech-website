'use client';

import React from 'react';

interface Category {
  id: string;
  name: string;
}

interface CategoryTagProps {
  category: Category;
}

export const CategoryTag: React.FC<CategoryTagProps> = ({ category }) => {
  return (
    <span
      className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300"
    >
      {category.name}
    </span>
  );
};
