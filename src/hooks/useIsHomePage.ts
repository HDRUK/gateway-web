"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

export function useIsHomePage(isIframe: boolean): boolean {
    const pathname = usePathname();
    const locale = useLocale();

    if (isIframe) {
        return false;
    }

    return pathname === `/${locale}`;
}
