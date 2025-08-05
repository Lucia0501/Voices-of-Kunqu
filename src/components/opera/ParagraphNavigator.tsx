"use client";

import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "framer-motion";
import { OperaWork } from "@/lib/data/types";
import SplitTextViewer from "./SplitTextViewer";
import { cn } from "@/lib/utils/cn";

interface ParagraphNavigatorProps {
  opera: OperaWork;
}

export default function ParagraphNavigator({ opera }: ParagraphNavigatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const currentParagraph = opera.paragraphs[currentIndex];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < opera.paragraphs.length - 1;

  const goToPrevious = () => {
    if (hasPrevious) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (hasNext) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (hasNext) goToNext();
    },
    onSwipedRight: () => {
      if (hasPrevious) goToPrevious();
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
    delta: 10
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && hasPrevious) {
        goToPrevious();
      } else if (event.key === 'ArrowRight' && hasNext) {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, hasPrevious, hasNext]);

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="relative" {...swipeHandlers}>
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-6 gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-sm">
          <span className="text-sm font-medium text-gray-600">
            {currentIndex + 1} of {opera.paragraphs.length}
          </span>
          <div className="flex gap-1">
            {opera.paragraphs.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentIndex 
                    ? "bg-imperial-red scale-125" 
                    : "bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`Go to paragraph ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons - Desktop */}
      <div className="hidden md:block">
        <button
          onClick={goToPrevious}
          disabled={!hasPrevious}
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 z-10",
            "w-12 h-12 rounded-full shadow-lg",
            "bg-white hover:bg-gray-50 transition-all duration-300",
            "flex items-center justify-center",
            hasPrevious ? "text-imperial-red" : "text-gray-300 cursor-not-allowed"
          )}
          aria-label="Previous paragraph"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={goToNext}
          disabled={!hasNext}
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 z-10",
            "w-12 h-12 rounded-full shadow-lg",
            "bg-white hover:bg-gray-50 transition-all duration-300",
            "flex items-center justify-center",
            hasNext ? "text-imperial-red" : "text-gray-300 cursor-not-allowed"
          )}
          aria-label="Next paragraph"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Paragraph Content with Animation */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="mb-8"
        >
          <SplitTextViewer 
            paragraph={currentParagraph}
            operaSlug={opera.slug}
            isFirst={currentIndex === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Mobile Navigation Hints */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mt-6 px-4">
          <button
            onClick={goToPrevious}
            disabled={!hasPrevious}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full",
              "bg-white shadow-md transition-all duration-300",
              hasPrevious 
                ? "text-imperial-red hover:bg-red-50" 
                : "text-gray-300 cursor-not-allowed"
            )}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Previous</span>
          </button>

          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Swipe to navigate</p>
            <div className="flex gap-1">
              <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
              <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
              <div className="w-8 h-1 bg-imperial-red rounded-full"></div>
            </div>
          </div>

          <button
            onClick={goToNext}
            disabled={!hasNext}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full",
              "bg-white shadow-md transition-all duration-300",
              hasNext 
                ? "text-imperial-red hover:bg-red-50" 
                : "text-gray-300 cursor-not-allowed"
            )}
          >
            <span className="text-sm font-medium">Next</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}