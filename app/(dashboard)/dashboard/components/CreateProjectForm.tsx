"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FolderPlus } from 'lucide-react';
import { useCreateProject } from '@/hooks/useProjects';
import toast from 'react-hot-toast';

const schema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  subject: z.string().min(2, 'A disciplina é obrigatória'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSuccess: () => void;
}

export function CreateProjectForm({ onSuccess }: Props) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const createProject = useCreateProject();

  const onSubmit = async (data: FormData) => {
    try {
      await createProject.mutateAsync(data);
      toast.success('Projeto criado com sucesso!');
      reset();
      onSuccess();
    } catch (e) {
      toast.error('Erro ao criar projeto');
    }
  };

  return (
    <Card className="border-blue-100 shadow-blue-900/5 bg-gradient-to-b from-white/80 to-blue-50/30">
      <CardHeader className="bg-transparent border-b-blue-100/50">
        <CardTitle className="text-blue-900 flex items-center gap-2">
          <FolderPlus className="h-5 w-5 text-blue-600" />
          Criar Novo Projeto
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Título do Projeto</label>
              <Input 
                placeholder="Ex: Sistema de Gestão Escolar" 
                {...register('title')} 
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Disciplina</label>
              <Input 
                placeholder="Ex: Engenharia de Software" 
                {...register('subject')} 
                className={errors.subject ? 'border-red-500' : ''}
              />
              {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea 
              {...register('description')}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 shadow-sm rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-300 placeholder:text-gray-400"
              placeholder="Descreva os objetivos e o escopo do projeto..."
              rows={4}
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" size="lg" className="w-full md:w-auto" disabled={createProject.isPending}>
              {createProject.isPending ? 'A gravar...' : 'Gravar Projeto'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
