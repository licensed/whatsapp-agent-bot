"use client";

import { useEffect, useRef } from "react";
import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMessageTime } from "@/lib/hours";
import type { ChatMessage } from "@/lib/types";

export function WhatsAppThread({
  messages,
  suggestions = [],
  onSuggestion,
  emptyHint = "As mensagens aparecem aqui.",
}: {
  messages: ChatMessage[];
  suggestions?: string[];
  onSuggestion?: (text: string) => void;
  emptyHint?: string;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="wa-wallpaper flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-3">
      {messages.length === 0 ? (
        <p className="mx-auto mt-10 max-w-[16rem] rounded-lg bg-white/90 px-3 py-2 text-center text-xs text-zinc-600 shadow-sm">
          {emptyHint}
        </p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {messages.map((message) => {
            const outgoing = message.author !== "customer";
            return (
              <div
                key={message.id}
                className={cn("flex", outgoing ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "relative max-w-[82%] rounded-lg px-2.5 py-1.5 text-[13.5px] leading-5 shadow-sm",
                    outgoing
                      ? "rounded-tr-none bg-[#d9fdd3] text-zinc-900"
                      : "rounded-tl-none bg-white text-zinc-900",
                  )}
                >
                  {message.author === "human" && (
                    <p className="mb-0.5 text-[11px] font-semibold text-teal-700">
                      Você
                    </p>
                  )}
                  {message.author === "agent" && (
                    <p className="mb-0.5 text-[11px] font-semibold text-emerald-700">
                      Agente
                    </p>
                  )}
                  <p className="whitespace-pre-wrap pr-12">{message.text}</p>
                  <span className="absolute right-1.5 bottom-1 flex items-center gap-0.5 text-[10px] text-zinc-500">
                    {formatMessageTime(message.at)}
                    {outgoing && (
                      <CheckCheck className="size-3.5 text-sky-500" />
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {suggestions.length > 0 && onSuggestion && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {suggestions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onSuggestion(item)}
              className="rounded-full border border-emerald-700/20 bg-white/95 px-2.5 py-1 text-left text-[12px] text-emerald-900 shadow-sm hover:bg-emerald-50"
            >
              {item}
            </button>
          ))}
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
