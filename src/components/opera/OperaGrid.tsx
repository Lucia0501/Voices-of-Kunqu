"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { OperaWork } from "@/lib/data/types";
import { containerVariants } from "@/lib/utils/animations";
import OperaCard from "./OperaCard";

interface OperaGridProps {
  operas: OperaWork[];
}

export default function OperaGrid({ operas }: OperaGridProps) {
  const router = useRouter();

  const handleOperaSelect = (slug: string) => {
    router.push(`/opera/${slug}`);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {operas.map((opera, index) => (
        <OperaCard
          key={opera.id}
          opera={opera}
          index={index}
          onClick={() => handleOperaSelect(opera.slug)}
        />
      ))}
    </motion.div>
  );
}