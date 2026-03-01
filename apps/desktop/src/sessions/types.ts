export type SessionItem = {
  id: string;
  workspaceId: string;
  taskId?: string;
  title: string;
  model: string;
  createdAt: string;
  updatedAt: string;
};

export type MessageItem = {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
};
