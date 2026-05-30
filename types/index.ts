export interface User {
  id: string | number;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'leader';
  avatar_url?: string | null;
  created_at: string;
}

export interface Project {
  id: string | number;
  title: string;
  description: string;
  subject: string;
  created_at: string;
  role_in_project?: 'student' | 'teacher' | 'leader';
}

export interface Phase {
  id: string | number;
  project_id: string | number;
  title: string;
  description: string;
  status: 'open' | 'closed';
  created_at: string;
}

export interface Member {
  id: string | number;
  name: string;
  email: string;
  role_in_project: 'student' | 'teacher' | 'leader';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface CreateProjectPayload {
  title: string;
  description: string;
  subject: string;
}

export interface AddMemberPayload {
  email: string;
  name?: string;
  password?: string;
  role_in_project: string;
}

export interface UpdateMemberPayload {
  role_in_project: string;
}

export interface CreatePhasePayload {
  title: string;
  description: string;
}
