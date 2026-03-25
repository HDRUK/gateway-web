"use client";

import { usePathname } from "next/navigation";

export function useIsHomePage(isIframe?: boolean): boolean {
    const pathname = usePathname();

    if (isIframe || !pathname) {
        return false;
    }

    // Remove leading/trailing slashes and split into segments
    const segments = pathname.split("/").filter(Boolean);

    return segments.length === 1;
}
