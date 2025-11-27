import { Dashboard } from '@/components/Dashboard';

export default function Home() {
  return (
    <div className="z-10 w-full max-w-7xl items-center justify-between font-mono text-sm lg:flex flex-col gap-8">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-blue text-glow mb-8">
        Cannabis Business Tracker
      </h1>
      <Dashboard />
    </div>
  );
}
