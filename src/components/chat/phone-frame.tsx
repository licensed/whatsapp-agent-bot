"use client";

import { useRef } from "react";
import { SendHorizonal } from "lucide-react";
import { WhatsAppThread } from "@/components/chat/whatsapp-thread";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";

export function PhoneFrame({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[360px] overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-900 shadow-2xl",
        className,
      )}
    >
      <div className="flex h-[34px] items-center justify-center bg-zinc-900">
        <div className="h-4 w-24 rounded-full bg-zinc-800" />
      </div>
      <div className="flex h-[620px] flex-col bg-[#0b141a] sm:h-[640px]">
        <header className="flex items-center gap-3 bg-[#075e54] px-3 py-2.5 text-white">
          <div className="flex size-9 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">
            {title.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{title}</p>
            {subtitle && (
              <p className="truncate text-[11px] text-white/80">{subtitle}</p>
            )}
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}

export function ChatComposer({
  onSend,
  placeholder = "Mensagem",
  disabled,
}: {
  onSend: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function send() {
    if (disabled) return;
    const text = inputRef.current?.value.trim() ?? "";
    if (!text) return;
    onSend(text);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex items-center gap-2 bg-[#f0f2f5] px-2 py-2">
      <input
        ref={inputRef}
        name="message"
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            send();
          }
        }}
        className="h-10 flex-1 rounded-full border-0 bg-white px-4 text-sm text-zinc-800 outline-none ring-0 placeholder:text-zinc-400"
      />
      <button
        type="button"
        disabled={disabled}
        data-testid="send-message"
        onClick={send}
        className="flex size-10 items-center justify-center rounded-full bg-[#00a884] text-white disabled:opacity-40"
        aria-label="Enviar"
      >
        <SendHorizonal className="size-4" />
      </button>
    </div>
  );
}

export function LiveChat({
  title,
  subtitle,
  messages,
  suggestions,
  onSend,
  onSuggestion,
  composerPlaceholder,
  emptyHint,
  disabled,
}: {
  title: string;
  subtitle?: string;
  messages: ChatMessage[];
  suggestions?: string[];
  onSend: (text: string) => void;
  onSuggestion?: (text: string) => void;
  composerPlaceholder?: string;
  emptyHint?: string;
  disabled?: boolean;
}) {
  return (
    <PhoneFrame title={title} subtitle={subtitle}>
      <WhatsAppThread
        messages={messages}
        suggestions={suggestions}
        onSuggestion={onSuggestion}
        emptyHint={emptyHint}
      />
      <ChatComposer
        onSend={onSend}
        placeholder={composerPlaceholder}
        disabled={disabled}
      />
    </PhoneFrame>
  );
}
