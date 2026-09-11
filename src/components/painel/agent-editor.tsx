"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { newId } from "@/lib/agent";
import { WEEKDAYS } from "@/lib/hours";
import { useStore } from "@/lib/store";
import { BUSINESS_TYPES, createDefaultAgent } from "@/lib/templates";
import type { BusinessType } from "@/lib/types";

export function AgentEditor() {
  const { state, updateAgent, resetDemo } = useStore();
  const agent = state.agent;

  function loadTemplate(type: BusinessType) {
    updateAgent(createDefaultAgent(type));
    toast("Agente preenchido com um exemplo. Troque pelos seus textos.");
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Meu agente</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Tudo o que está aqui é o que o atendente virtual sabe falar. Se uma
          resposta estiver errada, mude o texto — não precisa de código.
        </p>
      </div>

      <section className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="font-semibold">Começar de um modelo</h2>
        <div className="flex flex-wrap gap-2">
          {BUSINESS_TYPES.map((item) => (
            <Button
              key={item.id}
              variant={agent.businessType === item.id ? "default" : "outline"}
              size="sm"
              onClick={() => loadTemplate(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="font-semibold">Identidade</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="businessName">Nome do negócio</Label>
            <Input
              id="businessName"
              value={agent.businessName}
              onChange={(e) => updateAgent({ businessName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="agentName">Nome do agente</Label>
            <Input
              id="agentName"
              value={agent.agentName}
              onChange={(e) => updateAgent({ agentName: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              value={agent.city}
              onChange={(e) => updateAgent({ city: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="greeting">Saudação</Label>
            <Textarea
              id="greeting"
              value={agent.greeting}
              onChange={(e) => updateAgent({ greeting: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="extra">Recado extra (opcional)</Label>
            <Textarea
              id="extra"
              value={agent.extraInfo}
              onChange={(e) => updateAgent({ extraInfo: e.target.value })}
              placeholder="Pedido mínimo, taxa de entrega, convênios..."
            />
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="font-semibold">Horário</h2>
        {WEEKDAYS.map((day) => {
          const hours = agent.hours[day.id];
          return (
            <div
              key={day.id}
              className="flex flex-wrap items-center gap-3 rounded-xl bg-zinc-50 px-3 py-2"
            >
              <p className="w-20 text-sm font-medium">{day.label}</p>
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
      </section>

      <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">Perguntas e respostas</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateAgent({
                faqs: [
                  ...agent.faqs,
                  {
                    id: newId(),
                    question: "Nova pergunta",
                    answer: "Escreva a resposta aqui.",
                  },
                ],
              })
            }
          >
            Adicionar
          </Button>
        </div>
        {agent.faqs.map((faq, index) => (
          <div key={faq.id} className="space-y-2 rounded-xl border border-zinc-200 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-500">Pergunta {index + 1}</p>
              <button
                type="button"
                className="text-xs text-zinc-500 hover:text-red-600"
                onClick={() =>
                  updateAgent({
                    faqs: agent.faqs.filter((f) => f.id !== faq.id),
                  })
                }
              >
                Remover
              </button>
            </div>
            <Input
              value={faq.question}
              onChange={(e) =>
                updateAgent({
                  faqs: agent.faqs.map((f) =>
                    f.id === faq.id ? { ...f, question: e.target.value } : f,
                  ),
                })
              }
            />
            <Textarea
              value={faq.answer}
              onChange={(e) =>
                updateAgent({
                  faqs: agent.faqs.map((f) =>
                    f.id === faq.id ? { ...f, answer: e.target.value } : f,
                  ),
                })
              }
            />
          </div>
        ))}
      </section>

      <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="font-semibold">Quando ele não souber</h2>
        <div className="space-y-2">
          <Label htmlFor="fallback">Resposta padrão</Label>
          <Textarea
            id="fallback"
            value={agent.fallback}
            onChange={(e) => updateAgent({ fallback: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="handoff">Se pedirem um atendente</Label>
          <Textarea
            id="handoff"
            value={agent.handoffMessage}
            onChange={(e) => updateAgent({ handoffMessage: e.target.value })}
          />
        </div>
      </section>

      <div className="flex flex-wrap gap-2 pb-10">
        <Button
          onClick={() => toast("Alterações já estão salvas neste navegador.")}
        >
          Salvar (já está salvo)
        </Button>
        <Button variant="outline" onClick={resetDemo}>
          Restaurar pizzaria de exemplo
        </Button>
      </div>
    </div>
  );
}
