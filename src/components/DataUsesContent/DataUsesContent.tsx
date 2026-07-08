"use client";

import { Fragment } from "react";
import { Link, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { NetworkDur } from "@/interfaces/DataCustodianNetwork";
import AccordionSectionSplit from "@/components/AccordionSectionSplit";
import { useControlledAccordion } from "@/hooks/useControllerAccordion";
import { RouteName } from "@/consts/routeName";
import AccordionSection from "../AccordionSection";

export interface DataUsesContentProps {
    datauses: NetworkDur[];
    associatedDatauses?: NetworkDur[];
    anchorIndex: number;
    translationPath: string;
}

const TRANSLATION_PATH = ".components.DatausesContent";

export default function DataUsesContent({
    datauses,
    associatedDatauses,
    anchorIndex,
    translationPath,
}: DataUsesContentProps) {
    const t = useTranslations(translationPath.concat(TRANSLATION_PATH));
    const accordionProps = useControlledAccordion(
        datauses.length > 0 || (associatedDatauses?.length ?? 0) > 0
    );

    const renderCard = ({
        project_title,
        organisation_name,
        id,
        team,
    }: NetworkDur) => (
        <Fragment key={`dataUse_${id}`}>
            <Link href={`/${RouteName.DATA_USE_ITEM}/${id}`}>
                {project_title}
            </Link>
            {team && (
                <Link href={`/${RouteName.DATA_CUSTODIANS_ITEM}/${team.id}`}>
                    {team.name}
                </Link>
            )}
            <Typography variant="body2">{organisation_name}</Typography>
        </Fragment>
    );

    if (associatedDatauses === undefined) {
        return (
            <AccordionSection
                id={`anchor${anchorIndex}`}
                disabled={!datauses.length}
                heading={t("heading", {
                    length: datauses.length,
                })}
                defaultExpanded={datauses.length > 0}
                {...accordionProps}
                contents={datauses.map(renderCard)}
            />
        );
    }

    return (
        <AccordionSectionSplit
            id={`anchor${anchorIndex}`}
            disabled={!datauses.length && !associatedDatauses.length}
            heading={t("title")}
            ownedHeading={t("title")}
            ownedCount={datauses.length}
            associatedHeading={t("associatedHeading")}
            associatedCount={associatedDatauses.length}
            ownedContents={datauses.map(renderCard)}
            associatedContents={associatedDatauses.map(renderCard)}
            {...accordionProps}
        />
    );
}
