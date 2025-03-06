
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Source[];
  isLoading?: boolean;
}

export interface Source {
  id: string;
  title: string;
  url?: string;
  content: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}
