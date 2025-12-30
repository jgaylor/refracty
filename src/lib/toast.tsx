'use client';

import React from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface ToastLink {
  href: string;
  text: string;
}

/**
 * Show a success toast with an optional link
 */
export function showSuccessToast(message: string, link?: ToastLink) {
  if (link) {
    toast.success(
      (t) => (
        <div className="flex items-center gap-2">
          <span>{message}</span>
          <Link
            href={link.href}
            onClick={() => toast.dismiss(t.id)}
            className="font-medium underline hover:opacity-80 transition-opacity"
            style={{ color: 'var(--link-color)' }}
          >
            {link.text}
          </Link>
        </div>
      ),
      {
        duration: 5000,
      }
    );
  } else {
    toast.success(message);
  }
}

/**
 * Show an error toast
 */
export function showErrorToast(message: string) {
  toast.error(message);
}

