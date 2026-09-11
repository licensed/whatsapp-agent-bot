import { replyAsAgent } from "@/lib/agent";
import { createDefaultAgent } from "@/lib/templates";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN ?? "ATENDEZAP";

type WhatsAppPayload = {
  object?: string;
  entry?: {
    changes?: {
      value?: {
        messages?: { from?: string; text?: { body?: string }; type?: string }[];
        contacts?: { profile?: { name?: string } }[];
      };
    }[];
  }[];
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN && challenge) {
    return new Response(challenge, { status: 200 });
  }

  return Response.json(
    {
      ok: false,
      hint: "Use hub.mode=subscribe, hub.verify_token=ATENDEZAP e hub.challenge para o handshake da Meta.",
    },
    { status: 403 },
  );
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as WhatsAppPayload | null;
  const message = payload?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  const name =
    payload?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.profile?.name ??
    "Cliente";
  const text = message?.text?.body?.trim();

  if (!text) {
    return Response.json({ ok: true, ignored: true });
  }

  const agent = createDefaultAgent("pizzaria");
  const reply = replyAsAgent(agent, text);

  return Response.json({
    ok: true,
    from: message?.from ?? null,
    contact: name,
    incoming: text,
    reply,
    note: "Neste recorte o agente responde no JSON. Para enviar de volta ao WhatsApp, configure o token da Cloud API.",
  });
}
