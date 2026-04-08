"use client";
import { useState, useEffect } from 'react';
import { Users, Building, Activity, Plus, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalUsers: 0, totalProperties: 0, activeBookings: 0 });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchAdminData() {
      try {
        setLoading(true);
        if (activeTab === 'overview') {
          const res = await fetch('/api/admin/stats');
          if (res.ok) {
            const data = await res.json();
            setStats(data);
          } else if (res.status === 401 || res.status === 403) {
            router.push('/login');
          }
        } else if (activeTab === 'properties') {
          const res = await fetch('/api/admin/properties');
          if (res.ok) {
            const data = await res.json();
            setProperties(data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAdminData();
  }, [activeTab, router]);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex">
      {/* Admin Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 min-h-screen p-4 flex-shrink-0">
        <div className="mb-10 mt-4 px-2">
          <h2 className="text-white text-xl font-black tracking-tight">Admin<span className="text-primary">Panel</span></h2>
        </div>
        <nav className="space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'overview' ? 'bg-primary text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Activity className="h-5 w-5" /> Overview
          </button>
          <button onClick={() => setActiveTab('properties')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'properties' ? 'bg-primary text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Building className="h-5 w-5" /> Properties
          </button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'users' ? 'bg-primary text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Users className="h-5 w-5" /> Users
          </button>
          <button onClick={() => setActiveTab('bookings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'bookings' ? 'bg-primary text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
            <FileText className="h-5 w-5" /> Bookings
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        {loading && <div className="absolute top-4 right-8 w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>}

        {activeTab === 'overview' && (
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                 <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl"><Users className="h-8 w-8" /></div>
                 <div><p className="text-slate-500 text-sm font-medium">Total Users</p><p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalUsers}</p></div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                 <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl"><Building className="h-8 w-8" /></div>
                 <div><p className="text-slate-500 text-sm font-medium">Properties</p><p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalProperties}</p></div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                 <div className="p-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl"><FileText className="h-8 w-8" /></div>
                 <div><p className="text-slate-500 text-sm font-medium">Active Bookings</p><p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.activeBookings}</p></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Manage Properties</h1>
              <button className="bg-primary hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-transform hover:scale-105">
                 <Plus className="h-5 w-5" /> Add Property
              </button>
            </div>
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
               <table className="w-full text-left">
                 <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                   <tr>
                     <th className="px-6 py-4 font-medium text-slate-500 text-sm uppercase tracking-wider">Property</th>
                     <th className="px-6 py-4 font-medium text-slate-500 text-sm uppercase tracking-wider">Type</th>
                     <th className="px-6 py-4 font-medium text-slate-500 text-sm uppercase tracking-wider">Price/mo</th>
                     <th className="px-6 py-4 font-medium text-slate-500 text-sm uppercase tracking-wider">Status</th>
                     <th className="px-6 py-4 font-medium text-slate-500 text-sm uppercase tracking-wider">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                   {properties.length === 0 ? (
                     <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No properties found.</td></tr>
                   ) : (
                     properties.map(p => (
                       <tr key={p._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                         <td className="px-6 py-4">
                           <span className="font-semibold text-slate-900 dark:text-white">{p.title}</span><br/>
                           <span className="text-sm text-slate-500">{p.location?.city || 'N/A'}</span>
                         </td>
                         <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{p.category}</td>
                         <td className="px-6 py-4 text-slate-600 dark:text-slate-300">₹{p.price.toLocaleString()}</td>
                         <td className="px-6 py-4"><span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg uppercase">Available</span></td>
                         <td className="px-6 py-4"><button className="text-primary hover:underline font-medium">Edit</button></td>
                       </tr>
                     ))
                   )}
                 </tbody>
               </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
