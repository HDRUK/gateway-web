"use client";

import { useCallback } from "react";

export default function useTextFilter() {
    const makeTextFilter = useCallback(
        <T>(keys: (keyof T | string)[], query: string) => {
            const terms = (query ?? "")
                .trim()
                .toLowerCase()
                .split(/\s+/)
                .filter(Boolean);

            if (terms.length === 0) {
                return () => true;
            }

            return (item: T) =>
                terms.every(term =>
                    keys.some(k => {
                        const value = (item as Record<string, unknown>)[
                            String(k)
                        ];
                        const text = Array.isArray(value)
                            ? value.join(" ")
                            : String(value ?? "");
                        return text.toLowerCase().includes(term);
                    })
                );
        },
        []
    );

    return { makeTextFilter };
}
