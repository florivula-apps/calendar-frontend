import { Outlet } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import MobileHeader from '@/components/MobileHeader';

export default function MobileLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Fixed header */}
      <MobileHeader />

      {/* Main content area between header and bottom nav */}
      <main
        className="flex-1 overflow-y-auto"
        style={{
          paddingTop: 'calc(48px + env(safe-area-inset-top))',
          paddingBottom: 'calc(56px + env(safe-area-inset-bottom))',
        }}
      >
        <Outlet />
      </main>

      {/* Fixed bottom navigation */}
      <BottomNav />
    </div>
  );
}
