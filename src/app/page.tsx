import { notesHome } from "@/components/notes/notesHome";
import { PortfolioHome } from "@/components/PortfolioHome";
import { getnotesHomeState } from "@/lib/notes/service";
import { getEffectiveVariant } from "@/lib/site-config";

interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  
  // getEffectiveVariant will check cookies
  let variant = await getEffectiveVariant();
  
  // Allow temporary override via query param
  if (resolvedSearchParams.v === "notes") variant = "notes";
  if (resolvedSearchParams.v === "portfolio") variant = "portfolio";

  if (variant !== "notes") {
    return <PortfolioHome />;
  }

  const state = await getnotesHomeState(resolvedSearchParams);

  return <notesHome state={state} />;
}
