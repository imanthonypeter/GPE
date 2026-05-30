"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft } from 'lucide-react';

export default function PhaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  const [showEvalForm, setShowEvalForm] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [score, setScore] = useState('');
  const [justification, setJustification] = useState('');
  const [workDone, setWorkDone] = useState('');

  // Let's assume we can also fetch project members here to populate the select dropdown for user_id
  const [members, setMembers] = useState<any[]>([]);
  const [phaseStatus, setPhaseStatus] = useState<string>('open');
  const [projectId, setProjectId] = useState<string | number>('');

  useEffect(() => {
    const u = api.getCurrentUser();
    if (!u) {
      router.push('/');
      return;
    }
    setUser(u);
    loadData();
  }, [id, router]);

  const loadData = async () => {
    try {
      const evals = await api.getEvaluationsByPhase(id);
      setEvaluations(evals.evaluations || []);
      setMembers(evals.members || []);
      if (evals.phase_status) setPhaseStatus(evals.phase_status);
      if (evals.project_id) setProjectId(evals.project_id);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao carregar avaliações');
    }
  };

  const getBadgeStyles = (score: number | string) => {
    const num = Number(score);
    if (num === 100) return "from-green-50 to-green-100 text-green-800 border-green-200/50";
    if (num >= 50) return "from-blue-50 to-blue-100 text-blue-800 border-blue-200/50";
    if (num > 20) return "from-orange-50 to-orange-100 text-orange-800 border-orange-200/50";
    return "from-red-50 to-red-100 text-red-800 border-red-200/50";
  };

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addEvaluation({
        phase_id: id,
        user_email: selectedUserEmail,
        participation_score: parseFloat(score),
        justification_text: justification,
        work_done: workDone
      });
      setShowEvalForm(false);
      setSelectedUserEmail('');
      setSearchQuery('');
      setShowDropdown(false);
      setScore('');
      setJustification('');
      setWorkDone('');
      loadData();
      toast.success('Avaliação submetida com sucesso!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao submeter avaliação');
    }
  };

  const handleEditClick = (ev: any) => {
    if (user?.role !== 'teacher' && ev.edit_count >= 3) return;
    
    setSelectedUserEmail(ev.user_email);
    setSearchQuery(`${ev.user_name} (${ev.user_email})`);
    setScore(ev.participation_score.toString());
    setJustification(ev.justification_text || '');
    setWorkDone(ev.work_done || '');
    setShowEvalForm(true);
  };

  const handleClosePhase = async () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-slate-800">
          Tem a certeza que deseja encerrar esta fase? Não poderá adicionar mais avaliações.
        </p>
        <div className="flex justify-end gap-2 mt-2">
          <Button size="sm" variant="ghost" onClick={() => toast.dismiss(t.id)}>
            Cancelar
          </Button>
          <Button 
            size="sm" 
            variant="primary" 
            className="bg-red-600 hover:bg-red-700 text-white shadow-none" 
            onClick={async () => {
              toast.dismiss(t.id);
              const toastId = toast.loading('A encerrar fase...');
              try {
                await api.updatePhaseStatus(id, 'closed');
                setPhaseStatus('closed');
                toast.success('Fase finalizada com sucesso!', { id: toastId });
              } catch (err: any) {
                toast.error('Erro ao finalizar a fase.', { id: toastId });
              }
            }}
          >
            Confirmar
          </Button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  return (
    <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        
        {projectId && (
          <Link href={`/projects/${projectId}`} className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Voltar ao Projeto
          </Link>
        )}

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Avaliações da Fase</h1>
            <p className="text-gray-500 mt-1">Veja e adicione as avaliações dos membros nesta fase.</p>
          </div>
          {(user?.role === 'leader' || user?.role === 'teacher') && phaseStatus === 'open' && (
            <div className="flex items-center gap-3">
              <Button onClick={() => setShowEvalForm(true)} variant="primary">
                Avaliar Membro
              </Button>
              <Button 
                onClick={handleClosePhase} 
                variant="secondary" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Encerrar Fase
              </Button>
            </div>
          )}
          {phaseStatus === 'closed' && (
            <span className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg border border-slate-200 shadow-sm">
              Fase Finalizada
            </span>
          )}
        </div>

        {/* Modal - Avaliar Membro */}
        {showEvalForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-md transition-opacity animate-fade-in" onClick={() => setShowEvalForm(false)}></div>
            <div className="relative w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60 overflow-hidden transform transition-all animate-modal-enter">
              <div className="px-8 pt-8 pb-6">
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Nova Avaliação</h3>
                <p className="text-sm text-gray-500 mt-1">Avalie o desempenho do membro.</p>
              </div>
              <div className="px-8 pb-8">
                <form onSubmit={handleEvaluate} className="space-y-5">
                  <div className="space-y-2 relative">
                    <label className="text-sm font-semibold text-gray-700">Membro a Avaliar (Pesquise por Nome ou Email)</label>
                    <Input 
                      required={!selectedUserEmail}
                      value={searchQuery} 
                      onChange={e => {
                        setSearchQuery(e.target.value);
                        setSelectedUserEmail(''); // reset selection if typing
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                      type="text" 
                      placeholder="Comece a escrever para pesquisar..." 
                      className="bg-white/50 shadow-inner" 
                    />
                    {showDropdown && members.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {members
                          .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.email.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map(m => (
                            <div
                              key={m.user_id}
                              className="px-4 py-3 cursor-pointer hover:bg-blue-50/80 border-b border-gray-50 last:border-0 flex flex-col transition-colors"
                              onMouseDown={(e) => e.preventDefault()} // prevent blur before click
                              onClick={() => {
                                setSelectedUserEmail(m.email);
                                setSearchQuery(`${m.name} (${m.email})`);
                                setShowDropdown(false);
                              }}
                            >
                              <span className="font-semibold text-gray-900 text-sm">{m.name}</span>
                              <span className="text-xs text-gray-500 mt-0.5">{m.email}</span>
                            </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Trabalhos Feitos</label>
                    <textarea 
                      className="w-full px-4 py-3 bg-white/50 shadow-inner border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 placeholder:text-gray-400"
                      rows={3}
                      placeholder="Detalhe o que foi feito pelo membro na fase..."
                      required
                      value={workDone} 
                      onChange={e => setWorkDone(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Justificação (opcional)</label>
                    <textarea 
                      className="w-full px-4 py-3 bg-white/50 shadow-inner border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 placeholder:text-gray-400"
                      rows={2}
                      placeholder="Comentários adicionais..."
                      value={justification} 
                      onChange={e => setJustification(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Nota (0 a 100%)</label>
                    <Input required type="number" min="0" max="100" step="0.1" value={score} onChange={e => setScore(e.target.value)} className="bg-white/50 shadow-inner" />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="ghost" onClick={() => setShowEvalForm(false)}>Cancelar</Button>
                    <Button type="submit" variant="primary" className="shadow-lg shadow-blue-500/20">Gravar Avaliação</Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-xl">
          <CardHeader className="border-b border-gray-100/50 pb-6 pt-6">
            <CardTitle>Registos de Avaliação</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {evaluations.length === 0 ? (
              <p className="text-gray-500 text-center py-8 bg-white/40 rounded-xl border border-dashed border-gray-200">Sem avaliações submetidas.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {evaluations.map(ev => (
                  <li key={ev.id} className="py-5 hover:bg-gray-50/50 transition-colors px-4 -mx-4 rounded-xl">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-4">
                        <h4 className="font-semibold text-gray-900 text-lg">{ev.user_name}</h4>
                        <div className="mt-2 space-y-2">
                          <div>
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Trabalhos Feitos</span>
                            <p className="text-sm text-gray-700 mt-0.5">{ev.work_done || 'Não especificado'}</p>
                          </div>
                          {ev.justification_text && (
                            <div>
                              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Justificação</span>
                              <p className="text-sm text-gray-500 mt-0.5">{ev.justification_text}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`inline-block px-4 py-1.5 bg-gradient-to-r font-bold rounded-full text-base shadow-sm border ${getBadgeStyles(ev.participation_score)}`}>
                          {ev.participation_score}%
                        </span>
                        <p className="text-xs text-gray-400 mt-2 font-medium">Avaliado por <br/><span className="text-gray-600">{ev.evaluator_name}</span></p>
                      </div>
                    </div>
                    {phaseStatus === 'open' && (user?.role === 'leader' || user?.role === 'teacher') && (
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-3">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditClick(ev)}
                          disabled={user?.role !== 'teacher' && ev.edit_count >= 3}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          Editar Avaliação
                        </Button>
                        {user?.role !== 'teacher' && (
                          <span className={`text-xs font-semibold px-2 py-1 rounded-md ${ev.edit_count >= 3 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                            Edições: {ev.edit_count || 0}/3
                          </span>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
