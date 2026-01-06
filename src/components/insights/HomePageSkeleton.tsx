'use client';

import { SkeletonText } from '../skeletons/SkeletonComponents';
import { InsightsListSkeleton } from './InsightsListSkeleton';

export function HomePageSkeleton() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="mb-2">
        <SkeletonText width="120px" height="2rem" />
      </div>
      <div className="mb-8">
        <SkeletonText width="300px" height="1rem" />
      </div>
      
      {/* Insights list skeleton */}
      <InsightsListSkeleton count={5} />
    </div>
  );
}

