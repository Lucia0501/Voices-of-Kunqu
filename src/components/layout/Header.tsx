"use client";

import { motion } from "framer-motion";
import { titleVariants } from "@/lib/utils/animations";
import { cn } from "@/lib/utils/cn";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function Header({ 
  title = "Voice of Kunqu", 
  subtitle,
  className 
}: HeaderProps) {
  return (
    <header className={cn("text-center py-12 md:py-16", className)}>
      <motion.div
        variants={titleVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {/* Main Title */}
        <h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-lg"
          style={{
            background: 'var(--title-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          {title}
        </h1>

        {/* Chinese Title */}
        <motion.p 
          className="text-2xl md:text-3xl font-chinese text-imperial-ink/80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          昆曲之声
        </motion.p>

        {/* Subtitle */}
        {subtitle && (
          <motion.p 
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Decorative Line */}
        <motion.div
          className="flex items-center justify-center pt-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <div className="h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent w-32 md:w-48" />
          <div className="mx-4 w-2 h-2 rounded-full bg-[#650010]" />
          <div className="h-px bg-gradient-to-r from-[#FFD700] via-transparent to-[#FFD700] w-32 md:w-48" />
        </motion.div>
      </motion.div>
    </header>
  );
}