import { notesHome } from "@/components/notes/notesHome";
import { PortfolioHome } from "@/components/PortfolioHome";
import { getnotesHomeState } from "@/lib/notes/service";
import { getSiteVariant } from "@/lib/site-config";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Home({ searchParams }: HomePageProps) {
  if (getSiteVariant() !== "notes") {
    return <PortfolioHome />;
  }

  const resolvedSearchParams = await searchParams;
  const state = await getnotesHomeState(resolvedSearchParams);

  return <notesHome state={state} />;
}
