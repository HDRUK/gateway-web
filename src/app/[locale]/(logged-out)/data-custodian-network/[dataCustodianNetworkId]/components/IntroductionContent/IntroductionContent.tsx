"use client";

import { InView } from "react-intersection-observer";
import { Typography } from "@mui/material";
import Markdown from "markdown-to-jsx";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { DataCustodianNetwork } from "@/interfaces/DataCustodianNetwork";
import DataCustodianLinks from "@/components/DataCustodianLinks";

const TRANSLATION_PATH =
    "pages.dataCustodianNetwork.components.IntroductionContent";

export interface IntroductionContentProps {
    networkData: DataCustodianNetwork;
    anchorIndex: number;
}

export default function IntroductionContent({
    networkData,
    anchorIndex,
}: IntroductionContentProps) {
    const router = useRouter();
    const path = usePathname();
    const t = useTranslations(TRANSLATION_PATH);
    const { url, service, summary } = networkData;

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
            {summary && <Markdown sx={{ pb: 1 }}>{summary}</Markdown>}
            <DataCustodianLinks
                data={{
                    url,
                    service,
                }}
                sx={{ mb: 2 }}
            />
        </InView>
    );
}
