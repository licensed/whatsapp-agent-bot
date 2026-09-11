"use client";

import { useMemo, useState } from "react";
import { RotateCcw, UserRound } from "lucide-react";
import { ChatComposer } from "@/components/chat/phone-frame";
import { WhatsAppThread } from "@/components/chat/whatsapp-thread";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatListTime } from "@/lib/hours";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/lib/types";

function statusLabel(status: Conversation["status"]) {
  if (status === "human") return "Com você";
  if (status === "closed") return "Encerrada";
  return "Com o agente";
}

export function Inbox() {
  const {
    state,
    sendCustomerMessage,
    sendHumanReply,
    setStatus,
    markRead,
    resetTestChat,
  } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [asCustomer, setAsCustomer] = useState(true);
  const [mobileChat, setMobileChat] = useState(false);

  const conversations = state.conversations;
  const selected =
    conversations.find((c) => c.id === selectedId) ?? conversations[0];

  const suggestions = useMemo(() => {
    if (!selected?.isTest) return [];
    if (selected.messages.length > 0) return [];
    return state.agent.faqs.slice(0, 3).map((f) => f.question);
  }, [selected, state.agent.faqs]);

  if (!selected) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-zinc-500">
        Nenhuma conversa ainda.
      </div>
    );
  }

  const composerDisabled = selected.status === "closed";
  const showCustomerMode = selected.isTest || selected.status === "bot";

  function send(text: string) {
    if (asCustomer && showCustomerMode) {
      sendCustomerMessage(selected.id, text);
    } else {
      sendHumanReply(selected.id, text);
    }
  }

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] md:h-dvh">
      <aside
        className={cn(
          "flex w-full max-w-full flex-col border-r border-zinc-200 bg-white sm:max-w-80",
          mobileChat ? "hidden sm:flex" : "flex",
        )}
      >
        <div className="border-b border-zinc-200 px-4 py-4">
          <h1 className="text-lg font-semibold">Conversas</h1>
          <p className="text-xs text-zinc-500">
            A caixa de entrada do seu WhatsApp, ainda em modo treino.
          </p>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {conversations.map((conv) => {
            const active = conv.id === selected.id;
            return (
              <button
                key={conv.id}
                type="button"
                data-testid={`conversation-${conv.id}`}
                onClick={() => {
                  setSelectedId(conv.id);
                  setAsCustomer(conv.isTest || conv.status === "bot");
                  setMobileChat(true);
                  markRead(conv.id);
                }}
                className={cn(
                  "flex w-full items-start gap-3 border-b border-zinc-100 px-4 py-3 text-left",
                  active ? "bg-emerald-50" : "hover:bg-zinc-50",
                )}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-semibold text-white">
                  {conv.contactName.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-zinc-900">
                      {conv.contactName}
                    </p>
                    <span className="text-[11px] text-zinc-500">
                      {formatListTime(conv.updatedAt)}
                    </span>
                  </div>
                  <p className="truncate text-xs text-zinc-500">{conv.preview}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Badge
                      variant={conv.status === "human" ? "default" : "secondary"}
                      className="h-5"
                    >
                      {statusLabel(conv.status)}
                    </Badge>
                    {conv.unread > 0 && (
                      <span className="flex size-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-semibold text-white">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <section
        className={cn(
          "min-w-0 flex-1 flex-col bg-[#efeae2]",
          mobileChat ? "flex" : "hidden sm:flex",
        )}
      >
        <header className="flex items-center justify-between gap-3 border-b border-zinc-200 bg-[#f0f2f5] px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden"
              onClick={() => setMobileChat(false)}
            >
              Voltar
            </Button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {selected.contactName}
              </p>
              <p className="text-xs text-zinc-500">{selected.phone}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {selected.isTest && (
              <Button variant="outline" size="sm" onClick={resetTestChat}>
                <RotateCcw />
                Limpar teste
              </Button>
            )}
            {selected.status === "bot" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStatus(selected.id, "human");
                  setAsCustomer(false);
                }}
              >
                <UserRound />
                Atender eu mesmo
              </Button>
            )}
            {selected.status === "human" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStatus(selected.id, "bot");
                  setAsCustomer(true);
                }}
              >
                Devolver ao agente
              </Button>
            )}
            {selected.status !== "closed" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStatus(selected.id, "closed")}
              >
                Encerrar
              </Button>
            )}
          </div>
        </header>

        <WhatsAppThread
          messages={selected.messages}
          suggestions={suggestions}
          onSuggestion={(text) => sendCustomerMessage(selected.id, text)}
          emptyHint="Esta conversa ainda está vazia. Mande um “oi” para ver o agente responder."
        />

        <div className="border-t border-zinc-200 bg-white px-4 py-2">
          {showCustomerMode && (
            <div className="mb-2 flex gap-1 rounded-lg bg-zinc-100 p-1 text-xs">
              <button
                type="button"
                onClick={() => setAsCustomer(true)}
                className={cn(
                  "flex-1 rounded-md px-2 py-1.5",
                  asCustomer ? "bg-white font-medium shadow-sm" : "text-zinc-600",
                )}
              >
                Falar como cliente
              </button>
              <button
                type="button"
                onClick={() => setAsCustomer(false)}
                className={cn(
                  "flex-1 rounded-md px-2 py-1.5",
                  !asCustomer ? "bg-white font-medium shadow-sm" : "text-zinc-600",
                )}
              >
                Responder como você
              </button>
            </div>
          )}
          {selected.status === "human" && asCustomer && (
            <p className="mb-2 text-xs text-amber-700">
              O agente parou. As próximas mensagens do cliente ficam esperando
              você.
            </p>
          )}
          <ChatComposer
            onSend={send}
            disabled={composerDisabled}
            placeholder={
              composerDisabled
                ? "Conversa encerrada"
                : asCustomer
                  ? "Mensagem do cliente"
                  : "Sua resposta"
            }
          />
        </div>
      </section>
    </div>
  );
}
