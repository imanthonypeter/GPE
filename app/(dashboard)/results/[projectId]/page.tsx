"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const res = await api.getProjectResults(projectId);
      setResults(res.results);
    } catch (e) {
      console.error(e);
      alert('Erro ao carregar resultados');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    const u = api.getCurrentUser();
    if (!u) {
      router.push('/');
      return;
    }
    loadData();
  }, [loadData, router]);

  if (loading) return <div>Loading...</div>;

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Resultados Finais</h1>
          <Link href={`/projects/${projectId}`}>
            <Button variant="secondary">Voltar ao Projeto</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Médias e Apuramentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 font-semibold text-gray-700">Aluno</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Fases Avaliadas</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Média Final</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {results.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                        Nenhum resultado encontrado.
                      </td>
                    </tr>
                  ) : (
                    results.map((r, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{r.user_name}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {r.evaluated_phases} / {r.total_phases}
                        </td>
                        <td className="py-3 px-4 text-gray-900 font-bold">
                          {r.final_average}%
                        </td>
                        <td className="py-3 px-4">
                          {r.eligible_for_defense ? (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                              APURADO
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                              NÃO APURADO
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
