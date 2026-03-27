import React from 'react';
import { motion } from 'motion/react';
import { Info, CheckCircle, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'info' | 'success' | 'error';
}

export default function Toast({ message, type = 'info' }: ToastProps) {
  const icons = {
    info: <Info size={20} />,
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
  };

  const colors = {
    info: 'bg-blue-600',
    success: 'bg-green-600',
    error: 'bg-red-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]"
    >
      <div className={`${colors[type]} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px] border-4 border-white/20 backdrop-blur-sm`}>
        {icons[type]}
        <span className="font-black text-sm tracking-wide uppercase">{message}</span>
      </div>
    </motion.div>
  );
}
