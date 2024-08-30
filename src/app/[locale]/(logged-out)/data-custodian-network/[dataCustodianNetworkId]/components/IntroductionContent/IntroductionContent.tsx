"use client";

import { InView } from "react-intersection-observer";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

const TRANSLATION_PATH =
    "pages.dataCustodianNetwork.components.IntroductionContent";

export interface IntroductionContentProps {
    content: string | null;
    anchorIndex: number;
}

export default function IntroductionContent({
    content,
    anchorIndex,
}: IntroductionContentProps) {
    const router = useRouter();
    const path = usePathname();
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <InView
            style={{ gap: "8px" }}
            id={`anchor${anchorIndex}`}
            threshold={1}
            as="div"
            onChange={inView => {
                if (inView && path) {
                    router.replace(`${path}?section=${anchorIndex}`, {
                        scroll: false,
                    });
                }
            }}>
            <Typography variant="h3" style={{ minHeight: "46px" }}>{`${t(
                "heading"
            )}`}</Typography>
            <Typography style={{ paddingBottom: "8px" }}>{content}</Typography>
        </InView>
    );
}
