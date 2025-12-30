'use client';

import { SkeletonText, SkeletonBox } from '../skeletons/SkeletonComponents';

export function PersonDetailSkeleton() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="mb-6">
        <SkeletonText width="200px" height="1.875rem" className="mb-2" />
        <SkeletonText width="150px" height="1rem" />
      </div>

      {/* Tabs skeleton */}
      <div className="border-b mb-6" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex gap-6">
          <SkeletonText width="80px" height="1rem" className="pb-3" />
          <SkeletonText width="120px" height="1rem" className="pb-3" />
        </div>
      </div>

      {/* Tab content skeleton */}
      <div className="space-y-6">
        {/* Section skeletons */}
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <SkeletonText width="180px" height="1.125rem" />
            </div>
            <div className="space-y-2">
              <SkeletonText width="100%" height="0.875rem" />
              <SkeletonText width="90%" height="0.875rem" />
              {index % 2 === 0 && (
                <SkeletonText width="85%" height="0.875rem" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

