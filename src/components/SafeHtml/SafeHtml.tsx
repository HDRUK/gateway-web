"use client";

import { useEffect, useState } from "react";
import { SxProps } from "@mui/material";
import Typography from "@mui/material/Typography";
import { sanitiseHtml } from "@/utils/santiseHtml";

export default function SafeHtml({
    html,
    sx,
    component,
}: {
    html: string;
    sx: SxProps;
    component: React.ElementType;
}) {
    const [safe, setSafe] = useState<string>("");

    useEffect(() => {
        let alive = true;

        sanitiseHtml(html).then(s => {
            if (alive) setSafe(s);
        });

        return () => {
            alive = false;
        };
    }, [html]);

    return (
        <Typography
            sx={sx}
            component={component}
            dangerouslySetInnerHTML={{ __html: safe }}
        />
    );
}
