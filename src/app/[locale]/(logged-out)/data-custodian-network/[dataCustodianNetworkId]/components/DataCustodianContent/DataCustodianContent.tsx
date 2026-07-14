"use client";

import { Fragment } from "react";
import { Link, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { DataProvider as DataCustodians } from "@/interfaces/DataProvider";
import AccordionSectionSplit from "@/components/AccordionSectionSplit";
import Box from "@/components/Box";
import { RouteName } from "@/consts/routeName";

const TRANSLATION_PATH =
    "pages.dataCustodianNetwork.components.DataCustodianContent";

interface DataCustodianContentProps {
    dataCustodians: DataCustodians[];
    anchorIndex: number;
}

export default function DataCustodianContent({
    dataCustodians,
    anchorIndex,
}: DataCustodianContentProps) {
    const t = useTranslations(TRANSLATION_PATH);

    const renderCard = ({
        name,
        id,
        datasets_count,
        publications_count,
        tools_count,
        collections_count,
        durs_count,
    }: DataCustodians) => (
        <Fragment key={`data-custodian-${id}`}>
            <Link href={`/${RouteName.DATA_CUSTODIANS_ITEM}/${id}`}>
                {name}
            </Link>
            <Box
                sx={{
                    p: 0,
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                }}>
                <Typography>
                    {t("datasets", { length: datasets_count ?? 0 })}
                </Typography>
                <Typography>
                    {t("datause", { length: durs_count ?? 0 })}
                </Typography>
                <Typography>
                    {t("tools", { length: tools_count ?? 0 })}
                </Typography>
                <Typography>
                    {t("publications", { length: publications_count ?? 0 })}
                </Typography>
                <Typography>
                    {t("collections", { length: collections_count ?? 0 })}
                </Typography>
            </Box>
        </Fragment>
    );

    return (
        <AccordionSectionSplit
            id={`anchor${anchorIndex}`}
            disabled={!dataCustodians.length}
            heading={t("title")}
            ownedHeading={t("title")}
            ownedCount={dataCustodians.length}
            defaultExpanded={dataCustodians.length > 0}
            ownedContents={dataCustodians.map(renderCard)}
        />
    );
}
