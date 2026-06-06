"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbNavProps {
  items: { label: string; href: string }[];
}

export const BreadcrumbNav = ({ items }: BreadcrumbNavProps) => {
  return (
    <nav aria-label="Breadcrumb" className="px-4 py-2.5 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-xl border border-slate-200/60 dark:border-zinc-800/50 shadow-sm w-fit">
      <ol className="flex flex-wrap items-center gap-1.5 list-none p-0 m-0">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-gray-400 dark:text-zinc-500 shrink-0" />
            )}
            {index === items.length - 1 ? (
              <span className="text-xs md:text-sm font-bold text-gray-800 dark:text-zinc-200 truncate max-w-[180px] md:max-w-[240px]">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="text-xs md:text-sm font-medium text-gray-500 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};