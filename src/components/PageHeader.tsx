'use client';

import { PageActions } from './PageActions';
import type { PageAction } from './PageActions';

interface PageHeaderProps {
  actions?: PageAction[];
}

export function PageHeader({ actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-end mb-6">
      {actions && actions.length > 0 && (
        <div className="hidden md:block">
          <PageActions actions={actions} />
        </div>
      )}
    </div>
  );
}

export type { PageAction };
