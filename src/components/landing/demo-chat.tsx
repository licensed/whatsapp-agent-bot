"use client";

import { useEffect, useState } from "react";
import { PhoneFrame } from "@/components/chat/phone-frame";
import { WhatsAppThread } from "@/components/chat/whatsapp-thread";
import type { ChatMessage } from "@/lib/types";

const SCRIPT: { author: ChatMessage["author"]; text: string }[] = [
  { author: "customer", text: "Oi, vocês estão abertos?" },
      {
        author: "agent",
        text: "Bom dia! Sou a Luna, da Pizzaria Nonna. Hoje funcionamos das 18h às 23h. Posso ajudar com cardápio, pedidos e entrega.",
      },
  { author: "customer", text: "Qual o cardápio?" },
  {
    author: "agent",
    text: "As mais pedidas: Margherita (R$ 49), Calabresa (R$ 54) e Quatro queijos (R$ 59). Entrega em 40 a 55 minutos.",
  },
  { author: "customer", text: "Aceita Pix?" },
  {
    author: "agent",
    text: "Aceitamos Pix, dinheiro e cartão. No Pix tem R$ 5 de desconto na pizza grande 🍕",
  },
];

export function LandingDemo() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (count >= SCRIPT.length) return;
    const timer = window.setTimeout(() => setCount((c) => c + 1), 1400);
    return () => window.clearTimeout(timer);
  }, [count]);

  const messages: ChatMessage[] = SCRIPT.slice(0, count).map((line, index) => ({
    id: `demo-${index}`,
    author: line.author,
    text: line.text,
    at: new Date(Date.UTC(2026, 8, 11, 22, index)).toISOString(),
    intent: line.author === "agent" ? "demo" : undefined,
  }));

  return (
    <PhoneFrame title="Pizzaria Nonna" subtitle="online · agente Luna">
      <WhatsAppThread messages={messages} />
      <div className="bg-[#f0f2f5] px-3 py-3 text-center text-xs text-zinc-500">
        Demonstração automática — o cliente não espera na fila
      </div>
    </PhoneFrame>
  );
}
