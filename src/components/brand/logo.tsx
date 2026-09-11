import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold", className)}>
      <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
        <MessageCircle className="size-4 fill-current" />
      </span>
      AtendeZap
    </span>
  );
}
