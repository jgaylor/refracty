'use client';

import { SkeletonText, SkeletonBox } from '../skeletons/SkeletonComponents';

export function PersonDetailSkeleton() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          {/* Name and Summary */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <SkeletonText width="200px" height="2rem" />
            </div>
            <SkeletonText width="300px" height="1.25rem" />
          </div>
          {/* Avatar skeleton */}
          <SkeletonBox style={{ width: '4rem', height: '4rem', borderRadius: '50%' }} />
        </div>
      </div>

      {/* Expandable Notes Card skeleton */}
      <div className="mb-6">
        <div
          className="rounded-lg border"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="px-4 py-4">
            <SkeletonText width="180px" height="1.25rem" />
          </div>
        </div>
      </div>

      {/* Insights Content skeleton - Single card */}
      <div
        className="rounded-lg border"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-color)',
        }}
      >
        {Array.from({ length: 5 }).map((_, categoryIndex) => (
          <div
            key={categoryIndex}
            className={`px-4 py-4 ${categoryIndex > 0 ? 'border-t' : ''}`}
            style={{
              borderColor: categoryIndex > 0 ? 'var(--border-color)' : 'transparent',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <SkeletonText width="180px" height="0.75rem" />
            </div>
            <div className="space-y-2">
              <SkeletonText width="100%" height="1.125rem" />
              {categoryIndex % 2 === 0 && (
                <SkeletonText width="85%" height="1.125rem" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

