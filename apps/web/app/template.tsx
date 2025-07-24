export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen w-full">
      {/* Suspense für Layout Shifts verhindern */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black to-zinc-900" />
      {children}
    </main>
  );
}
