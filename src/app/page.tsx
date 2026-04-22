import { MathKbHome } from "@/components/mathkb/MathKbHome";
import { PortfolioHome } from "@/components/PortfolioHome";
import { getMathKbHomeState } from "@/lib/mathkb/service";
import { getEffectiveVariant } from "@/lib/site-config";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  
  // getEffectiveVariant will check cookies
  let variant = await getEffectiveVariant();
  
  // Allow temporary override via query param
  if (resolvedSearchParams.v === "mathkb") variant = "mathkb";
  if (resolvedSearchParams.v === "portfolio") variant = "portfolio";

  if (variant !== "mathkb") {
    return <PortfolioHome />;
  }

  const state = await getMathKbHomeState(resolvedSearchParams);

  return <MathKbHome state={state} />;
}
