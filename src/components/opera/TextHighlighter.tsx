"use client";

import { motion } from "framer-motion";
import { highlightVariants } from "@/lib/utils/animations";
import { cn } from "@/lib/utils/cn";

interface TextHighlighterProps {
  text: string;
  highlightIndex: number;
  animationStyle: 'fade' | 'slide' | 'glow';
  language: 'shakespearean' | 'literal';
  className?: string;
}

export default function TextHighlighter({
  text,
  highlightIndex,
  animationStyle,
  language,
  className
}: TextHighlighterProps) {
  // Split text into words for highlighting
  const words = text.split(' ');

  const getAnimationClass = (isActive: boolean) => {
    if (!isActive) return '';
    
    switch (animationStyle) {
      case 'glow':
        return 'animate-text-glow';
      case 'slide':
        return 'transform translate-x-1';
      case 'fade':
      default:
        return '';
    }
  };

  return (
    <div className={cn("select-text", className)}>
      {words.map((word, index) => {
        const isActive = index === highlightIndex;
        const isNearby = Math.abs(index - highlightIndex) <= 2 && highlightIndex >= 0;
        
        return (
          <motion.span
            key={`${word}-${index}`}
            variants={highlightVariants}
            animate={isActive ? "active" : "inactive"}
            className={cn(
              "inline-block mr-1 transition-all duration-300 cursor-pointer",
              getAnimationClass(isActive),
              isNearby && !isActive && "opacity-70",
              !isNearby && highlightIndex >= 0 && "opacity-40",
              "hover:opacity-100"
            )}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.1 }
            }}
            style={{
              textShadow: isActive 
                ? language === 'shakespearean' 
                  ? '0 0 8px rgba(239, 68, 68, 0.6)' 
                  : '0 0 6px rgba(59, 130, 246, 0.5)'
                : 'none'
            }}
          >
            {word}
          </motion.span>
        );
      })}
    </div>
  );
}