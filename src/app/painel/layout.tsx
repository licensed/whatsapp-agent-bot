import { AppShell } from "@/components/painel/app-shell";

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
