import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topnav from '../components/Topnav';

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800">
      {/* Sidebar overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-50 md:z-auto print:hidden`}>
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col relative overflow-hidden print:overflow-visible w-full">
        {/* Decorative Background Blob */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-400/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 print:hidden"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2 print:hidden"></div>
        
        <div className="print:hidden">
          <Topnav onMenuClick={() => setIsMobileMenuOpen(true)} />
        </div>
        
        <main className="flex-1 overflow-y-auto print:overflow-visible p-4 md:p-8 print:p-0 z-0">
          <div className="max-w-7xl mx-auto print:max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
