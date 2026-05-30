"use client";

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

export default function PremiumFooter() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end end']
  });
  
  // Parallax the footer content slightly as it reveals
  const y = useTransform(scrollYProgress, [0, 1], [-150, 0]);

  return (
    <footer 
      ref={container}
      className={`relative h-[600px] bg-slate-950 text-white overflow-hidden ${spaceGrotesk.className}`}
    >
      <motion.div style={{ y }} className="absolute inset-0 h-full w-full flex flex-col justify-between p-8 md:p-16">
        
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <h2 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter uppercase leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 mb-12">
            Pronto para<br />Elevar o Ensino?
          </h2>
          
          <Link href="/auth" className="group relative overflow-hidden rounded-full p-[1px] inline-block shadow-2xl">
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-500"></span>
            <div className="relative bg-slate-950 px-10 py-5 rounded-full flex items-center justify-center gap-3 transition-transform duration-500 ease-out group-hover:scale-[0.98]">
              <span className="text-sm font-semibold tracking-widest uppercase text-white">Começar Agora</span>
            </div>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center md:items-end border-t border-slate-800/50 pt-8 mt-auto gap-8">
          <div className="flex items-center gap-4 bg-white/5 p-2 rounded-lg">
            <Image src="/logo.png" alt="GPE Logo" width={32} height={32} className="object-contain" />
            <div className="text-xs text-slate-400 font-medium tracking-widest uppercase">
              © {new Date().getFullYear()} Gestão de Projetos Escolares
            </div>
          </div>
          
          <div className="flex gap-8 text-xs font-semibold uppercase tracking-widest text-slate-500">
            <Link href="/sobre" className="hover:text-white transition-colors duration-300">Sobre Nós</Link>
            <Link href="/termos" className="hover:text-white transition-colors duration-300">Termos</Link>
            <Link href="/privacidade" className="hover:text-white transition-colors duration-300">Privacidade</Link>
            <Link href="/contactos" className="hover:text-white transition-colors duration-300">Contactos</Link>
          </div>
        </div>

      </motion.div>
    </footer>
  );
}
