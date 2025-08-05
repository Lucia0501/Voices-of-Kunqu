import { Variants } from "framer-motion";

// Page transition animations
export const pageVariants: Variants = {
  initial: { x: 300, opacity: 0 },
  in: { x: 0, opacity: 1 },
  out: { x: -300, opacity: 0 }
};

export const pageTransition = {
  type: "tween" as const,
  ease: "anticipate",
  duration: 0.6
};

// Opera card animations
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const cardVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  hover: {
    y: -10,
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

// Text animation variants
export const textRevealVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1
    }
  }
};

// Text highlighting for synchronized audio
export const highlightVariants: Variants = {
  inactive: { 
    color: "rgb(107, 114, 128)", // gray-500
    backgroundColor: "transparent"
  },
  active: {
    color: "rgb(239, 68, 68)", // red-500 (cultural significance)
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};

// Title animation for landing page
export const titleVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: -50,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      delay: 0.2
    }
  }
};