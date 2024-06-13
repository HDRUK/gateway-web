"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import useActionBar from "@/hooks/useActionBar";

const NavigationEvents = () => {
    const { hideBar, store } = useActionBar();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (store.isVisible) {
            hideBar();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, searchParams]);

    return null;
};

export default NavigationEvents;
