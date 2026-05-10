"use client";

import { motion } from 'framer-motion';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 dark:bg-slate-900/80 rounded-3xl p-12 text-center border border-[#802BB1]/15 shadow-xl shadow-[#802BB1]/10 mt-8 max-w-2xl mx-auto w-full"
    >
      <div className="w-24 h-24 bg-[#802BB1]/10 dark:bg-[#802BB1]/20 rounded-full flex items-center justify-center mx-auto mb-6">
        {Icon && <Icon className="h-10 w-10 text-[#802BB1] dark:text-[#bd6eff]" />}
      </div>
      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">{title || 'No Data Available'}</h3>
      <p className="text-slate-500 text-lg mb-8">
        {description || 'There is no data to display at this moment.'}
      </p>
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </motion.div>
  );
}
