import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topnav from '../components/Topnav';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Decorative Background Blob */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-400/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>
        
        <Topnav />
        
        <main className="flex-1 overflow-y-auto p-8 z-0">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
