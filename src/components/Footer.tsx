export function Footer() {
  return (
    <footer className="flex-1 flex items-end bg-neutral-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-xs text-neutral-400">
          © {new Date().getFullYear()} Refracty. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

