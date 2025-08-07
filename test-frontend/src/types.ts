export interface TodoItem {
  id: string;
  todoText: string;
  isDone: boolean;
  createdAt: string;
  updatedAt: string;
  scheduledDate: string;
  scheduledTime: string;
}

export interface Owner {
  id: string;
  name: string;
  course_id: string;
  section: string;
}

export interface User {
  id: string;
  email: string;
  username?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: User
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface RegisterFormData {
  email: string;
  username: string;
  password: string;
}

export interface UpcomingTaskListProps {
  selectedDate: Date;
  tasks: TodoItem[];
  onNewTask?: (task: TodoItem) => void;
}