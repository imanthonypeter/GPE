"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

const Scroll3DSection = ({ children, offset = ["0 1", "1.2 1"] }: { children: React.ReactNode, offset?: any }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [150, 0]);

  return (
    <div style={{ perspective: "1500px" }} className="w-full">
      <motion.div
        ref={ref}
        style={{
          rotateX,
          scale,
          opacity,
          y,
          transformStyle: "preserve-3d",
          transformOrigin: "top center"
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
};

const ProtectedSocialLink = ({ url, icon, label, iconHoverClass = "", borderHoverClass = "hover:border-blue-500/50", bgHoverClass = "hover:bg-white/10" }: { url: string, icon: React.ReactNode, label: string, iconHoverClass?: string, borderHoverClass?: string, bgHoverClass?: string }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (url.startsWith('mailto:')) {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group/btn flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 group-hover:border-blue-500/50 ${bgHoverClass} ${borderHoverClass} transition-all duration-300 cursor-pointer hover:scale-110 shadow-lg hover:shadow-xl active:scale-95`}
      title={label}
      aria-label={label}
    >
      <span className={`text-slate-400 group-hover:text-blue-400 ${iconHoverClass} transition-colors duration-300`}>
        {icon}
      </span>
    </button>
  );
};

export default function Sobre() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const email = 'Anthonypeteroficial@gmail.com';
  const links = {
    github: 'https://github.com/imanthonypeter',
    linkedin: 'https://www.linkedin.com/in/ant%C3%B3nio-pedro-05167a293/',
    instagram: 'https://www.instagram.com/imanthonypeter/',
    email: `mailto:${email}`
  };

  return (
    <div ref={containerRef} className={`relative min-h-screen bg-slate-950 text-slate-200 overflow-hidden pt-32 pb-32 ${spaceGrotesk.className}`}>

      {/* Background Noise & Grain */}
      <div className="fixed inset-0 z-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* Subtle Glows adaptados para o azul GPE */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-[100%] pointer-events-none opacity-50"></div>

      <main className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 flex flex-col gap-32">
        <Link href="/" className="group inline-flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-slate-500 hover:text-white transition-colors absolute top-0 left-6 lg:left-12">
          <span className="w-8 h-[1px] bg-slate-700 group-hover:bg-white transition-colors"></span>
          Voltar ao Início
        </Link>

        {/* HERO */}
        <section className="min-h-[50vh] flex flex-col justify-center relative mt-16">
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 flex items-center gap-4"
            >
              <div className="w-12 h-px bg-blue-500"></div>
              <span className="text-blue-500 uppercase tracking-[0.3em] text-xs font-bold">O Projeto</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-[6rem] font-bold text-white tracking-tighter leading-[0.9] max-w-4xl"
            >
              Arquitetura educacional <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-400 to-slate-600">sem compromissos.</span>
            </motion.h1>
          </motion.div>
        </section>

        {/* MANIFESTO / STORY COM SCROLL 3D */}
        <Scroll3DSection offset={["0 1", "0.8 1"]}>
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start bg-white/5 backdrop-blur-xl p-12 md:p-16 rounded-[3rem] border border-white/5 relative overflow-hidden group shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <div className="lg:col-span-4 relative z-10">
              <h2 className="text-2xl md:text-3xl font-light text-white leading-tight">
                Nós rejeitamos a <br />
                <span className="font-bold text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.4)]">desorganização.</span>
              </h2>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-8 relative z-10">
              <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed">
                A Gestão de Projetos Escolares (GPE) nasceu de uma frustração simples: coordenar equipas de estudantes, avaliações e documentação é frequentemente um processo caótico. Decidimos mudar isso.
              </p>
              <p className="text-lg text-slate-500 leading-relaxed max-w-3xl">
                Cada linha de código que escrevemos tem um único objetivo: criar uma ferramenta irresistível e implacável para o ambiente escolar. Unimos a estética de software de alta gama à engenharia de dados precisa para garantir que o seu trabalho brilhe.
              </p>
            </div>
          </section>
        </Scroll3DSection>

        {/* THE FOUNDER SECTION COM SCROLL 3D */}
        <Scroll3DSection offset={["0 1", "1 1"]}>
          <section className="py-10 relative mb-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[800px] bg-gradient-to-tr from-blue-500/10 to-transparent blur-[120px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 bg-slate-900/40 p-1 border border-white/10 rounded-[2.5rem] overflow-hidden group shadow-2xl transition-transform hover:scale-[1.01] duration-500">
              <div className="bg-slate-950/80 backdrop-blur-3xl rounded-[2.4rem] p-8 md:p-16 border border-white/5 flex flex-col md:flex-row gap-12 md:gap-20 items-center">

                {/* Founder Image Wrapper */}
                <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 relative">
                  <div className="absolute z-0 inset-0 bg-blue-500/20 blur-3xl rounded-full group-hover:bg-blue-500/40 transition-colors duration-700"></div>
                  <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-2 border-white/10 group-hover:border-blue-400/50 transition-colors duration-500 shadow-[0_0_30px_rgba(96,165,250,0.1)] group-hover:shadow-[0_0_50px_rgba(96,165,250,0.3)]">
                    {/* Avatar Elegante / Foto */}
                    <Image
                      src="/Boss.jpeg"
                      alt="Fundador"
                      fill
                      sizes="(max-width: 768px) 192px, 256px"
                      className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Founder Info */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 relative z-10">
                  <span className="text-blue-400 uppercase tracking-[0.2em] text-xs font-bold mb-3 shadow-blue-500/50">Fundador & Engenheiro Principal</span>
                  <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">António Pedro</h3>

                  <p className="text-slate-400 leading-relaxed mb-10 max-w-xl text-lg font-light">
                    &quot;O design dita a primeira impressão, mas a precisão dos dados dita o sucesso escolar. Na GPE, não o obrigamos a escolher entre um ou outro. Entregamos a excelência absoluta em ambos.&quot;
                  </p>

                  {/* Social Links Protegidos (Sem Href Visível) */}
                  <div className="flex items-center gap-4">
                    <ProtectedSocialLink
                      url={links.github}
                      label="GitHub"
                      iconHoverClass="group-hover/btn:!text-white"
                      borderHoverClass="hover:!border-black"
                      bgHoverClass="hover:!bg-black"
                      icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                      }
                    />
                    <ProtectedSocialLink
                      url={links.linkedin}
                      label="LinkedIn"
                      iconHoverClass="group-hover/btn:!text-[#0a66c2]"
                      borderHoverClass="hover:!border-[#0a66c2]/50"
                      bgHoverClass="hover:!bg-[#0a66c2]/10"
                      icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                          <rect x="2" y="9" width="4" height="12"></rect>
                          <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                      }
                    />
                    <ProtectedSocialLink
                      url={links.instagram}
                      label="Instagram"
                      iconHoverClass="group-hover/btn:!text-[#E1306C]"
                      borderHoverClass="hover:!border-[#E1306C]/50"
                      bgHoverClass="hover:!bg-[#E1306C]/10"
                      icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300 group-hover/btn:![stroke:url(#ig-grad)]">
                          <defs>
                            <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#f09433" />
                              <stop offset="25%" stopColor="#e6683c" />
                              <stop offset="50%" stopColor="#dc2743" />
                              <stop offset="75%" stopColor="#cc2366" />
                              <stop offset="100%" stopColor="#bc1888" />
                            </linearGradient>
                          </defs>
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      }
                    />
                    <ProtectedSocialLink
                      url={links.email}
                      label="Email"
                      iconHoverClass="group-hover/btn:!text-[#EA4335]"
                      borderHoverClass="hover:!border-[#EA4335]/50"
                      bgHoverClass="hover:!bg-[#EA4335]/10"
                      icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300 group-hover/btn:![stroke:url(#gmail-grad)]">
                          <defs>
                            <linearGradient id="gmail-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#4285F4" />
                              <stop offset="33%" stopColor="#EA4335" />
                              <stop offset="66%" stopColor="#FBBC05" />
                              <stop offset="100%" stopColor="#34A853" />
                            </linearGradient>
                          </defs>
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Scroll3DSection>

      </main>
    </div>
  );
}
