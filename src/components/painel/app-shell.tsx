"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Plug, Settings2, Menu } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

const NAV = [
  { href: "/painel", label: "Conversas", icon: MessageSquare },
  { href: "/painel/agente", label: "Meu agente", icon: Settings2 },
  { href: "/painel/conectar", label: "Ligar WhatsApp", icon: Plug },
];

function NavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active =
          item.href === "/painel"
            ? pathname === "/painel"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
              active
                ? "bg-emerald-700 text-white"
                : "text-emerald-50/80 hover:bg-white/10 hover:text-white",
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { state } = useStore();

  return (
    <div className="flex min-h-full bg-[#f4f7f4]">
      <aside className="hidden w-60 shrink-0 flex-col bg-emerald-900 p-4 text-white md:flex">
        <Link href="/" className="mb-8 text-white">
          <Logo />
        </Link>
        <NavLinks />
        <div className="mt-auto rounded-xl bg-white/10 p-3 text-xs leading-5 text-emerald-50">
          <p className="font-semibold">{state.agent.businessName}</p>
          <p>Agente {state.agent.agentName}</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 md:hidden">
          <Logo />
          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" />}
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="bg-emerald-900 p-4 text-white">
              <SheetHeader>
                <SheetTitle className="text-white">Menu</SheetTitle>
              </SheetHeader>
              <NavLinks />
            </SheetContent>
          </Sheet>
        </header>
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
