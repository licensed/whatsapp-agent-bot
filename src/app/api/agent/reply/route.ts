import { replyAsAgent } from "@/lib/agent";
import { createDefaultAgent } from "@/lib/templates";
import type { AgentConfig, ChatMessage } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { text?: string; agent?: AgentConfig; history?: ChatMessage[] }
    | null;

  if (!body?.text) {
    return Response.json(
      { error: "Envie um JSON com o campo text." },
      { status: 400 },
    );
  }

  const agent = body.agent ?? createDefaultAgent("pizzaria");
  const reply = replyAsAgent(agent, body.text, body.history ?? []);
  return Response.json(reply);
}
