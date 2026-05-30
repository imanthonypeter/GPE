const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

import { LoginPayload, CreateProjectPayload, AddMemberPayload, UpdateMemberPayload, CreatePhasePayload, AuthResponse, Project, Phase, Member, User } from '@/types';
if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL em falta nas variáveis de ambiente");

const getAuthHeaders = () => {
  const token = localStorage.getItem('gpe_token') || sessionStorage.getItem('gpe_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  register: async (data: LoginPayload): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  login: async (data: LoginPayload, rememberMe: boolean = true, isStudentLogin: boolean = false): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/${isStudentLogin ? 'student-login' : 'login'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    const result = await res.json();
    if (rememberMe) {
      localStorage.setItem('gpe_token', result.token);
      localStorage.setItem('gpe_user', JSON.stringify(result.user));
    } else {
      sessionStorage.setItem('gpe_token', result.token);
      sessionStorage.setItem('gpe_user', JSON.stringify(result.user));
    }
    return result;
  },
  logout: () => {
    localStorage.removeItem('gpe_token');
    localStorage.removeItem('gpe_user');
    sessionStorage.removeItem('gpe_token');
    sessionStorage.removeItem('gpe_user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('gpe_user') || sessionStorage.getItem('gpe_user');
    return user ? JSON.parse(user) : null;
  },
  updateProfile: async (data: { name: string; password?: string; }): Promise<{ user: User }> => {
    const res = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    const result = await res.json();
    if (result.user) {
      if (localStorage.getItem('gpe_user')) {
        localStorage.setItem('gpe_user', JSON.stringify(result.user));
      } else {
        sessionStorage.setItem('gpe_user', JSON.stringify(result.user));
      }
    }
    return result;
  },
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    // We don't want to set Content-Type to application/json here
    // fetch will automatically set it to multipart/form-data with the correct boundary
    const headers: any = getAuthHeaders();
    delete headers['Content-Type'];

    const res = await fetch(`${API_URL}/users/profile/avatar`, {
      method: 'POST',
      headers: headers,
      body: formData
    });
    if (!res.ok) throw new Error(await res.text());
    const result = await res.json();
    if (result.user) {
      if (localStorage.getItem('gpe_user')) {
        localStorage.setItem('gpe_user', JSON.stringify(result.user));
      } else {
        sessionStorage.setItem('gpe_user', JSON.stringify(result.user));
      }
    }
    return result;
  },

  // Projects
  createProject: async (data: CreateProjectPayload): Promise<{ project: Project }> => {
    const res = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  getProject: async (id: string | number) => {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  getUserProjects: async (userId: string | number) => {
    const res = await fetch(`${API_URL}/projects/user/${userId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  finishProject: async (projectId: string | number) => {
    const res = await fetch(`${API_URL}/projects/${projectId}/finish`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  addProjectMember: async (projectId: string | number, data: AddMemberPayload): Promise<{ member: Member }> => {
    const res = await fetch(`${API_URL}/projects/${projectId}/members`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  updateProjectMember: async (projectId: string | number, memberId: string | number, data: UpdateMemberPayload): Promise<{ member: Member }> => {
    const res = await fetch(`${API_URL}/projects/${projectId}/members/${memberId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  removeProjectMember: async (projectId: string | number, memberId: string | number) => {
    const res = await fetch(`${API_URL}/projects/${projectId}/members/${memberId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Phases
  createPhase: async (data: CreatePhasePayload & { project_id: string | number }): Promise<{ phase: Phase }> => {
    const res = await fetch(`${API_URL}/phases`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  getPhasesByProject: async (projectId: string | number) => {
    const res = await fetch(`${API_URL}/phases/project/${projectId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  updatePhaseStatus: async (id: string | number, status: string) => {
    const res = await fetch(`${API_URL}/phases/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Evaluations
  addEvaluation: async (data: any) => {
    const res = await fetch(`${API_URL}/evaluations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  submitEvaluation: async (data: { phase_id: string | number; evaluated_user_id: string | number; criteria_scores: Record<string, number>; notes?: string; }): Promise<{ evaluation: unknown }> => {
    const res = await fetch(`${API_URL}/results/evaluations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  getEvaluationsByPhase: async (phaseId: string | number) => {
    const res = await fetch(`${API_URL}/evaluations/phase/${phaseId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Results
  getProjectResults: async (projectId: string | number) => {
    const res = await fetch(`${API_URL}/results/project/${projectId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // PDF Download (returns a blob)
  downloadProjectPDF: async (projectId: string | number) => {
    const res = await fetch(`${API_URL}/projects/${projectId}/export/pdf`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.blob();
  }
};
