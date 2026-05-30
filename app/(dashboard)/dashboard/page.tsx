"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, X, FolderPlus, Calendar, User, LayoutDashboard, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { CreateProjectForm } from './components/CreateProjectForm';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [showNew, setShowNew] = useState(false);

  const { data: projectsData, isLoading: projectsLoading } = useProjects(user?.id);
  
  const projects = projectsData?.projects || [];
  const loading = authLoading || projectsLoading;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <LayoutDashboard className="h-8 w-8 text-blue-600" />
              Projetos
            </h1>
            <p className="text-gray-500 mt-1">Gerencie seus projetos e acompanhe o progresso.</p>
          </div>
          <div>
            <Button 
              onClick={() => setShowNew(!showNew)}
              variant={showNew ? 'secondary' : 'primary'}
              className="group shadow-sm"
            >
              {showNew ? (
                <>
                  <X className="w-5 h-5 mr-2 text-gray-500 group-hover:text-gray-700 transition-colors" />
                  Cancelar
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Novo Projeto
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Create Project Form - Animated Dropdown */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showNew ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <CreateProjectForm onSuccess={() => setShowNew(false)} />
        </div>

        {/* Projects Grid */}
        {projects.length === 0 && !showNew && (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 border-dashed shadow-sm">
            <div className="bg-blue-50 p-4 rounded-full mb-4">
              <FolderPlus className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum projeto encontrado</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Você ainda não tem projetos associados. Crie um novo projeto para começar a colaborar com sua equipe.
            </p>
            <Button onClick={() => setShowNew(true)} className="shadow-sm">
              <Plus className="w-5 h-5 mr-2" />
              Criar Meu Primeiro Projeto
            </Button>
          </div>
        )}

        {projects.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p: any) => (
              <Link href={`/projects/${p.id}`} key={p.id} className="group outline-none block">
                <Card className="h-full flex flex-col group-hover:border-blue-300/50 group-hover:shadow-[0_20px_40px_rgb(37,99,235,0.08)] group-hover:-translate-y-1 transition-all duration-500 cursor-pointer group-focus-visible:ring-2 group-focus-visible:ring-blue-500 group-focus-visible:ring-offset-2">
                  <CardHeader className="bg-gradient-to-br from-gray-50/50 to-white group-hover:from-blue-50/30 group-hover:to-white transition-colors duration-500 border-b-gray-100/50 pb-5">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="group-hover:text-blue-700 transition-colors duration-300 line-clamp-2 leading-tight">
                        {p.title}
                      </CardTitle>
                      <div className="bg-white p-1.5 rounded-full shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-blue-600">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500 mt-2 flex items-center gap-1.5">
                      <span className="block w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      {p.subject}
                    </p>
                  </CardHeader>
                  <CardContent className="flex-1 pt-5">
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {p.description || 'Nenhuma descrição fornecida para este projeto.'}
                    </p>
                  </CardContent>
                  <div className="px-6 py-4 mt-auto border-t border-gray-100/50 bg-gray-50/30 flex justify-between items-center group-hover:bg-blue-50/10 transition-colors duration-500">
                    <div className="flex items-center gap-1.5 text-xs font-medium bg-white border border-gray-200 shadow-sm px-2.5 py-1.5 rounded-md text-gray-700">
                      <User className="w-3.5 h-3.5 text-blue-500" />
                      {p.role_in_project === 'leader' ? 'Líder' : p.role_in_project === 'teacher' ? 'Professor' : 'Membro'}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(p.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

