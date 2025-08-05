"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Paragraph } from "@/lib/data/types";
import { textRevealVariants } from "@/lib/utils/animations";
import { cn } from "@/lib/utils/cn";
import TextHighlighter from "./TextHighlighter";
import AudioController from "./AudioController";

interface SplitTextViewerProps {
  paragraph: Paragraph;
  operaSlug: string;
  isFirst?: boolean;
}

export default function SplitTextViewer({ 
  paragraph, 
  operaSlug, 
  isFirst: _isFirst = false 
}: SplitTextViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);

  const handleWordSync = (wordIndex: number) => {
    setCurrentWordIndex(wordIndex);
  };

  const handlePlayStateChange = (playing: boolean) => {
    setIsPlaying(playing);
    if (!playing) {
      setCurrentWordIndex(-1);
    }
  };

  return (
    <motion.div
      variants={textRevealVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto"
    >
      {/* Original Chinese Text (Mobile First) */}
      <motion.div 
        className="mb-6 p-6 rounded-lg bg-gradient-to-br from-red-50 to-red-100 border border-red-200"
        variants={textRevealVariants}
      >
        <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-imperial-red" />
          Original Chinese
        </h3>
        <div className="space-y-4">
          <p className="text-2xl font-chinese text-imperial-ink leading-relaxed">
            {paragraph.original}
          </p>
          {paragraph.pinyin && (
            <p className="text-gray-600 text-sm tracking-wide">
              {paragraph.pinyin}
            </p>
          )}
        </div>
      </motion.div>

      {/* Split Translation Layout */}
      <div className={cn(
        "grid gap-6",
        "grid-rows-2 lg:grid-rows-1", // Vertical on mobile, horizontal on desktop
        "lg:grid-cols-2 lg:min-h-[60vh]"
      )}>
        {/* Shakespeare-style Translation */}
        <motion.div
          className={cn(
            "space-y-4 p-6 rounded-lg",
            "bg-gradient-to-br from-amber-50 to-orange-50",
            "border border-amber-200"
          )}
          variants={textRevealVariants}
        >
          <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-imperial-gold" />
            Shakespeare Style
          </h3>
          <TextHighlighter
            text={paragraph.shakespearean}
            highlightIndex={currentWordIndex}
            animationStyle="glow"
            language="shakespearean"
            className="text-lg leading-relaxed font-english"
          />
        </motion.div>

        {/* Literal Translation */}
        <motion.div
          className={cn(
            "space-y-4 p-6 rounded-lg",
            "bg-gradient-to-br from-blue-50 to-indigo-50",
            "border border-blue-200"
          )}
          variants={textRevealVariants}
        >
          <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-imperial-jade" />
            Literal Translation
          </h3>
          <TextHighlighter
            text={paragraph.literal}
            highlightIndex={currentWordIndex}
            animationStyle="fade"
            language="literal"
            className="text-lg leading-relaxed"
          />
        </motion.div>
      </div>

      {/* Audio Controller */}
      <motion.div 
        className="mt-6"
        variants={textRevealVariants}
      >
        <AudioController
          paragraphId={paragraph.id}
          operaSlug={operaSlug}
          text={paragraph.shakespearean} // Use Shakespeare version for TTS
          onProgress={handleWordSync}
          onPlayStateChange={handlePlayStateChange}
          isPlaying={isPlaying}
        />
      </motion.div>

      {/* Cultural Notes */}
      {paragraph.metadata.culturalNotes && paragraph.metadata.culturalNotes.length > 0 && (
        <motion.div 
          className="mt-6 p-6 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200"
          variants={textRevealVariants}
        >
          <h4 className="text-md font-bold text-green-900 mb-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-imperial-jade" />
            Cultural Context
          </h4>
          <ul className="space-y-2">
            {paragraph.metadata.culturalNotes.map((note, index) => (
              <li key={index} className="text-sm text-green-800 leading-relaxed">
                • {note}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Scene Information */}
      <motion.div 
        className="mt-4 flex items-center justify-between text-sm text-gray-600"
        variants={textRevealVariants}
      >
        <div className="flex items-center gap-4">
          {paragraph.metadata.scene && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v2a1 1 0 001 1h1a1 1 0 001-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1z" />
              </svg>
              {paragraph.metadata.scene}
            </span>
          )}
          {paragraph.metadata.character && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {paragraph.metadata.character}
            </span>
          )}
          {paragraph.metadata.emotion && (
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              paragraph.metadata.emotion === 'joy' && "bg-yellow-100 text-yellow-700",
              paragraph.metadata.emotion === 'sorrow' && "bg-blue-100 text-blue-700",
              paragraph.metadata.emotion === 'anger' && "bg-red-100 text-red-700",
              paragraph.metadata.emotion === 'contemplation' && "bg-purple-100 text-purple-700"
            )}>
              {paragraph.metadata.emotion}
            </span>
          )}
        </div>
        <div className="text-xs opacity-70">
          Paragraph {paragraph.sequence}
        </div>
      </motion.div>
    </motion.div>
  );
}