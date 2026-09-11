"use client";

import { useSyncExternalStore } from "react";
import { newId, nowIso, replyAsAgent } from "@/lib/agent";
import { createInitialState, createTestConversation } from "@/lib/seed";
import type {
  AgentConfig,
  AppState,
  ChatMessage,
  Conversation,
  ConversationStatus,
} from "@/lib/types";

const STORAGE_KEY = "atendezap-state-v2";
const SEED_STATE: AppState = createInitialState();

let current: AppState = SEED_STATE;
let loadedFromStorage = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function sortConversations(list: Conversation[]): Conversation[] {
  return [...list].sort((a, b) => {
    if (a.isTest && !b.isTest) return -1;
    if (!a.isTest && b.isTest) return 1;
    return +new Date(b.updatedAt) - +new Date(a.updatedAt);
  });
}

function readStorage(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AppState;
    if (
      parsed?.agent &&
      Array.isArray(parsed.conversations) &&
      parsed.conversations.length > 0
    ) {
      return {
        onboarded: Boolean(parsed.onboarded),
        agent: parsed.agent,
        conversations: sortConversations(parsed.conversations),
      };
    }
  } catch {
    // ignore broken storage
  }
  return null;
}

function persist(next: AppState) {
  current = next;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  emit();
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  if (typeof window !== "undefined" && !loadedFromStorage) {
    loadedFromStorage = true;
    const stored = readStorage();
    if (stored) {
      current = stored;
      queueMicrotask(emit);
    }
  }
  return () => listeners.delete(onStoreChange);
}

function getSnapshot() {
  return current;
}

function getServerSnapshot() {
  return SEED_STATE;
}

function withMessage(
  conv: Conversation,
  message: ChatMessage,
  extra: Partial<Conversation> = {},
): Conversation {
  return {
    ...conv,
    ...extra,
    messages: [...conv.messages, message],
    preview: message.text,
    updatedAt: message.at,
  };
}

function setConversations(
  state: AppState,
  updater: (list: Conversation[]) => Conversation[],
): AppState {
  return {
    ...state,
    conversations: sortConversations(updater(state.conversations)),
  };
}

function updateAgent(patch: Partial<AgentConfig> | AgentConfig) {
  persist({ ...current, agent: { ...current.agent, ...patch } });
}

function setOnboarded() {
  persist({ ...current, onboarded: true });
}

function sendCustomerMessage(conversationId: string, text: string) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const conv = current.conversations.find((c) => c.id === conversationId);
  if (!conv) return;

  const customer: ChatMessage = {
    id: newId(),
    author: "customer",
    text: trimmed,
    at: nowIso(),
  };

  if (conv.status === "human") {
    persist(
      setConversations(current, (list) =>
        list.map((c) =>
          c.id === conv.id
            ? withMessage(c, customer, { unread: c.unread + 1 })
            : c,
        ),
      ),
    );
    return;
  }

  const reply = replyAsAgent(current.agent, trimmed, conv.messages);
  const agentMsg: ChatMessage = {
    id: newId(),
    author: "agent",
    text: reply.text,
    at: nowIso(),
    intent: reply.intent,
  };

  persist(
    setConversations(current, (list) =>
      list.map((c) =>
        c.id === conv.id
          ? withMessage(withMessage(c, customer), agentMsg, {
              status: reply.handoff ? "human" : c.status,
              unread: 0,
            })
          : c,
      ),
    ),
  );
}

function sendHumanReply(conversationId: string, text: string) {
  const trimmed = text.trim();
  if (!trimmed) return;
  persist(
    setConversations(current, (list) =>
      list.map((c) => {
        if (c.id !== conversationId) return c;
        return withMessage(
          c,
          {
            id: newId(),
            author: "human",
            text: trimmed,
            at: nowIso(),
          },
          { unread: 0, status: "human" },
        );
      }),
    ),
  );
}

function setStatus(conversationId: string, status: ConversationStatus) {
  persist({
    ...current,
    conversations: current.conversations.map((c) =>
      c.id === conversationId ? { ...c, status } : c,
    ),
  });
}

function markRead(conversationId: string) {
  const conv = current.conversations.find((c) => c.id === conversationId);
  if (!conv || conv.unread === 0) return;
  persist({
    ...current,
    conversations: current.conversations.map((c) =>
      c.id === conversationId ? { ...c, unread: 0 } : c,
    ),
  });
}

function resetTestChat() {
  persist(
    setConversations(current, (list) => [
      createTestConversation(),
      ...list.filter((c) => !c.isTest),
    ]),
  );
}

function resetDemo() {
  persist({ ...createInitialState(), onboarded: true });
}

type Store = {
  ready: boolean;
  state: AppState;
  updateAgent: typeof updateAgent;
  setOnboarded: typeof setOnboarded;
  sendCustomerMessage: typeof sendCustomerMessage;
  sendHumanReply: typeof sendHumanReply;
  setStatus: typeof setStatus;
  markRead: typeof markRead;
  resetTestChat: typeof resetTestChat;
  resetDemo: typeof resetDemo;
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return children;
}

export function useStore(): Store {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    ready: true,
    state,
    updateAgent,
    setOnboarded,
    sendCustomerMessage,
    sendHumanReply,
    setStatus,
    markRead,
    resetTestChat,
    resetDemo,
  };
}
