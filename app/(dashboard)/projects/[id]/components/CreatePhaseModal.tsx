"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCreatePhase } from '@/hooks/usePhases';
import toast from 'react-hot-toast';

const schema = z.object({
  title: z.string().min(3, 'O título da fase é obrigatório e deve ter no mínimo 3 caracteres.'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  projectId: string | number;
  onClose: () => void;
}

export function CreatePhaseModal({ projectId, onClose }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const createPhase = useCreatePhase(projectId);

  const onSubmit = async (data: FormData) => {
    try {
      await createPhase.mutateAsync(data);
      toast.success('Fase criada com sucesso!');
      onClose();
    } catch (e) {
      toast.error('Erro ao criar fase');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" data-lenis-prevent="true">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-md transition-opacity animate-fade-in" onClick={onClose}></div>
        <div className="relative w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60 transform transition-all animate-modal-enter">
          <div className="px-8 pt-8 pb-6">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Nova Fase</h3>
            <p className="text-sm text-gray-500 mt-1">Defina uma nova etapa para este projeto.</p>
          </div>
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Título da Fase</label>
                <Input 
                  autoFocus
                  placeholder="Ex: Entrega do Relatório" 
                  {...register('title')}
                  className={`bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 shadow-inner ${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-gray-100/50" disabled={createPhase.isPending}>Cancelar</Button>
                <Button type="submit" variant="primary" className="shadow-lg shadow-blue-500/20" disabled={createPhase.isPending}>
                  {createPhase.isPending ? 'A criar...' : 'Criar Fase'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
