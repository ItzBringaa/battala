import React from 'react';
import { motion } from 'motion/react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-10">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="h-full bg-linear-to-r from-orange-500 to-orange-600"
      />
    </div>
  );
}
