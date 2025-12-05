"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import useActionBar from "@/hooks/useActionBar";

const NavigationEvents = () => {
    const { hideBar, store } = useActionBar();
    const pathname = usePathname();
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return; // don’t hide on initial load
        }

        if (store.isVisible) {
            hideBar();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return null;
};

export default NavigationEvents;
