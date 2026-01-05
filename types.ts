export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export enum Subject {
  GENERAL = 'Umum',
  MATH = 'Matematika',
  PHYSICS = 'Fisika',
  CHEMISTRY = 'Kimia',
  BIOLOGY = 'Biologi',
  HISTORY = 'Sejarah',
  LITERATURE = 'Bahasa & Sastra',
  CODING = 'Coding / TI'
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  image?: string; // Base64 string
  timestamp: number;
  subject?: Subject;
  isError?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}