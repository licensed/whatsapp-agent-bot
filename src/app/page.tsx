import Link from "next/link";
import {
  BookOpen,
  Clock,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { LandingDemo } from "@/components/landing/demo-chat";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    n: "1",
    title: "Você ensina o agente",
    text: "Horário, cardápio, endereço, preços, jeito de falar. É como treinar um funcionário novo, só que por escrito.",
  },
  {
    n: "2",
    title: "Você testa aqui",
    text: "Manda mensagem como se fosse um cliente. Se a resposta não ficar boa, você ajusta a pergunta e a resposta.",
  },
  {
    n: "3",
    title: "Depois liga no WhatsApp",
    text: "Quando o atendimento estiver redondo, conecta no WhatsApp Business. Até lá, não precisa de API, senha nem cartão.",
  },
];

const CAN_DO = [
  {
    icon: Clock,
    title: "Responder na hora",
    text: "Horário, endereço, preço e o que mais você cadastrar. O cliente não fica no vácuo.",
  },
  {
    icon: BookOpen,
    title: "Usar o que você já sabe",
    text: "As respostas vêm das suas perguntas frequentes. Sem “inteligência misteriosa”: o agente fala o que você ensinou.",
  },
  {
    icon: UserRound,
    title: "Chamar um humano",
    text: "Se a pessoa pedir um atendente, ou se a dúvida for nova, a conversa passa para você.",
  },
  {
    icon: ShieldCheck,
    title: "Começar sem risco",
    text: "Não usa o WhatsApp da sua conta pessoal. Você pratica num simulador até se sentir seguro.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-full bg-[#f4f7f4]">
      <header className="sticky top-0 z-20 border-b border-emerald-900/5 bg-[#f4f7f4]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-2">
            <Link
              href="/painel"
              className={cn(buttonVariants({ variant: "ghost" }), "h-8 px-3")}
            >
              Abrir painel
            </Link>
            <Link href="/comecar" className={cn(buttonVariants(), "h-8 px-3")}>
              Criar meu agente
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
              <Sparkles className="size-3.5" />
              Feito para quem nunca programou
            </p>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Seu WhatsApp pode atender sozinho. Sem você virar programador.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-7 text-zinc-600">
              Um agente é um atendente virtual. Ele lê a mensagem do cliente e
              responde com o que você ensinou: horário, preço, endereço, pedido.
              Se não souber, chama uma pessoa de verdade.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/comecar"
                className={cn(buttonVariants({ size: "lg" }), "h-11 px-5 text-base")}
              >
                Montar meu agente agora
              </Link>
              <Link
                href="/painel"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-11 px-5 text-base",
                )}
              >
                Ver uma pizzaria de exemplo
              </Link>
            </div>
            <p className="mt-4 text-sm text-zinc-500">
              Leva uns 3 minutos. Tudo fica salvo neste navegador.
            </p>
          </div>
          <LandingDemo />
        </section>

        <section className="border-y border-emerald-900/5 bg-white">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="rounded-2xl bg-[#f4f7f4] p-6">
                <div className="mb-4 flex size-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                  {step.n}
                </div>
                <h2 className="text-lg font-semibold text-zinc-900">{step.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            O que esse agente consegue fazer
          </h2>
          <p className="mt-2 max-w-2xl text-zinc-600">
            Não é mágica e não substitui um funcionário em tudo. Ele cobre o
            básico que hoje te faz perder venda: a primeira resposta.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {CAN_DO.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-5"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <item.icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-zinc-600">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-emerald-900/5 bg-emerald-800">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 sm:flex-row sm:items-center">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-white">
                <MessageCircle className="size-6" />
                Comece com um negócio de exemplo
              </h2>
              <p className="mt-2 max-w-xl text-emerald-50">
                Já deixamos uma pizzaria pronta. Você testa, troca os textos
                pelos seus e só então pensa em ligar o WhatsApp de verdade.
              </p>
            </div>
            <Link
              href="/comecar"
              className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "h-11 px-5")}
            >
              Quero criar o meu
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
