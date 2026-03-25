"use client";

import { useEffect, useState } from "react";

export function Widget({
    teamId,
    endpoint,
}: {
    teamId: string;
    endpoint: string;
}) {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const res = await fetch(
                    `${endpoint.replace(/\/$/, "")}/${encodeURIComponent(
                        teamId
                    )}`,
                    {
                        headers: { accept: "text/plain" },
                        mode: "cors",
                        cache: "no-store",
                    }
                );
                const t = await res.text();
                if (alive) setText(t);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, [teamId, endpoint]);

    return <span>{loading ? "Loading…" : text}</span>;
}
