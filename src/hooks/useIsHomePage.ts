"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

export function useIsHomePage(isIframe: boolean): boolean {
    if (isIframe) {
        return false;
    }

    const pathname = usePathname();
    const locale = useLocale();

    return pathname === `/${locale}`;
}
