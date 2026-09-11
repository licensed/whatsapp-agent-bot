import { Wizard } from "./wizard";

function clampStep(value: string | undefined) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  if (parsed > 4) return 4;
  return parsed;
}

export default async function ComecarPage({
  searchParams,
}: PageProps<"/comecar">) {
  const params = await searchParams;
  const passo = Array.isArray(params.passo) ? params.passo[0] : params.passo;
  return <Wizard step={clampStep(passo)} />;
}
