"use client";

import { motion } from "framer-motion";
import { OperaWork } from "@/lib/data/types";
import { cardVariants } from "@/lib/utils/animations";
import { cn } from "@/lib/utils/cn";

interface OperaCardProps {
  opera: OperaWork;
  index: number;
  onClick: () => void;
}

export default function OperaCard({ opera, index: _index, onClick }: OperaCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative overflow-hidden rounded-xl cursor-pointer",
        "bg-gradient-to-br from-amber-50 to-orange-100",
        "border border-amber-200 shadow-lg",
        "hover:shadow-xl transition-shadow duration-300"
      )}
      onClick={onClick}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-gradient-to-br from-imperial-red/20 to-imperial-gold/20" />
      </div>

      {/* Content */}
      <div className="relative p-6 space-y-4">
        {/* Title Section */}
        <div className="space-y-2">
          <motion.h3 
            className="text-xl font-bold text-imperial-ink group-hover:text-imperial-red transition-colors duration-300"
            layoutId={`title-${opera.id}`}
          >
            {opera.title}
          </motion.h3>
          <motion.p 
            className="text-lg font-chinese text-imperial-red/80"
            layoutId={`original-title-${opera.id}`}
          >
            {opera.originalTitle}
          </motion.p>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="font-medium">{opera.author}</span>
          <span className="text-imperial-gold">{opera.dynasty}</span>
        </div>

        {/* Description */}
        <motion.p 
          className="text-gray-700 text-sm leading-relaxed line-clamp-3"
          layoutId={`description-${opera.id}`}
        >
          {opera.description}
        </motion.p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {opera.metadata.themes.slice(0, 3).map((theme, themeIndex) => (
            <span
              key={themeIndex}
              className={cn(
                "px-2 py-1 text-xs font-medium rounded-full",
                "bg-imperial-red/10 text-imperial-red",
                "group-hover:bg-imperial-red/20 transition-colors duration-300"
              )}
            >
              {theme}
            </span>
          ))}
        </div>

        {/* Reading Time */}
        <div className="flex items-center justify-between pt-2 border-t border-amber-200/50">
          <span className="text-xs text-gray-500">
            {opera.metadata.estimatedReadingTime} min read
          </span>
          <span className={cn(
            "text-xs px-2 py-1 rounded-full font-medium",
            opera.metadata.difficultyLevel === 'beginner' && "bg-green-100 text-green-700",
            opera.metadata.difficultyLevel === 'intermediate' && "bg-yellow-100 text-yellow-700",
            opera.metadata.difficultyLevel === 'advanced' && "bg-red-100 text-red-700"
          )}>
            {opera.metadata.difficultyLevel}
          </span>
        </div>

        {/* Hover Arrow */}
        <motion.div
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ x: -10 }}
          whileHover={{ x: 0 }}
        >
          <svg
            className="w-5 h-5 text-imperial-red"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.div>
      </div>

      {/* Cultural Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-imperial-gold/30 rounded-xl transition-colors duration-500" />
    </motion.div>
  );
}