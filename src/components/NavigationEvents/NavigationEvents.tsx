"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import useActionBar from "@/hooks/useActionBar";

const NavigationEvents = () => {
    const { hideBar, store } = useActionBar();
    const pathname = usePathname();

    useEffect(() => {
        if (store.isVisible) {
            hideBar();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return null;
};

export default NavigationEvents;
