'use client';

import { SkeletonCard, SkeletonAvatar, SkeletonText } from '../skeletons/SkeletonComponents';

export function PeopleListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} className="mb-4 last:mb-0">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <SkeletonAvatar size={48} />

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* Name */}
              <SkeletonText width="60%" height="1.125rem" />
              
              {/* Optional summary line */}
              {index % 2 === 0 && (
                <SkeletonText width="80%" height="0.875rem" />
              )}
              
              {/* Optional note line */}
              {index % 3 === 0 && (
                <SkeletonText width="90%" height="0.875rem" />
              )}
            </div>
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}

