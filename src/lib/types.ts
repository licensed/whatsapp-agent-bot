export type Weekday =
  | "dom"
  | "seg"
  | "ter"
  | "qua"
  | "qui"
  | "sex"
  | "sab";

export type DayHours = {
  closed: boolean;
  open: string;
  close: string;
};

export type BusinessType =
  | "pizzaria"
  | "restaurante"
  | "clinica"
  | "salao"
  | "loja"
  | "outro";

export type Faq = {
  id: string;
  question: string;
  answer: string;
};

export type AgentConfig = {
  businessName: string;
  businessType: BusinessType;
  agentName: string;
  city: string;
  greeting: string;
  fallback: string;
  handoffMessage: string;
  extraInfo: string;
  timezone: string;
  hours: Record<Weekday, DayHours>;
  faqs: Faq[];
};

export type MessageAuthor = "customer" | "agent" | "human";

export type ChatMessage = {
  id: string;
  author: MessageAuthor;
  text: string;
  at: string;
  intent?: string;
};

export type ConversationStatus = "bot" | "human" | "closed";

export type Conversation = {
  id: string;
  contactName: string;
  phone: string;
  preview: string;
  status: ConversationStatus;
  unread: number;
  isTest: boolean;
  updatedAt: string;
  messages: ChatMessage[];
};

export type AppState = {
  onboarded: boolean;
  agent: AgentConfig;
  conversations: Conversation[];
};

export type AgentReply = {
  text: string;
  intent: string;
  handoff: boolean;
  suggestions: string[];
};
