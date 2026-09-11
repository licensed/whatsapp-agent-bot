import type { AgentConfig, Weekday } from "./types";

export const WEEKDAYS: { id: Weekday; label: string; short: string }[] = [
  { id: "seg", label: "Segunda", short: "Seg" },
  { id: "ter", label: "Terça", short: "Ter" },
  { id: "qua", label: "Quarta", short: "Qua" },
  { id: "qui", label: "Quinta", short: "Qui" },
  { id: "sex", label: "Sexta", short: "Sex" },
  { id: "sab", label: "Sábado", short: "Sáb" },
  { id: "dom", label: "Domingo", short: "Dom" },
];

const JS_TO_WEEKDAY: Weekday[] = [
  "dom",
  "seg",
  "ter",
  "qua",
  "qui",
  "sex",
  "sab",
];

export function closedDay(): AgentConfig["hours"][Weekday] {
  return { closed: true, open: "09:00", close: "18:00" };
}

export function openDay(
  open: string,
  close: string,
): AgentConfig["hours"][Weekday] {
  return { closed: false, open, close };
}

export function weekdayFromDate(date: Date, timeZone: string): Weekday {
  const day = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone,
  }).format(date);
  const map: Record<string, Weekday> = {
    Sun: "dom",
    Mon: "seg",
    Tue: "ter",
    Wed: "qua",
    Thu: "qui",
    Fri: "sex",
    Sat: "sab",
  };
  return map[day] ?? JS_TO_WEEKDAY[date.getDay()];
}

function minutesNow(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).formatToParts(date);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return hour * 60 + minute;
}

function parseMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function isOpenNow(agent: AgentConfig, at = new Date()): boolean {
  const day = weekdayFromDate(at, agent.timezone);
  const hours = agent.hours[day];
  if (!hours || hours.closed) return false;
  const now = minutesNow(at, agent.timezone);
  const open = parseMinutes(hours.open);
  const close = parseMinutes(hours.close);
  if (close < open) {
    return now >= open || now < close;
  }
  return now >= open && now < close;
}

export function formatClock(hhmm: string): string {
  const [h, m] = hhmm.split(":");
  if (m === "00") return `${Number(h)}h`;
  return `${Number(h)}h${m}`;
}

export function describeHours(agent: AgentConfig): string {
  const groups: { days: Weekday[]; open: string; close: string }[] = [];
  for (const day of WEEKDAYS) {
    const hours = agent.hours[day.id];
    if (!hours || hours.closed) continue;
    const last = groups[groups.length - 1];
    if (last && last.open === hours.open && last.close === hours.close) {
      last.days.push(day.id);
    } else {
      groups.push({
        days: [day.id],
        open: hours.open,
        close: hours.close,
      });
    }
  }

  const closed = WEEKDAYS.filter((d) => agent.hours[d.id]?.closed).map(
    (d) => d.label.toLowerCase(),
  );

  if (groups.length === 0) {
    return "No momento não temos um horário de funcionamento cadastrado.";
  }

  const parts = groups.map((group) => {
    const labels = group.days.map(
      (id) => WEEKDAYS.find((d) => d.id === id)!.label.toLowerCase(),
    );
    const dayText =
      labels.length === 1
        ? labels[0]
        : `${labels[0]} a ${labels[labels.length - 1]}`;
    return `${dayText} das ${formatClock(group.open)} às ${formatClock(group.close)}`;
  });

  let text = `Funcionamos ${parts.join(" e ")}.`;
  if (closed.length === 1) text += ` Fechamos ${closed[0]}.`;
  else if (closed.length > 1) {
    const last = closed.pop();
    text += ` Fechamos ${closed.join(", ")} e ${last}.`;
  }
  return text;
}

export function formatMessageTime(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(iso));
}

export function formatListTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  if (sameDay) return formatMessageTime(iso);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}
