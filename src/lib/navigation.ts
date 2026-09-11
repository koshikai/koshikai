export const primaryNav = [
  { label: "Works", href: "/works" },
  { label: "Engineering", href: "/engineering" },
  { label: "Research", href: "/research" },
  { label: "About", href: "/about" },
] as const;

/** 現在地が href そのもの、またはその配下なら active とみなす */
export function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
