"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  
  // Se já estiver logado, redirecionar para o dashboard
  useEffect(() => {
    const user = api.getCurrentUser();
    if (user) {
      router.push('/dashboard');
    }
  }, [router]);

  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Registration fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await api.login({ email, password }, rememberMe);
        router.push('/dashboard');
      } else {
        if (password !== confirmPassword) {
          setError('As senhas não coincidem');
          return;
        }
        await api.register({ name, email, password, role });
        await api.login({ email, password }, rememberMe);
        router.push('/dashboard');
      }
    } catch (err: any) {
      let msg = err.message || 'Ocorreu um erro';
      try {
        const parsed = JSON.parse(msg);
        if (parsed.error) msg = parsed.error;
      } catch (e) {}
      toast.error(msg);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side: Branding & Value Prop */}
      <section className="hidden lg:flex lg:w-1/2 bg-blue-600 relative overflow-hidden flex-col justify-between p-16">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <svg fill="none" height="100%" viewBox="0 0 800 800" width="100%" xmlns="http://www.w3.org/2000/svg">
            <circle cx="400" cy="400" r="300" stroke="white" strokeDasharray="10 20" strokeWidth="2"></circle>
            <circle cx="400" cy="400" r="200" stroke="white" strokeWidth="1"></circle>
            <rect height="600" stroke="white" strokeWidth="0.5" transform="rotate(45 400 400)" width="600" x="100" y="100"></rect>
          </svg>
        </div>
        
        <div className="z-10">
          <div className="flex items-center gap-3 mb-12 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-blue-600 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_tree</span>
            </div>
            <span className="text-[36px] font-semibold text-white tracking-tight">GPE</span>
          </div>
          <div className="max-w-md">
            <h1 className="text-[36px] font-semibold text-white mb-6 leading-tight">Gestão inteligente de projetos escolares.</h1>
            <p className="text-[16px] text-white/80 leading-relaxed">
              Uma plataforma integrada para educadores e administradores coordenarem atividades acadêmicas com precisão técnica e simplicidade visual.
            </p>
          </div>
        </div>
        
        <div className="z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex gap-4 items-center mb-4">
              <span className="text-white text-[13px] font-medium">Criado por António Pedro para gerir os projetos dele na escola, para ficar mais fácil as coisas</span>
            </div>
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="bg-white h-full w-3/4"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Right Side: Login Form */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 mb-10 justify-center cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_tree</span>
            </div>
            <span className="text-[24px] font-semibold text-gray-900 dark:text-white tracking-tight">GPE</span>
          </div>
          
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-[36px] font-semibold text-gray-900 dark:text-white mb-2">{isLogin ? 'Bem-vindo de volta' : 'Criar Conta'}</h2>
            <p className="text-[14px] text-gray-600 dark:text-gray-400">
              {isLogin ? 'Faça login na sua conta para continuar' : 'Registe-se para aceder ao sistema'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-gray-900 dark:text-gray-300 block">Nome</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-600 transition-colors">person</span>
                    <input 
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-[14px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all" 
                      required 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      placeholder="O seu nome" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-gray-900 dark:text-gray-300 block">Papel</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-600 transition-colors">badge</span>
                    <select 
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-[14px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                      value={role} 
                      onChange={e => setRole(e.target.value)}
                    >
                      <option value="student">Estudante</option>
                      <option value="leader">Líder de Projeto</option>
                      <option value="teacher">Professor</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-[13px] font-medium text-gray-900 dark:text-gray-300 block" htmlFor="email">E-mail institucional</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-600 transition-colors">mail</span>
                <input 
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-[14px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all" 
                  id="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nome@instituicao.edu.ao" 
                  type="email"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[13px] font-medium text-gray-900 dark:text-gray-300 block" htmlFor="password">Senha</label>
                {isLogin && (
                  <a className="text-[12px] font-medium text-blue-600 dark:text-blue-400 hover:underline" href="#">Esqueceu a senha?</a>
                )}
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-600 transition-colors">lock</span>
                <input 
                  className="w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-[14px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all" 
                  id="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-gray-900 dark:text-gray-300 block" htmlFor="confirmPassword">Confirmar Senha</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-600 transition-colors">lock</span>
                  <input 
                    className="w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-[14px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all" 
                    id="confirmPassword" 
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••" 
                    type={showConfirmPassword ? "text" : "password"}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <span className="material-symbols-outlined text-lg">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
            )}
            

            {isLogin && (
              <div className="flex items-center">
                <input 
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600/20" 
                  id="remember" 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                />
                <label className="ml-2 text-[13px] font-medium text-gray-600 dark:text-gray-400 cursor-pointer" htmlFor="remember">Lembrar de mim</label>
              </div>
            )}
            
            <button className="w-full py-3.5 bg-blue-600 text-white text-[13px] font-medium rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm" type="submit">
              {isLogin ? 'Entrar' : 'Registar'}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
            
          </form>
          
          <div className="mt-12 text-center">
            <p className="text-[14px] text-gray-600 dark:text-gray-400">
              {isLogin ? 'Ainda não tem conta?' : 'Já tem conta?'}
              <button 
                type="button" 
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 dark:text-blue-400 text-[13px] font-medium hover:underline block mt-1 mx-auto"
              >
                {isLogin ? 'Solicite acesso à sua instituição (Registar)' : 'Faça login na sua conta'}
              </button>
            </p>
          </div>
          
          <div className="mt-16 flex justify-center gap-6 opacity-40">
            <span className="text-[12px] font-medium text-gray-900 dark:text-white">Privacidade</span>
            <span className="text-[12px] font-medium text-gray-900 dark:text-white">Termos</span>
            <span className="text-[12px] font-medium text-gray-900 dark:text-white">Suporte</span>
          </div>
        </div>
      </section>
    </div>
  );
}
