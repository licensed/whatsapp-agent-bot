"use client";

import { useSyncExternalStore } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PATHS = [
  {
    title: "1. Treine aqui até ficar bom",
    text: "Esse é o passo de agora. No simulador, o agente já responde como se fosse o WhatsApp. Não precisa de conta Meta, API nem cartão.",
  },
  {
    title: "2. Use o WhatsApp Business de verdade",
    text: "O caminho oficial da Meta se chama Cloud API. Você cria uma conta Business, verifica o número da empresa e aponta as mensagens para um endereço (webhook) deste app.",
  },
  {
    title: "3. Ou use uma API intermediária",
    text: "Ferramentas como Evolution API ou provedores brasileiros conectam o WhatsApp e enviam as mensagens para o mesmo tipo de webhook. Útil se você não quiser lidar com o painel da Meta.",
  },
];

export function ConnectGuide() {
  const origin = useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => "",
  );
  const webhook = origin
    ? `${origin}/api/whatsapp/webhook`
    : "/api/whatsapp/webhook";

  function copy() {
    if (!webhook) return;
    void navigator.clipboard.writeText(webhook);
    toast("Endereço copiado.");
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Como ligar no WhatsApp de verdade
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Você não precisa entender de programação para chegar até aqui. Ligar o
          número oficial é o único passo mais burocrático, porque o WhatsApp
          exige uma conta de empresa. Até lá, o agente já funciona neste site.
        </p>
      </div>

      <ol className="space-y-4">
        {PATHS.map((item) => (
          <li
            key={item.title}
            className="rounded-2xl border border-zinc-200 bg-white p-5"
          >
            <h2 className="font-semibold text-zinc-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{item.text}</p>
          </li>
        ))}
      </ol>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="font-semibold">Endereço do webhook</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Quando a Meta (ou a Evolution API) perguntar para onde enviar as
          mensagens, cole este endereço:
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <code className="flex-1 truncate rounded-lg bg-zinc-100 px-3 py-2 text-xs">
            {webhook}
          </code>
          <Button variant="outline" onClick={copy}>
            <Copy />
            Copiar
          </Button>
        </div>
        <p className="mt-3 text-xs leading-5 text-zinc-500">
          O app já tem uma rota pronta em{" "}
          <code>/api/whatsapp/webhook</code>. Em ambiente local ela recebe o
          teste da Meta e responde com o agente. Em produção na nuvem você
          ainda vai precisar guardar as conversas num banco — este recorte usa
          o navegador.
        </p>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="font-semibold">Checklist da Cloud API (Meta)</h2>
        <ul className="mt-3 space-y-2 text-sm text-zinc-700">
          {[
            "Criar uma conta no Meta Business Suite",
            "Adicionar o app “WhatsApp” e um número de telefone da empresa",
            "Não use o WhatsApp pessoal — o número da API é separado",
            "Colar o webhook acima e o token de verificação ATENDEZAP",
            "Mandar uma mensagem de teste do próprio painel da Meta",
          ].map((line) => (
            <li key={line} className="flex gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
        <p className="font-semibold">O que não fazer</p>
        <p className="mt-1">
          Evite programas que “conectam pelo QR Code do WhatsApp Web” na sua
          conta pessoal. Isso costuma quebrar as regras do WhatsApp e pode
          banir o número. O caminho seguro é o WhatsApp Business Platform
          (Cloud API) ou um provedor oficial.
        </p>
      </section>
    </div>
  );
}
