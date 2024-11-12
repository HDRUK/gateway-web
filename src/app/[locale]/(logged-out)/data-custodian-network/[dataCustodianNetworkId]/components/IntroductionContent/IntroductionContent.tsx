"use client";

import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { DataCustodianNetwork } from "@/interfaces/DataCustodianNetwork";
import DataCustodianLinks from "@/components/DataCustodianLinks";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";

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
    const t = useTranslations(TRANSLATION_PATH);
    const { url, service, summary } = networkData;

    return (
        <div style={{ gap: "8px" }} id={`anchor${anchorIndex}`}>
            <Typography variant="h3" style={{ minHeight: "46px" }}>{`${t(
                "heading"
            )}`}</Typography>
            {summary && (
                <MarkDownSanitizedWithHtml sx={{ pb: 1 }} content={summary} />
            )}
            <DataCustodianLinks
                data={{
                    url,
                    service,
                }}
                sx={{ mb: 2 }}
            />
        </div>
    );
}
