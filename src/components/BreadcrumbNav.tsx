"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbNavProps {
  items: { label: string; href: string }[];
}

export const BreadcrumbNav = ({ items }: BreadcrumbNavProps) => {
  return (
    <Breadcrumb className="px-4 py-3 bg-background/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm w-fit">
      {items.map((item, index) => (
        <React.Fragment key={item.href}>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={item.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                {item.label}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {index < items.length - 1 && (
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </BreadcrumbSeparator>
          )}
        </React.Fragment>
      ))}
    </Breadcrumb>
  );
};