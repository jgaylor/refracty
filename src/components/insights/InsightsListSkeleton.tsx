'use client';

import { SkeletonCard, SkeletonText } from '../skeletons/SkeletonComponents';

export function InsightsListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index}>
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {/* Person name */}
                <SkeletonText width="120px" height="1rem" />
                {/* Badge */}
                <SkeletonText width="80px" height="1rem" className="rounded" />
              </div>
              {/* Timestamp */}
              <SkeletonText width="100px" height="0.875rem" />
            </div>
          </div>
          {/* Content lines */}
          <div className="mt-2 space-y-1">
            <SkeletonText width="100%" height="0.875rem" />
            <SkeletonText width="85%" height="0.875rem" />
            {index % 2 === 0 && (
              <SkeletonText width="70%" height="0.875rem" />
            )}
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}

