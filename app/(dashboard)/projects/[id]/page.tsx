"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePhases } from '@/hooks/usePhases';
import { useProject, useFinishProject, useRemoveMember, useUpdateMember } from '@/hooks/useProjects';
import { Phase, Member } from '@/types';
import { CreatePhaseModal } from './components/CreatePhaseModal';
import { AddMemberModal } from './components/AddMemberModal';
import { MemberProfileModal } from './components/MemberProfileModal';

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { user, isLoading: authLoading } = useAuth();
  const { data: pData, isLoading: projectLoading } = useProject(id);
  const { data: phData, isLoading: phasesLoading } = usePhases(id);

  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [profileMember, setProfileMember] = useState<Member | null>(null);

  const finishProject = useFinishProject();
  const removeMember = useRemoveMember(id);

  const loading = authLoading || projectLoading || phasesLoading;
  
  if (loading || !pData?.project) return <div className="flex items-center justify-center min-h-screen text-gray-500">A carregar...</div>;

  const project = pData.project;
  const members = pData.members || [];
  const phases = phData?.phases || [];

  const canManage = project.leader_id === user?.id || user?.role === 'teacher';
  const isFinished = project.status === 'finished';

  const handleFinishProject = async () => {
    if (window.confirm('Tem a certeza que deseja finalizar este projeto? Ele ficará fechado para novas alterações.')) {
      const toastId = toast.loading('A finalizar projeto...');
      try {
        await finishProject.mutateAsync(id);
        toast.success('Projeto finalizado com sucesso!', { id: toastId });
      } catch (e: unknown) {
        toast.error('Erro ao finalizar o projeto.', { id: toastId });
      }
    }
  };

  const handleRemoveMember = async (memberId: string | number) => {
    if (window.confirm('Tem a certeza que deseja remover este membro?')) {
      const toastId = toast.loading('A remover...');
      try {
        await removeMember.mutateAsync(memberId);
        toast.success('Membro removido.', { id: toastId });
      } catch (e: unknown) {
        toast.error('Erro ao remover.', { id: toastId });
      }
    }
  };


  const handleExportPDF = async () => {
    const toastId = toast.loading('Gerando PDF...');
    try {
      const blob = await api.downloadProjectPDF(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeTitle = project.title.replace(/[^a-zA-Z0-9]/g, '_');
      a.download = `${safeTitle}_Relatorio.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success('PDF exportado com sucesso!', { id: toastId });
    } catch (e: unknown) {
      toast.error('Erro ao exportar PDF', { id: toastId });
    }
  };

  return (
    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 relative">
      <div className="space-y-8">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-6 group outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Voltar ao Dashboard
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{project.title}</h1>
              <p className="text-gray-500 mt-1 text-lg">{project.subject}</p>
            </div>
            <div className="flex items-center gap-3">
              {canManage && !isFinished && (
                <Button onClick={handleFinishProject} variant="primary" className="shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Finalizar Projeto
                </Button>
              )}
              <Link href={`/results/${id}`}>
                <Button variant="secondary" className="shadow-sm">Ver Resultados</Button>
              </Link>
              <Button onClick={handleExportPDF} variant="primary" className="shadow-sm">Exportar PDF</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Fases do Projeto</CardTitle>
                {canManage && !isFinished && <Button size="sm" onClick={() => setIsPhaseModalOpen(true)}>Nova Fase</Button>}
              </CardHeader>
              <CardContent>
                {phases.length === 0 ? (
                  <p className="text-gray-500 py-4">Nenhuma fase criada.</p>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {phases.map((ph: Phase) => (
                      <li key={ph.id} className="py-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-900">{ph.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${ph.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                            {ph.status === 'open' ? 'Aberto' : ph.status === 'closed' ? 'Finalizado' : ph.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/phases/${ph.id}`}>
                            <Button variant="ghost" size="sm">Ver Avaliações</Button>
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Membros</CardTitle>
                {canManage && !isFinished && <Button size="sm" variant="secondary" onClick={() => setIsMemberModalOpen(true)}>Adicionar</Button>}
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-gray-100">
                  {members.map((m: Member & { user_id?: string | number }) => (
                    <li key={m.id} className="py-3">
                      <button 
                        onClick={() => setProfileMember(m)}
                        className="font-medium text-sm text-gray-900 hover:text-blue-600 hover:underline transition-colors text-left"
                      >
                        {m.name || 'Sem nome'}
                      </button>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-500 truncate mr-2" title={m.email}>{m.email}</p>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] sm:text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                            {m.role_in_project}
                          </span>
                          {canManage && !isFinished && (
                            <div className="flex items-center">
                              <button onClick={() => setProfileMember(m)} className="text-gray-400 hover:text-blue-600 p-1" title="Editar Perfil da Função">
                                <Edit2 className="w-3 h-3" />
                              </button>
                              {m.user_id !== project.leader_id && (
                                <button onClick={() => handleRemoveMember(m.id)} className="text-gray-400 hover:text-red-600 p-1" title="Remover Membro">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {isPhaseModalOpen && (
        <CreatePhaseModal projectId={id} onClose={() => setIsPhaseModalOpen(false)} />
      )}

      {isMemberModalOpen && (
        <AddMemberModal projectId={id} onClose={() => setIsMemberModalOpen(false)} />
      )}

      {profileMember && (
        <MemberProfileModal 
          projectId={id} 
          member={profileMember} 
          isLeader={project.leader_id === profileMember.user_id}
          canManage={canManage && !isFinished} 
          onClose={() => setProfileMember(null)} 
        />
      )}
    </main>
  );
}

