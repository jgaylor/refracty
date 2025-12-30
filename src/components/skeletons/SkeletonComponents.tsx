'use client';

import React from 'react';

/**
 * Base skeleton box with shimmer animation
 */
export function SkeletonBox({ 
  className = '', 
  style = {} 
}: { 
  className?: string; 
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`skeleton-box ${className}`}
      style={{
        backgroundColor: 'var(--bg-tertiary)',
        borderRadius: '0.5rem',
        ...style,
      }}
    />
  );
}

/**
 * Skeleton text line
 */
export function SkeletonText({ 
  width = '100%', 
  height = '1rem',
  className = ''
}: { 
  width?: string | number; 
  height?: string | number;
  className?: string;
}) {
  return (
    <SkeletonBox
      className={className}
      style={{
        width,
        height,
        borderRadius: '0.25rem',
      }}
    />
  );
}

/**
 * Circular avatar skeleton
 */
export function SkeletonAvatar({ 
  size = 48,
  className = ''
}: { 
  size?: number;
  className?: string;
}) {
  return (
    <SkeletonBox
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
      }}
    />
  );
}

/**
 * Card-shaped skeleton matching our card style
 */
export function SkeletonCard({ 
  className = '',
  children
}: { 
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`p-4 rounded-lg border ${className}`}
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)',
      }}
    >
      {children}
    </div>
  );
}

