import type { AgentConfig, AgentReply, ChatMessage } from "./types";
import { describeHours, isOpenNow } from "./hours";

const STOPWORDS = new Set([
  "a",
  "o",
  "os",
  "as",
  "um",
  "uma",
  "de",
  "da",
  "do",
  "das",
  "dos",
  "em",
  "no",
  "na",
  "nas",
  "nos",
  "para",
  "pra",
  "por",
  "com",
  "que",
  "eu",
  "me",
  "meu",
  "minha",
  "voce",
  "voces",
  "seu",
  "sua",
  "tem",
  "ter",
  "pode",
  "podem",
  "fazer",
  "faz",
  "quero",
  "queria",
  "gostaria",
  "sobre",
  "isso",
  "esse",
  "essa",
  "este",
  "esta",
  "aqui",
  "ai",
  "la",
  "mais",
  "menos",
  "muito",
  "pouco",
  "como",
  "qual",
  "quais",
  "quando",
  "onde",
  "porque",
  "porq",
  "q",
  "e",
  "ou",
  "mas",
  "se",
  "nao",
  "sim",
  "oi",
  "ola",
  "bom",
  "boa",
  "dia",
  "tarde",
  "noite",
]);

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(text: string): string[] {
  return normalize(text)
    .split(" ")
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function includesAny(haystack: string, needles: string[]): boolean {
  return needles.some((n) => haystack.includes(n));
}

function greetingForNow(): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      hourCycle: "h23",
      timeZone: "America/Sao_Paulo",
    }).format(new Date()),
  );
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function alreadyGreeted(history: ChatMessage[]): boolean {
  return history.some((m) => m.author === "agent" && m.intent === "greeting");
}

function faqSuggestions(agent: AgentConfig, limit = 3): string[] {
  return agent.faqs.slice(0, limit).map((f) => f.question);
}

function matchFaq(agent: AgentConfig, text: string) {
  const t = tokens(text);
  const blob = normalize(text);
  if (t.length === 0 && blob.length < 4) return null;

  let best: { id: string; score: number; answer: string; question: string } | null =
    null;

  for (const faq of agent.faqs) {
    const qNorm = normalize(faq.question);
    const qTokens = tokens(`${faq.question} ${faq.answer}`);
    let score = 0;

    if (blob === qNorm) score += 12;
    if (blob.includes(qNorm) || qNorm.includes(blob)) score += 6;

    for (const tok of t) {
      if (qTokens.includes(tok)) score += 2;
      if (qNorm.includes(tok)) score += 1;
    }

    if (!best || score > best.score) {
      best = { id: faq.id, score, answer: faq.answer, question: faq.question };
    }
  }

  if (!best) return null;
  const min = t.length <= 2 ? 2 : 3;
  if (best.score < min) return null;
  return best;
}

function detectIntent(text: string): string {
  const n = normalize(text);

  if (
    includesAny(n, [
      "atendente",
      "humano",
      "pessoa",
      "gerente",
      "recepcao",
      "falar com alguem",
      "falar com uma pessoa",
      "quero uma pessoa",
    ])
  ) {
    return "human";
  }

  if (
    includesAny(n, [
      "horario",
      "funcionam",
      "funciona",
      "aberto",
      "abertos",
      "fecha",
      "fechado",
      "abre",
      "expediente",
      "que horas",
    ])
  ) {
    return "hours";
  }

  if (
    /^(oi+|ola+|oie+|eai+|eae+|hey+|hello+|bom dia|boa tarde|boa noite)[\s!?.]*$/.test(
      n,
    )
  ) {
    return "greeting";
  }

  if (includesAny(n, ["obrigad", "valeu", "agradec", "muito bom", "otimo"])) {
    return "thanks";
  }

  if (includesAny(n, ["tchau", "ate logo", "ate mais", "falou", "flw"])) {
    return "goodbye";
  }

  return "other";
}

export function replyAsAgent(
  agent: AgentConfig,
  text: string,
  history: ChatMessage[] = [],
): AgentReply {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      text: "Pode mandar sua dúvida por escrito que eu te ajudo.",
      intent: "empty",
      handoff: false,
      suggestions: faqSuggestions(agent),
    };
  }

  const intent = detectIntent(trimmed);
  const open = isOpenNow(agent);
  const closedNote = open
    ? ""
    : ` Hoje estamos fechados agora. ${describeHours(agent)}`;

  if (intent === "human") {
    return {
      text: agent.handoffMessage,
      intent,
      handoff: true,
      suggestions: [],
    };
  }

  if (intent === "thanks") {
    return {
      text: `Que bom! Se precisar de mais alguma coisa, é só chamar. Abraço da ${agent.agentName} 🌿`,
      intent,
      handoff: false,
      suggestions: [],
    };
  }

  if (intent === "goodbye") {
    return {
      text: `Até mais! A ${agent.businessName} agradece o contato.`,
      intent,
      handoff: false,
      suggestions: [],
    };
  }

  if (intent === "hours") {
    const status = open
      ? "Neste momento estamos abertos."
      : "Neste momento estamos fechados.";
    return {
      text: `${status} ${describeHours(agent)}`,
      intent,
      handoff: false,
      suggestions: faqSuggestions(agent),
    };
  }

  const faq = matchFaq(agent, trimmed);
  if (faq) {
    return {
      text: faq.answer + (open ? "" : closedNote),
      intent: "faq",
      handoff: false,
      suggestions: faqSuggestions(agent).filter((q) => q !== faq.question),
    };
  }

  if (intent === "greeting" || trimmed.length <= 12) {
    const greet = alreadyGreeted(history)
      ? "Pois não!"
      : `${greetingForNow()}! ${agent.greeting}`;
    const extra = agent.extraInfo ? ` ${agent.extraInfo}` : "";
    const closed = open
      ? ""
      : ` Obs.: neste momento a casa está fechada. ${describeHours(agent)}`;
    return {
      text: `${greet}${extra}${closed}`,
      intent: "greeting",
      handoff: false,
      suggestions: faqSuggestions(agent),
    };
  }

  const extras = agent.extraInfo ? ` ${agent.extraInfo}` : "";
  return {
    text: `${agent.fallback}${extras}${open ? "" : closedNote}`,
    intent: "unknown",
    handoff: false,
    suggestions: ["Falar com um atendente", ...faqSuggestions(agent, 2)],
  };
}

export function newId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}
