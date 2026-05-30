"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

export default function Termos() {
  return (
    <div className={`min-h-screen bg-[#F8FAFC] text-slate-900 ${spaceGrotesk.className} overflow-hidden relative`}>
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-slate-200/50 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-50" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-blue-100/40 rounded-full blur-[100px] -z-10 mix-blend-multiply opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
        
        {/* Coluna Esquerda: Título Fixo */}
        <div className="lg:col-span-4 flex flex-col justify-start">
          <div className="sticky top-32">
            <Link href="/" className="group inline-flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-slate-400 hover:text-slate-900 transition-colors mb-16">
              <span className="w-8 h-[1px] bg-slate-300 group-hover:bg-slate-900 transition-colors"></span>
              Voltar ao Início
            </Link>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold tracking-tighter leading-[1] mb-6"
            >
              Termos <br className="hidden lg:block"/> de Serviço
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm font-medium tracking-widest uppercase text-slate-400"
            >
              Última atualização: {new Date().toLocaleDateString('pt-PT')}
            </motion.p>
          </div>
        </div>

        {/* Coluna Direita: Conteúdo */}
        <div className="lg:col-span-7 lg:col-start-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 prose-p:text-slate-600 prose-p:leading-relaxed"
          >
            <p className="text-xl text-slate-800 font-medium mb-12">
              Bem-vindo à Gestão de Projetos Escolares (GPE). Ao aceder e utilizar a nossa plataforma, concorda em cumprir e vincular-se rigorosamente aos seguintes termos e condições, que garantem um ambiente seguro e profissional para todos os utilizadores.
            </p>

            <div className="space-y-16">
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs font-bold tracking-widest text-blue-600">01</span>
                  <h3 className="text-2xl m-0">Uso da Plataforma</h3>
                </div>
                <p>
                  A GPE é uma ferramenta de alta performance projetada para ajudar educadores e estudantes na gestão complexa de projetos escolares. Compromete-se a utilizar a plataforma exclusivamente para fins académicos e institucionais. Qualquer uso para fins ilegais, não autorizados, ou que comprometa a integridade dos nossos servidores resultará na suspensão imediata da conta.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs font-bold tracking-widest text-blue-600">02</span>
                  <h3 className="text-2xl m-0">Contas e Responsabilidade</h3>
                </div>
                <p>
                  A segurança da sua conta é primordial. É totalmente responsável por manter a confidencialidade das suas credenciais de acesso. A GPE utiliza métodos de encriptação de ponta, no entanto, não nos responsabilizamos por perdas de dados resultantes de partilha de passwords ou acesso não autorizado aos seus dispositivos físicos.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs font-bold tracking-widest text-blue-600">03</span>
                  <h3 className="text-2xl m-0">Modificações ao Serviço</h3>
                </div>
                <p>
                  A inovação é o nosso foco. Reservamo-nos o direito de modificar, atualizar ou introduzir novas funcionalidades no serviço a qualquer momento. Empregaremos esforços razoáveis para notificar os utilizadores sobre alterações significativas que afetem o seu fluxo de trabalho diário.
                </p>
              </section>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
