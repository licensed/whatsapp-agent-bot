"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { LiveChat } from "@/components/chat/phone-frame";
import { Logo } from "@/components/brand/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { newId, nowIso, replyAsAgent } from "@/lib/agent";
import { WEEKDAYS } from "@/lib/hours";
import { useStore } from "@/lib/store";
import { BUSINESS_TYPES, createDefaultAgent } from "@/lib/templates";
import type { BusinessType, ChatMessage, Faq } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS = ["Negócio", "Identidade", "Horário", "Perguntas", "Teste"];

export function Wizard({ step }: { step: number }) {
  const { state, updateAgent, setOnboarded, resetTestChat } = useStore();
  const [testMessages, setTestMessages] = useState<ChatMessage[]>([]);

  const agent = state.agent;

  function applyType(type: BusinessType) {
    updateAgent(createDefaultAgent(type));
  }

  const suggestions = useMemo(
    () => agent.faqs.slice(0, 3).map((f) => f.question),
    [agent.faqs],
  );

  function sendTest(text: string) {
    const customer: ChatMessage = {
      id: newId(),
      author: "customer",
      text,
      at: nowIso(),
    };
    const reply = replyAsAgent(agent, text, testMessages);
    const agentMsg: ChatMessage = {
      id: newId(),
      author: "agent",
      text: reply.text,
      at: nowIso(),
      intent: reply.intent,
    };
    setTestMessages((prev) => [...prev, customer, agentMsg]);
  }

  return (
    <div className="min-h-full bg-[#f4f7f4]">
      <header className="border-b border-emerald-900/5 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/">
            <Logo />
          </Link>
          <p className="text-sm text-zinc-500">
            Passo {step + 1} de {STEPS.length}
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-5 gap-1 px-4 pb-3">
          {STEPS.map((label, index) => (
            <Link
              key={label}
              href={`/comecar?passo=${index}`}
              className="text-left"
            >
              <div
                className={cn(
                  "h-1.5 rounded-full",
                  index <= step ? "bg-emerald-600" : "bg-zinc-200",
                )}
              />
              <span className="mt-1 hidden text-[11px] text-zinc-500 sm:block">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {step === 0 && (
          <section>
            <h1 className="text-3xl font-semibold tracking-tight">
              Que tipo de negócio você atende no WhatsApp?
            </h1>
            <p className="mt-2 max-w-xl text-zinc-600">
              Isso só serve para já preencher um agente de exemplo. Depois você
              troca tudo pelos seus textos.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {BUSINESS_TYPES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => applyType(item.id)}
                  className={cn(
                    "rounded-2xl border bg-white p-5 text-left transition",
                    agent.businessType === item.id
                      ? "border-emerald-600 ring-2 ring-emerald-600/20"
                      : "border-zinc-200 hover:border-emerald-300",
                  )}
                >
                  <p className="font-semibold text-zinc-900">{item.label}</p>
                  <p className="mt-1 text-sm text-zinc-600">{item.hint}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="max-w-xl space-y-5">
            <h1 className="text-3xl font-semibold tracking-tight">
              Como o agente deve se apresentar?
            </h1>
            <div className="space-y-2">
              <Label htmlFor="business">Nome do seu negócio</Label>
              <Input
                id="business"
                value={agent.businessName}
                onChange={(e) => updateAgent({ businessName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agent">Nome do agente</Label>
              <Input
                id="agent"
                value={agent.agentName}
                onChange={(e) => updateAgent({ agentName: e.target.value })}
              />
              <p className="text-xs text-zinc-500">
                Um nome curto funciona melhor. Ex.: Luna, Pedro, Sofia.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={agent.city}
                onChange={(e) => updateAgent({ city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="greeting">Primeira mensagem</Label>
              <Textarea
                id="greeting"
                rows={4}
                value={agent.greeting}
                onChange={(e) => updateAgent({ greeting: e.target.value })}
              />
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="max-w-xl">
            <h1 className="text-3xl font-semibold tracking-tight">
              Qual o horário de funcionamento?
            </h1>
            <p className="mt-2 text-zinc-600">
              O agente avisa se a casa está aberta ou fechada neste momento.
            </p>
            <div className="mt-6 space-y-2">
              {WEEKDAYS.map((day) => {
                const hours = agent.hours[day.id];
                return (
                  <div
                    key={day.id}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2"
                  >
                    <p className="w-20 text-sm font-medium">{day.label}</p>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={!hours.closed}
                        onCheckedChange={(open) =>
                          updateAgent({
                            hours: {
                              ...agent.hours,
                              [day.id]: { ...hours, closed: !open },
                            },
                          })
                        }
                      />
                      <span className="text-xs text-zinc-500">
                        {hours.closed ? "Fechado" : "Aberto"}
                      </span>
                    </div>
                    {!hours.closed && (
                      <div className="ml-auto flex items-center gap-2">
                        <Input
                          type="time"
                          className="h-8 w-[7.2rem]"
                          value={hours.open}
                          onChange={(e) =>
                            updateAgent({
                              hours: {
                                ...agent.hours,
                                [day.id]: { ...hours, open: e.target.value },
                              },
                            })
                          }
                        />
                        <span className="text-xs text-zinc-400">às</span>
                        <Input
                          type="time"
                          className="h-8 w-[7.2rem]"
                          value={hours.close}
                          onChange={(e) =>
                            updateAgent({
                              hours: {
                                ...agent.hours,
                                [day.id]: { ...hours, close: e.target.value },
                              },
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight">
              O que os clientes mais perguntam?
            </h1>
            <p className="mt-2 text-zinc-600">
              Cada pergunta vira uma resposta automática. Troque pelos seus
              textos reais.
            </p>
            <div className="mt-6 space-y-4">
              {agent.faqs.map((faq, index) => (
                <FaqEditor
                  key={faq.id}
                  faq={faq}
                  index={index}
                  onChange={(next) =>
                    updateAgent({
                      faqs: agent.faqs.map((f) => (f.id === faq.id ? next : f)),
                    })
                  }
                  onRemove={() =>
                    updateAgent({
                      faqs: agent.faqs.filter((f) => f.id !== faq.id),
                    })
                  }
                />
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  updateAgent({
                    faqs: [
                      ...agent.faqs,
                      {
                        id: newId(),
                        question: "Nova pergunta",
                        answer: "Escreva aqui a resposta que o agente deve dar.",
                      },
                    ],
                  })
                }
              >
                Adicionar pergunta
              </Button>
            </div>
            <div className="mt-6 space-y-2">
              <Label htmlFor="fallback">Se ele não souber responder</Label>
              <Textarea
                id="fallback"
                value={agent.fallback}
                onChange={(e) => updateAgent({ fallback: e.target.value })}
              />
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Mande uma mensagem como se fosse cliente
              </h1>
              <p className="mt-2 max-w-lg text-zinc-600">
                Experimente “oi”, “qual o horário?” ou uma das perguntas que
                você cadastrou. Se a resposta estiver estranha, volte e ajuste.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-zinc-700">
                <li className="flex gap-2">
                  <Check className="mt-0.5 size-4 text-emerald-600" />
                  O agente já sabe o horário da casa
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 size-4 text-emerald-600" />
                  Responde as perguntas que você escreveu
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 size-4 text-emerald-600" />
                  Se a pessoa pedir um atendente, ele passa a conversa
                </li>
              </ul>
            </div>
            <LiveChat
              title={agent.businessName}
              subtitle={`${agent.agentName} · agente virtual`}
              messages={testMessages}
              suggestions={testMessages.length === 0 ? suggestions : []}
              onSend={sendTest}
              onSuggestion={sendTest}
              emptyHint="Escreva como um cliente. Ninguém vê isso além de você."
            />
          </section>
        )}

        <div className="mt-10 flex items-center justify-between">
          <Link
            href={step === 0 ? "/" : `/comecar?passo=${step - 1}`}
            className={cn(buttonVariants({ variant: "ghost" }), "h-10 px-4")}
          >
            <ArrowLeft />
            Voltar
          </Link>
          {step < STEPS.length - 1 ? (
            <Link
              href={`/comecar?passo=${step + 1}`}
              data-testid="wizard-next"
              className={cn(buttonVariants(), "h-10 px-4")}
            >
              Continuar
              <ArrowRight />
            </Link>
          ) : (
            <Link
              href="/painel"
              data-testid="wizard-finish"
              className={cn(buttonVariants(), "h-10 px-4")}
              onClick={() => {
                setOnboarded();
                resetTestChat();
              }}
            >
              Ir para o painel
              <ArrowRight />
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}

function FaqEditor({
  faq,
  index,
  onChange,
  onRemove,
}: {
  faq: Faq;
  index: number;
  onChange: (faq: Faq) => void;
  onRemove: () => void;
}) {
  return (
    <div className="space-y-2 rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-zinc-500">Pergunta {index + 1}</p>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-zinc-500 hover:text-red-600"
        >
          Remover
        </button>
      </div>
      <Input
        value={faq.question}
        onChange={(e) => onChange({ ...faq, question: e.target.value })}
      />
      <Textarea
        value={faq.answer}
        onChange={(e) => onChange({ ...faq, answer: e.target.value })}
      />
    </div>
  );
}
