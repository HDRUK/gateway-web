"use client";

import { Fragment } from "react";
import { Link, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { NetworkTool } from "@/interfaces/DataCustodianNetwork";
import AccordionSection from "@/components/AccordionSection";
import AccordionSectionSplit from "@/components/AccordionSectionSplit";
import { useControlledAccordion } from "@/hooks/useControllerAccordion";
import { RouteName } from "@/consts/routeName";
import { formatDate } from "@/utils/date";

export interface ToolsContentProps {
    tools: NetworkTool[];
    associatedTools?: NetworkTool[];
    anchorIndex: number;
    translationPath: string;
}

const TRANSLATION_PATH = ".components.ToolsContent";

export default function ToolsContent({
    tools,
    associatedTools,
    anchorIndex,
    translationPath,
}: ToolsContentProps) {
    const t = useTranslations(translationPath.concat(TRANSLATION_PATH));
    const accordionProps = useControlledAccordion(
        tools.length > 0 || (associatedTools?.length ?? 0) > 0
    );

    const renderCard = ({ name, id, created_at, user, team }: NetworkTool) => (
        <Fragment key={`tool_${id}`}>
            <Link href={`/${RouteName.TOOL_ITEM}/${id}`}>{name}</Link>
            {team && (
                <Link href={`/${RouteName.DATA_CUSTODIANS_ITEM}/${team.id}`}>
                    {team.name}
                </Link>
            )}
            {!!user && <div>{`${user.firstname} ${user.lastname}`}</div>}
            {!!created_at && (
                <Typography color="GrayText">
                    Created - {formatDate(created_at, "DD MMMM YYYY")}
                </Typography>
            )}
        </Fragment>
    );

    if (associatedTools === undefined) {
        return (
            <AccordionSection
                id={`anchor${anchorIndex}`}
                disabled={!tools.length}
                heading={t("heading", {
                    length: tools.length,
                })}
                title={t("title")}
                defaultExpanded={tools.length > 0}
                {...accordionProps}
                contents={tools.map(renderCard)}
            />
        );
    }

    return (
        <AccordionSectionSplit
            id={`anchor${anchorIndex}`}
            disabled={!tools.length && !associatedTools.length}
            heading={t("title")}
            ownedHeading={t("title")}
            ownedCount={tools.length}
            associatedHeading={t("associatedHeading")}
            associatedCount={associatedTools.length}
            ownedContents={tools.map(renderCard)}
            associatedContents={associatedTools.map(renderCard)}
            {...accordionProps}
        />
    );
}
