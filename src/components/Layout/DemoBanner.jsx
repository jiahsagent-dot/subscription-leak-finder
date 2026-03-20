import { Database } from 'lucide-react';

const DemoBanner = () => (
  <div className="bg-amber-500 text-white text-xs font-semibold px-4 py-2 flex items-center gap-2 justify-center">
    <Database size={13} />
    Demo mode — data saved locally in your browser
  </div>
);

export default DemoBanner;
