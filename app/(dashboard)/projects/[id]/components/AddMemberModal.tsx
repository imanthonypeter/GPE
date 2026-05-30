"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAddMember } from '@/hooks/useProjects';
import toast from 'react-hot-toast';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Email inválido.'),
  name: z.string().optional(),
  password: z.string().optional(),
  role_in_project: z.string().min(1, 'Selecione uma função.'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  projectId: string | number;
  onClose: () => void;
}

export function AddMemberModal({ projectId, onClose }: Props) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role_in_project: "Membro" }
  });

  const addMember = useAddMember(projectId);

  const selectedRole = watch('role_in_project');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const [gender, setGender] = useState<'M' | 'F'>('M');

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsSelectOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles = gender === 'M' ? [
    "Membro",
    "Programador Frontend",
    "Programador Backend",
    "Programador Fullstack",
    "Administrador de Banco de Dados",
    "Designer"
  ] : [
    "Membro",
    "Programadora Frontend",
    "Programadora Backend",
    "Programadora Fullstack",
    "Administradora de Banco de Dados",
    "Designer"
  ];

  const handleGenderChange = (newGender: 'M' | 'F') => {
    setGender(newGender);
    setValue('role_in_project', ''); // reset role when gender changes
  };

  const onSubmit = async (data: FormData) => {
    try {
      await addMember.mutateAsync({ 
        email: data.email, 
        name: data.name,
        password: data.password,
        role_in_project: data.role_in_project 
      });
      toast.success('Membro adicionado com sucesso!');
      onClose();
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Erro ao adicionar membro. Verifique os dados.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" data-lenis-prevent="true">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-md transition-opacity animate-fade-in" onClick={onClose}></div>
        <div className="relative w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60 transform transition-all animate-modal-enter">
        <div className="px-8 pt-8 pb-4">
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Adicionar Membro</h3>
          <p className="text-sm text-gray-500 mt-1">Convide alguém por email, defina a sua função e adicione nome/senha caso seja uma conta nova.</p>
        </div>
        <div className="px-8 pb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email do Utilizador *</label>
              <Input 
                autoFocus
                type="email"
                placeholder="exemplo@email.com" 
                {...register('email')}
                className={`bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 shadow-inner ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Nome (Nova Conta)</label>
                <Input 
                  type="text"
                  placeholder="Nome do Utilizador" 
                  {...register('name')}
                  className="bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 shadow-inner"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Senha Inicial</label>
                <Input 
                  type="text"
                  placeholder="Deixe vazio p/ padrão" 
                  {...register('password')}
                  className="bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4" ref={selectRef}>
              <div className="space-y-2 relative">
                <label className="text-sm font-semibold text-gray-700">Género</label>
                <div className="flex bg-gray-100 rounded-lg p-1 h-10 w-full">
                  <button 
                    type="button"
                    onClick={() => handleGenderChange('M')} 
                    className={`flex-1 text-xs font-medium rounded-md transition-all ${gender === 'M' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Masculino (M)
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleGenderChange('F')} 
                    className={`flex-1 text-xs font-medium rounded-md transition-all ${gender === 'F' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Feminino (F)
                  </button>
                </div>
              </div>

              <div className="space-y-2 relative">
                <label className="text-sm font-semibold text-gray-700">Função no Projeto *</label>
                
                <div 
                  onClick={() => setIsSelectOpen(!isSelectOpen)}
                  className={`flex items-center justify-between w-full h-10 px-3 py-2 text-sm rounded-md bg-white/50 border cursor-pointer hover:bg-white/80 transition-all ${errors.role_in_project ? 'border-red-500' : 'border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-inner'}`}
                >
                <span className="text-gray-900 font-medium">{selectedRole || 'Selecione uma função'}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isSelectOpen ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {isSelectOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-50 w-full mt-1 bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] overflow-hidden"
                  >
                    <div className="p-1 max-h-60 overflow-y-auto" data-lenis-prevent="true" onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}>
                      {roles.map(role => (
                        <div
                          key={role}
                          onClick={() => {
                            setValue('role_in_project', role, { shouldValidate: true });
                            setIsSelectOpen(false);
                          }}
                          className={`flex items-center justify-between px-3 py-2.5 text-sm cursor-pointer rounded-lg transition-colors ${selectedRole === role ? 'bg-blue-50/80 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100/50 hover:text-gray-900'}`}
                        >
                          {role}
                          {selectedRole === role && <Check className="w-4 h-4 text-blue-600" />}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {errors.role_in_project && <p className="text-xs text-red-500">{errors.role_in_project.message}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-gray-100/50" disabled={addMember.isPending}>Cancelar</Button>
              <Button type="submit" variant="primary" className="shadow-lg shadow-blue-500/20" disabled={addMember.isPending}>
                {addMember.isPending ? 'A adicionar...' : 'Adicionar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}
