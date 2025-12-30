export default async function Home() {
  return (
    <main className="flex justify-center px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Welcome to Refracty</h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Start by adding people to track insights about how they work best.
        </p>
      </div>
    </main>
  );
}
