"use client";

import Link from "next/link";
import { ArrowRight, Mail, MapPin, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

export default function Contactos() {
  return (
    <div className={`min-h-screen bg-slate-950 text-white ${spaceGrotesk.className} overflow-hidden relative`}>
      {/* Background Decorators Premium Escuros */}
      <div className="absolute top-[10%] left-[20%] w-[60vw] h-[60vw] bg-blue-900/20 rounded-full blur-[150px] -z-10 mix-blend-screen" />
      <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-indigo-900/20 rounded-full blur-[120px] -z-10 mix-blend-screen" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-32 relative z-10">
        
        <Link href="/" className="group inline-flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-slate-500 hover:text-white transition-colors mb-24">
          <span className="w-8 h-[1px] bg-slate-700 group-hover:bg-white transition-colors"></span>
          Voltar ao Início
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          <div className="flex flex-col justify-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-8"
            >
              Vamos falar <br/>
              sobre o <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">futuro.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-slate-400 leading-relaxed font-sans max-w-md"
            >
              Para dúvidas técnicas, suporte ao sistema ou questões comerciais. A nossa equipa de engenharia e suporte está pronta para responder com a maior brevidade.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col gap-6"
          >
            {/* Contact Card 1 */}
            <a href="mailto:Anthonypeteroficial@gmail.com" className="group p-8 md:p-10 border border-slate-800 bg-slate-900/50 backdrop-blur-xl hover:bg-slate-800/80 transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-out" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <Mail className="w-8 h-8 text-blue-400 mb-6" />
                  <h3 className="text-xl font-bold mb-2">Suporte Direto</h3>
                  <p className="text-sm font-sans text-slate-400 mb-6">Resposta em menos de 24 horas úteis.</p>
                  <p className="font-mono text-sm tracking-tight text-white group-hover:text-blue-400 transition-colors">
                    Anthonypeteroficial@gmail.com
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-slate-600 group-hover:text-white group-hover:-rotate-45 transition-all duration-300" />
              </div>
            </a>

            {/* Contact Card 2 */}
            <div className="p-8 md:p-10 border border-slate-800 bg-slate-900/50 backdrop-blur-xl relative overflow-hidden">
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <Globe className="w-8 h-8 text-indigo-400 mb-6" />
                  <h3 className="text-xl font-bold mb-2">A Origem da GPE</h3>
                  <p className="text-sm font-sans text-slate-400 mb-6">Sem sede, mas com muito propósito.</p>
                  <p className="text-white font-medium text-sm leading-relaxed">
                    A GPE não tem sede física. É um projeto nascido da necessidade real do <span className="text-indigo-400 font-bold">António Pedro</span> para facilitar a gestão dos seus próprios trabalhos escolares. Ao perceber o impacto da ferramenta, decidiu partilhá-la com o mundo para elevar o ensino global.
                  </p>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
