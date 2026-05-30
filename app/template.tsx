"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isSimpleAnimation = pathname && (
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/projects') || 
    pathname.startsWith('/phases') || 
    pathname.startsWith('/results')
  );

  if (isSimpleAnimation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <>
      {/* Cortina preta premium que revela a nova página subindo */}
      <motion.div
        className="fixed inset-0 z-[9999] bg-slate-950 pointer-events-none"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ originY: 0 }} // 0 = A cortina sobe para desaparecer no topo
      />
      
      {/* O conteúdo da página faz um leve fade e slide up ao entrar */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      >
        {children}
      </motion.div>
    </>
  );
}
