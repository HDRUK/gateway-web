"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Tracks previous and current page using sessionStorage
export const useTrackPreviousPage = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const fullPath = `${pathname}${
        searchParams?.toString() ? searchParams.toString() : ""
    }`;

    useEffect(() => {
        const currentPage = sessionStorage.getItem("currentPage");

        if (currentPage && currentPage !== fullPath) {
            sessionStorage.setItem("previousPage", currentPage);
        }

        sessionStorage.setItem("currentPage", fullPath);
    }, [fullPath]);
};

export const getPreviousPage = () => {
    return sessionStorage.getItem("previousPage");
};
