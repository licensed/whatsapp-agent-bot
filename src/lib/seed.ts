import type { AppState, ChatMessage, Conversation } from "./types";
import { createDefaultAgent } from "./templates";

const BASE_MS = Date.parse("2026-09-11T21:00:00.000Z");

function atMinutesBefore(mins: number): string {
  return new Date(BASE_MS - mins * 60_000).toISOString();
}

function msg(
  id: string,
  author: ChatMessage["author"],
  text: string,
  minsAgo: number,
  intent?: string,
): ChatMessage {
  return {
    id,
    author,
    text,
    at: atMinutesBefore(minsAgo),
    intent,
  };
}

function seedConversation(
  id: string,
  contactName: string,
  phone: string,
  minsAgo: number,
  lines: {
    author: ChatMessage["author"];
    text: string;
    intent?: string;
    at: number;
  }[],
  status: Conversation["status"] = "bot",
  unread = 0,
): Conversation {
  const messages = lines.map((line, index) =>
    msg(`${id}-m${index}`, line.author, line.text, line.at, line.intent),
  );
  const last = messages[messages.length - 1];
  return {
    id,
    contactName,
    phone,
    preview: last?.text ?? "",
    status,
    unread,
    isTest: false,
    updatedAt: atMinutesBefore(minsAgo),
    messages,
  };
}

export function createTestConversation(): Conversation {
  return {
    id: "test-you",
    contactName: "Você (teste)",
    phone: "Simulador",
    preview: "Mande uma mensagem para treinar o agente.",
    status: "bot",
    unread: 0,
    isTest: true,
    updatedAt: "2026-01-01T12:00:00.000Z",
    messages: [],
  };
}

export function createInitialState(): AppState {
  const agent = createDefaultAgent("pizzaria");
  const greeting =
    "Bom dia! Sou a Luna, da Pizzaria Nonna. Posso ajudar com cardápio, pedidos e tempo de entrega.";

  const test: Conversation = {
    ...createTestConversation(),
    preview: greeting,
    updatedAt: atMinutesBefore(2),
    messages: [
      msg("test-m0", "customer", "Oi, vocês estão abertos?", 2),
      msg("test-m1", "agent", greeting, 2, "greeting"),
    ],
  };

  return {
    onboarded: false,
    agent,
    conversations: [
      test,
      seedConversation(
        "conv-maria",
        "Maria Santos",
        "+55 11 98888-1200",
        18,
        [
          {
            author: "customer",
            text: "Boa noite! Qual o cardápio de vocês?",
            at: 22,
          },
          {
            author: "agent",
            text: "As mais pedidas: Margherita (R$ 49), Calabresa (R$ 54), Quatro queijos (R$ 59) e Pepperoni (R$ 62). Broto sai R$ 10 a menos.",
            intent: "faq",
            at: 21,
          },
          {
            author: "customer",
            text: "Vocês entregam na Vila Madalena?",
            at: 18,
          },
          {
            author: "agent",
            text: "Sim, entregamos num raio de 5 km. O prazo médio é de 40 a 55 minutos, dependendo do movimento.",
            intent: "faq",
            at: 18,
          },
        ],
        "bot",
        1,
      ),
      seedConversation(
        "conv-carlos",
        "Carlos Mendes",
        "+55 11 97777-3344",
        55,
        [
          { author: "customer", text: "Aceita Pix?", at: 58 },
          {
            author: "agent",
            text: "Aceitamos Pix, dinheiro e cartão na entrega. No Pix o desconto é de R$ 5 na pizza grande.",
            intent: "faq",
            at: 57,
          },
          { author: "customer", text: "Perfeito, valeu!", at: 55 },
          {
            author: "agent",
            text: "Que bom! Se precisar de mais alguma coisa, é só chamar. Abraço da Luna 🌿",
            intent: "thanks",
            at: 55,
          },
        ],
        "closed",
      ),
      seedConversation(
        "conv-ana",
        "Ana Oliveira",
        "+55 11 96666-0099",
        8,
        [
          {
            author: "customer",
            text: "Quero cancelar um pedido que já saiu",
            at: 10,
          },
          {
            author: "agent",
            text: "Hmm, essa eu não tenho cadastrada. Se quiser, posso chamar alguém da equipe para te atender.",
            intent: "unknown",
            at: 9,
          },
          {
            author: "customer",
            text: "Pode chamar um atendente, por favor",
            at: 8,
          },
          {
            author: "agent",
            text: "Sem problema. Vou chamar alguém da equipe para continuar essa conversa com você, tá bem?",
            intent: "human",
            at: 8,
          },
        ],
        "human",
        2,
      ),
    ],
  };
}
