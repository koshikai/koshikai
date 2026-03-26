import { MathKbHome } from "@/components/mathkb/MathKbHome";
import { PortfolioHome } from "@/components/PortfolioHome";
import { getMathKbHomeState } from "@/lib/mathkb/service";
import { getSiteVariant } from "@/lib/site-config";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Home({ searchParams }: HomePageProps) {
  if (getSiteVariant() !== "mathkb") {
    return <PortfolioHome />;
  }

  const resolvedSearchParams = await searchParams;
  const state = await getMathKbHomeState(resolvedSearchParams);

  return <MathKbHome state={state} />;
}
