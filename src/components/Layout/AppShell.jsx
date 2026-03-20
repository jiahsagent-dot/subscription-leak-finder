import BottomNav from './BottomNav';

const AppShell = ({ children }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative">
    <main className="flex-1 overflow-y-auto pb-24">{children}</main>
    <BottomNav />
  </div>
);

export default AppShell;
