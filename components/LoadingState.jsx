"use client";

export default function LoadingState({ type = 'spinner' }) {
  if (type === 'skeleton-grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="dark:bg-slate-900/80  bg-white  rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-pulse">
            <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800"></div>
            <div className="p-6 space-y-4">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-full mt-6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // default spinner
  return (
    <div className="flex justify-center items-center py-20 w-full min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#802BB1] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading...</p>
      </div>
    </div>
  );
}
