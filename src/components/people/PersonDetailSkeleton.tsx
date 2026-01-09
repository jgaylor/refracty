'use client';

import { SkeletonText, SkeletonBox } from '../skeletons/SkeletonComponents';

export function PersonDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div>
        <div className="flex items-center gap-4">
          {/* Avatar skeleton */}
          <SkeletonBox style={{ width: '4rem', height: '4rem', borderRadius: '50%', flexShrink: 0 }} />
          {/* Name */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <SkeletonText width="200px" height="2rem" />
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Notes Card skeleton */}
      <div
        className="rounded-lg border"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="w-full px-4 py-4 flex items-center">
          <SkeletonText width="180px" height="1rem" />
        </div>
      </div>

      {/* Person Details Card skeleton */}
      <div
        className="rounded-lg border"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-color)',
        }}
      >
        {Array.from({ length: 3 }).map((_, sectionIndex) => (
          <div
            key={sectionIndex}
            className={sectionIndex > 0 ? 'border-t' : ''}
            style={{
              borderColor: sectionIndex > 0 ? 'var(--border-color)' : 'transparent',
            }}
          >
            {/* Section header */}
            <div
              className="w-full px-4 pt-4 pb-2 flex items-center"
            >
              <SkeletonText width="180px" height="1rem" />
            </div>
            {/* Section content */}
            <div className="px-4 pb-4">
              <SkeletonText width="100%" height="0.875rem" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

