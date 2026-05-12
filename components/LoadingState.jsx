"use client";

export default function LoadingState({ type = 'spinner' }) {
  if (type === 'skeleton-grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-[#0f1220] dark:bg-[#08090f] rounded-3xl overflow-hidden border border-[#1d2443] dark:border-[#1c1f2c] animate-pulse">
            <div className="aspect-[4/3] bg-[#181e3a] dark:bg-[#10121f]"></div>
            <div className="p-6 space-y-4">
              <div className="h-6 bg-[#1b243f] dark:bg-[#141728] rounded w-3/4"></div>
              <div className="h-4 bg-[#1b243f] dark:bg-[#141728] rounded w-1/2"></div>
              <div className="h-10 bg-[#1b243f] dark:bg-[#141728] rounded w-full mt-6"></div>
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
