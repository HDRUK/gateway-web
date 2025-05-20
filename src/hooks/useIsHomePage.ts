"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

export function useIsHomePage(): boolean {
    const pathname = usePathname();
    const locale = useLocale();

    return pathname === `/${locale}`;
}
