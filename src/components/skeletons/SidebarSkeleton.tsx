'use client';

import { SkeletonBox, SkeletonText } from './SkeletonComponents';

export function SidebarSkeleton() {
  return (
    <aside className="flex-shrink-0 h-full w-56 sidebar-bg border-r">
      <div className="h-full flex flex-col">
        {/* Header with branding skeleton */}
        <div className="flex items-center justify-between py-8 px-4">
          <div className="flex items-center gap-3 px-3">
            <SkeletonBox
              className="w-6 h-6 rounded-md"
            />
            <SkeletonText width="80px" height="0.875rem" />
          </div>
        </div>

        {/* Navigation items skeleton */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {/* People */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-md">
            <SkeletonBox className="w-5 h-5 rounded" />
            <SkeletonText width="60px" height="0.875rem" />
          </div>

          {/* Insights */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-md">
            <SkeletonBox className="w-5 h-5 rounded" />
            <SkeletonText width="70px" height="0.875rem" />
          </div>

          {/* Settings */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-md">
            <SkeletonBox className="w-5 h-5 rounded" />
            <SkeletonText width="70px" height="0.875rem" />
          </div>
        </nav>
      </div>
    </aside>
  );
}

