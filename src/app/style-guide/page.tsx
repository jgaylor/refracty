import { StyleGuide } from '@/components/StyleGuide';

export default function StyleGuidePage() {
  return (
    <div className="px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Style Guide</h1>
        <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
          A comprehensive reference for all components and design tokens used in Refracty
        </p>
        <StyleGuide />
      </div>
    </div>
  );
}

