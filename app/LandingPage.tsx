"use client";

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Space_Grotesk } from 'next/font/google';
import { ArrowRight, Users, CheckCircle2, FileText, BarChart3, UserPlus, FileDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PremiumFooter from '@/components/PremiumFooter';
import { api } from '@/lib/api';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

import { useRouter } from 'next/navigation';

// Componente para o Botão Magnético
function MagneticButton({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  return (
    <motion.div
      ref={ref}
      className={`${className} cursor-pointer`}
      onClick={onClick || (() => router.push('/auth'))}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onMouseMove={(e) => {
        const { clientX, clientY } = e;
        if (!ref.current) return;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);
        ref.current.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      }}
      onMouseLeave={() => {
        if (!ref.current) return;
        ref.current.style.transform = `translate(0px, 0px)`;
      }}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const { scrollY } = useScroll();
  const router = useRouter();
  
  // Efeitos de Parallax 3D para a secção Hero
  const heroY = useTransform(scrollY, [0, 800], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.9]);

  const handleStart = () => {
    const user = api.getCurrentUser();
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  };

  return (
    <div className={`min-h-screen text-slate-900 ${spaceGrotesk.className} selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden`}>
      
      {/* Container Principal (Por cima do Footer) */}
      <div className="relative z-10 bg-[#F8FAFC] shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        
        {/* Fundo Premium: Textura de Ruído (Noise) & Glows */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden transform-gpu">
          <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%221%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
          <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-slate-300/30 to-transparent blur-[100px] transform-gpu" />
          <div className="absolute top-[30%] -right-[20%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-bl from-blue-200/20 to-transparent blur-[120px] transform-gpu" />
        </div>

        <div className="relative z-10">
          {/* Editorial Navbar */}
          <nav className="w-full flex items-center justify-between px-6 lg:px-12 py-4 border-b border-slate-200/60 backdrop-blur-md bg-white/30">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4"
            >
              <Image src="/logo.png" alt="GPE Logo" width={40} height={40} className="object-contain" />
              <span className="text-xl font-bold tracking-tighter uppercase hidden sm:block">Gestão de Projetos Escolares</span>
              <span className="text-xl font-bold tracking-tighter uppercase sm:hidden">GPE</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="flex items-center gap-8"
            >
              <button onClick={handleStart} className="group relative px-6 py-2.5 text-xs font-semibold tracking-widest uppercase overflow-hidden border border-slate-900 text-slate-900 hover:text-white transition-colors duration-500 bg-white/50 backdrop-blur-sm">
                <span className="relative z-10">Acesso ao Portal</span>
                <div className="absolute inset-0 bg-slate-900 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></div>
              </button>
            </motion.div>
          </nav>

          {/* Hero Section com Parallax 3D */}
          <main className="px-6 lg:px-12 pt-20 pb-40">
            <motion.div 
              style={{ y: heroY, opacity: heroOpacity, scale: heroScale }} 
              className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10"
            >
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="text-blue-600 font-medium tracking-widest uppercase text-xs mb-8 flex items-center justify-center gap-4"
              >
                <span className="w-8 h-[1px] bg-blue-600 inline-block"></span>
                Plataforma Educacional
                <span className="w-8 h-[1px] bg-blue-600 inline-block"></span>
              </motion.p>
              
              <div className="overflow-hidden mb-8">
                <motion.h1 
                  initial={{ opacity: 0, y: 100, rotateX: 20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95]"
                  style={{ transformPerspective: 1000 }}
                >
                  Gestão <span className="text-slate-400">Inteligente.</span><br />
                  Resultados <span className="text-slate-400">Exatos.</span>
                </motion.h1>
              </div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="max-w-xl mx-auto text-base text-slate-500 leading-relaxed font-sans mb-10"
              >
                A ferramenta definitiva para educadores coordenarem equipas, avaliações e relatórios com precisão cirúrgica. Reduza o atrito e foque-se no que realmente importa.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <MagneticButton onClick={handleStart} className="group relative flex items-center gap-4 bg-slate-900 text-white px-8 py-4 overflow-hidden shadow-2xl shadow-slate-900/20">
                  <div className="absolute inset-0 bg-blue-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></div>
                  <span className="text-xs uppercase tracking-widest font-semibold relative z-10">Começar Agora</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-500" />
                </MagneticButton>
              </motion.div>
            </motion.div>

            {/* Features Grid - Animações 3D no Scroll */}
            <div className="max-w-7xl mx-auto mt-40 pb-20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-24 gap-x-12 perspective-[2000px]">
                
                {[
                  { id: "01", delay: 0.1, title: "Dashboard Minimalista", desc: "Toda a complexidade de gerir múltiplos projetos e fases reduzida a uma interface limpa, onde a informação que precisa está à distância de um clique." },
                  { id: "02", delay: 0.2, title: "Métricas Exatas", desc: "Abandone o 'achismo'. Avaliações baseadas em percentagens reais, com justificações detalhadas e registo rigoroso dos trabalhos feitos por cada membro.", extraClass: "md:mt-24" },
                  { id: "03", delay: 0.3, title: "Relatórios PDF", desc: "Apresente resultados profissionais. A plataforma gera automaticamente documentação oficial pronta a ser entregue aos professores." }
                ].map((feature, idx) => (
                  <motion.div 
                    key={feature.id}
                    initial={{ opacity: 0, y: 150, rotateX: 45, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 1, delay: feature.delay, ease: [0.16, 1, 0.3, 1] }}
                    className={`md:col-span-1 border-t border-slate-900/10 pt-8 relative ${feature.extraClass || ''}`}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <span className="text-5xl font-bold text-slate-300 tracking-tighter block mb-6">{feature.id}</span>
                    <h2 className="text-2xl font-semibold tracking-tight mb-4">{feature.title}</h2>
                    <p className="text-slate-500 font-sans text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </motion.div>
                ))}

              </div>
            </div>
          </main>

          {/* Secção de Filosofia / Manifesto */}
          <section className="w-full bg-slate-950 text-white py-40 relative overflow-hidden transform-gpu">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none transform-gpu"></div>
            
            <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10 text-center">
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl md:text-4xl lg:text-5xl font-light leading-relaxed tracking-tight"
              >
                "A excelência escolar não acontece por acaso. Exige <span className="font-bold text-blue-400">precisão</span>, comunicação clara e ferramentas que acompanhem a velocidade do seu pensamento."
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mt-16 flex flex-col items-center gap-4"
              >
                <div className="w-px h-24 bg-gradient-to-b from-blue-500 to-transparent"></div>
              </motion.div>
            </div>
          </section>

          {/* Secção Como Funciona */}
          <section className="max-w-7xl mx-auto py-40 px-6 lg:px-12">
            <div className="mb-24 flex flex-col items-center text-center">
              <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-4 block">O Processo</span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Do caos à clareza em 3 passos.</h2>
            </div>

            <div className="flex flex-col gap-32">
              {/* Passo 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="order-2 lg:order-1"
                >
                  <span className="text-7xl font-bold text-slate-200 block mb-6">01</span>
                  <h3 className="text-3xl font-bold tracking-tight mb-6">Crie o seu Espaço</h3>
                  <p className="text-slate-500 text-lg leading-relaxed">
                    Adicione os membros da sua equipa e defina os parâmetros do projeto. Um ambiente centralizado onde todos sabem exatamente qual é o seu papel.
                  </p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="order-1 lg:order-2 bg-slate-100 rounded-[2rem] aspect-square lg:aspect-[4/3] flex items-center justify-center border border-slate-200/50 shadow-inner overflow-hidden relative group"
                >
                   <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 to-transparent"></div>
                   <div className="w-3/4 h-3/4 bg-white shadow-2xl rounded-2xl border border-slate-100 transition-transform duration-700 group-hover:scale-105 group-hover:-rotate-2 flex flex-col p-6 overflow-hidden">
                      {/* Mockup Header */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Users className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
                            <div className="h-3 w-16 bg-slate-100 rounded"></div>
                          </div>
                        </div>
                      </div>
                      {/* Mockup Members */}
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                              <UserPlus className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className="h-3 w-3/4 bg-slate-200 rounded mb-1"></div>
                              <div className="h-2 w-1/2 bg-slate-100 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                </motion.div>
              </div>

              {/* Passo 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-slate-100 rounded-[2rem] aspect-square lg:aspect-[4/3] flex items-center justify-center border border-slate-200/50 shadow-inner overflow-hidden relative group"
                >
                   <div className="absolute inset-0 bg-gradient-to-tl from-indigo-100/50 to-transparent"></div>
                   <div className="w-3/4 h-3/4 bg-white shadow-2xl rounded-2xl border border-slate-100 transition-transform duration-700 group-hover:scale-105 group-hover:rotate-2 flex flex-col p-6">
                      {/* Mockup Progress */}
                      <div className="flex items-center gap-2 mb-6">
                        <BarChart3 className="w-5 h-5 text-indigo-500" />
                        <div className="h-4 w-32 bg-slate-200 rounded"></div>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full mb-6 overflow-hidden">
                        <div className="h-full w-[65%] bg-indigo-500 rounded-full"></div>
                      </div>
                      {/* Mockup Tasks */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <div className="h-3 w-40 bg-slate-200 rounded"></div>
                        </div>
                        <div className="flex items-center gap-3 p-2 border border-slate-100 rounded-lg">
                          <div className="w-4 h-4 rounded-full border-2 border-slate-200"></div>
                          <div className="h-3 w-32 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                   </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="text-7xl font-bold text-slate-200 block mb-6">02</span>
                  <h3 className="text-3xl font-bold tracking-tight mb-6">Acompanhe o Progresso</h3>
                  <p className="text-slate-500 text-lg leading-relaxed">
                    Atribua tarefas, registe submissões e monitorize o estado de cada fase em tempo real. Nunca mais perca um prazo ou um ficheiro importante.
                  </p>
                </motion.div>
              </div>

              {/* Passo 3 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="order-2 lg:order-1"
                >
                  <span className="text-7xl font-bold text-slate-200 block mb-6">03</span>
                  <h3 className="text-3xl font-bold tracking-tight mb-6">Avalie e Exporte</h3>
                  <p className="text-slate-500 text-lg leading-relaxed">
                    No final, distribua as percentagens de trabalho de forma justa. Com um clique, gere um relatório PDF profissional pronto a ser entregue.
                  </p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="order-1 lg:order-2 bg-slate-100 rounded-[2rem] aspect-square lg:aspect-[4/3] flex items-center justify-center border border-slate-200/50 shadow-inner overflow-hidden relative group"
                >
                   <div className="absolute inset-0 bg-gradient-to-tr from-sky-100/50 to-transparent"></div>
                   <div className="w-2/3 h-3/4 bg-white shadow-2xl rounded-xl border border-slate-100 transition-transform duration-700 group-hover:scale-105 group-hover:-rotate-2 flex flex-col p-6 relative">
                      {/* Mockup Document */}
                      <div className="flex items-center gap-2 mb-8 border-b border-slate-100 pb-4">
                        <FileText className="w-6 h-6 text-sky-500" />
                        <div className="h-5 w-32 bg-slate-200 rounded"></div>
                      </div>
                      <div className="space-y-3 flex-1">
                        <div className="h-2 w-full bg-slate-100 rounded"></div>
                        <div className="h-2 w-full bg-slate-100 rounded"></div>
                        <div className="h-2 w-4/5 bg-slate-100 rounded"></div>
                        <div className="h-2 w-full bg-slate-100 rounded mt-4"></div>
                        <div className="h-2 w-3/4 bg-slate-100 rounded"></div>
                      </div>
                      {/* Mockup Button */}
                      <div className="mt-auto pt-4 flex justify-center">
                        <div className="flex items-center justify-center gap-2 bg-slate-900 text-white rounded-lg py-2 px-4 w-full">
                          <FileDown className="w-4 h-4" />
                          <div className="h-3 w-20 bg-white/20 rounded"></div>
                        </div>
                      </div>
                   </div>
                </motion.div>
              </div>

            </div>
          </section>



        </div>
      </div>

      {/* Footer com Efeito Sticky Reveal */}
      <PremiumFooter />
      
    </div>
  );
}
