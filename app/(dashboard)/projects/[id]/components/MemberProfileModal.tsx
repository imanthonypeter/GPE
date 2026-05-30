"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUpdateMember } from '@/hooks/useProjects';
import toast from 'react-hot-toast';
import { Member } from '@/types';

interface Props {
  projectId: string | number;
  member: Member;
  isLeader: boolean;
  canManage: boolean;
  onClose: () => void;
}

export function MemberProfileModal({ projectId, member, isLeader, canManage, onClose }: Props) {
  const updateMember = useUpdateMember(projectId);

  const getInitialGender = (role: string): 'M' | 'F' => {
    if (!role) return 'M';
    if (role.startsWith('Programadora') || role.startsWith('Administradora') || role.includes('Programadora') || role.includes('Administradora')) return 'F';
    return 'M';
  };

  const getBaseRole = (role: string): string => {
    if (!role) return 'Membro';
    if (role.includes('Frontend')) return 'Frontend';
    if (role.includes('Backend')) return 'Backend';
    if (role.includes('Fullstack')) return 'Fullstack';
    if (role.includes('Banco de Dados') || role.includes('BD')) return 'Banco de Dados';
    if (role.includes('Designer')) return 'Designer';
    return 'Membro';
  };

  const buildRole = (base: string, gender: 'M' | 'F', isLeader: boolean): string => {
    let finalBase = base;
    if (base === 'Frontend' || base === 'Backend' || base === 'Fullstack') {
      finalBase = gender === 'M' ? `Programador ${base}` : `Programadora ${base}`;
    } else if (base === 'Banco de Dados') {
      finalBase = gender === 'M' ? `Administrador de Banco de Dados` : `Administradora de Banco de Dados`;
    }

    if (isLeader) {
      if (base === 'Membro' || base === 'leader' || base === 'Líder') return 'Líder';
      return `Líder & ${finalBase}`;
    }
    return finalBase;
  };

  const initialBaseRole = getBaseRole(member.role_in_project || '');
  const [baseRole, setBaseRole] = useState<string>(initialBaseRole);
  const [gender, setGender] = useState<'M' | 'F'>(getInitialGender(member.role_in_project || ''));

  const handleSave = async () => {
    const newRole = buildRole(baseRole, gender, isLeader);
    if (newRole === member.role_in_project) {
      onClose();
      return;
    }

    try {
      await updateMember.mutateAsync({ 
        memberId: member.id, 
        data: { role_in_project: newRole } 
      });
      toast.success('Perfil atualizado com sucesso!');
      onClose();
    } catch (e: any) {
      toast.error('Erro ao atualizar perfil.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" data-lenis-prevent="true">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-md transition-opacity animate-fade-in" onClick={onClose}></div>
        <div className="relative w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60 transform transition-all animate-modal-enter">
          <div className="px-8 pt-8 pb-4">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Perfil do Membro</h3>
            <p className="text-sm text-gray-500 mt-1">Dados pessoais apenas podem ser alterados pelo próprio utilizador na sua conta.</p>
          </div>
          <div className="px-8 pb-8 space-y-6">
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Nome</label>
                <Input 
                  value={member.name || 'Sem nome'}
                  disabled
                  className="bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <Input 
                  value={member.email || ''}
                  disabled
                  className="bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Função no Projeto</label>
                <select 
                  value={baseRole}
                  onChange={(e) => setBaseRole(e.target.value)}
                  disabled={!canManage}
                  className="w-full h-10 px-3 py-2 rounded-md border border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <option value="Membro">Membro</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Fullstack">Fullstack</option>
                  <option value="Banco de Dados">Banco de Dados</option>
                  <option value="Designer">Designer</option>
                </select>
                {isLeader && <p className="text-xs text-blue-600 font-medium pt-1">O prefixo "Líder &" será adicionado automaticamente à função escolhida.</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Género da Função</label>
                <div className="flex bg-gray-100 rounded-lg p-1 h-10 w-full">
                  <button 
                    type="button"
                    disabled={!canManage}
                    onClick={() => setGender('M')} 
                    className={`flex-1 text-sm font-medium rounded-md transition-all ${gender === 'M' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'} ${!canManage ? 'cursor-not-allowed opacity-70' : ''}`}
                  >
                    Masculino (M)
                  </button>
                  <button 
                    type="button"
                    disabled={!canManage}
                    onClick={() => setGender('F')} 
                    className={`flex-1 text-sm font-medium rounded-md transition-all ${gender === 'F' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-500 hover:text-gray-700'} ${!canManage ? 'cursor-not-allowed opacity-70' : ''}`}
                  >
                    Feminino (F)
                  </button>
                </div>
                {canManage ? (
                  <p className="text-xs text-gray-400 pt-1">O género ajusta automaticamente o título da função (ex: Programador/Programadora).</p>
                ) : (
                  <p className="text-xs text-gray-400 pt-1">Apenas os líderes do projeto podem alterar o perfil da função.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-gray-100/50" disabled={updateMember.isPending}>Fechar</Button>
              {canManage && (
                <Button type="button" onClick={handleSave} variant="primary" className="shadow-lg shadow-blue-500/20" disabled={updateMember.isPending}>
                  {updateMember.isPending ? 'A guardar...' : 'Guardar'}
                </Button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
