"use client";

import { usePathname } from "next/navigation";
import { PersonalHeader } from "./personal/Header";
import { PortfolioHeader } from "./portfolio/Header";

export const Header = () => {
  const pathname = usePathname() ?? "";
  const isPersonalRoute =
    pathname.startsWith("/bio") ||
    pathname.startsWith("/musings") ||
    pathname.startsWith("/gallery");

  if (isPersonalRoute) {
    return <PersonalHeader pathname={pathname} />;
  }

  return <PortfolioHeader pathname={pathname} />;
};
