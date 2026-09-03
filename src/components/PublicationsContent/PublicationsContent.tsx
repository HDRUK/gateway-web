"use client";

import { Fragment } from "react";
import { Link } from "@mui/material";
import { useTranslations } from "next-intl";
import { NetworkPublication } from "@/interfaces/DataCustodianNetwork";
import AccordionSection from "@/components/AccordionSection";
import AccordionSectionSplit from "@/components/AccordionSectionSplit";
import { useControlledAccordion } from "@/hooks/useControllerAccordion";
import { RouteName } from "@/consts/routeName";

export interface PublicationsContentProps {
    publications: NetworkPublication[];
    associatedPublications?: NetworkPublication[];
    anchorIndex: number;
    translationPath: string;
}

const TRANSLATION_PATH = ".components.PublicationsContent";

export default function PublicationContent({
    publications,
    associatedPublications,
    anchorIndex,
    translationPath,
}: PublicationsContentProps) {
    const t = useTranslations(translationPath.concat(TRANSLATION_PATH));
    const accordionProps = useControlledAccordion(
        publications.length > 0 || (associatedPublications?.length ?? 0) > 0
    );

    const renderCard = ({
        id,
        paper_title,
        authors,
        url,
        year_of_publication,
        team,
    }: NetworkPublication) => (
        <Fragment key={`publication_${id}`}>
            <Link component="a" href={url} target="_blank">
                {paper_title}
            </Link>
            {team && (
                <Link href={`/${RouteName.DATA_CUSTODIANS_ITEM}/${team.id}`}>
                    {team.name}
                </Link>
            )}
            {authors && <div>{authors}</div>}
            {year_of_publication && <div>{year_of_publication}</div>}
        </Fragment>
    );

    if (associatedPublications === undefined) {
        return (
            <AccordionSection
                id={`anchor${anchorIndex}`}
                disabled={!publications.length}
                heading={t("heading", {
                    length: publications.length,
                })}
                title={t("title")}
                {...accordionProps}
                contents={publications.map(renderCard)}
            />
        );
    }

    return (
        <AccordionSectionSplit
            id={`anchor${anchorIndex}`}
            disabled={!publications.length && !associatedPublications.length}
            heading={t("title")}
            ownedHeading={t("title")}
            ownedCount={publications.length}
            associatedHeading={t("associatedHeading")}
            associatedCount={associatedPublications.length}
            ownedContents={publications.map(renderCard)}
            associatedContents={associatedPublications.map(renderCard)}
            {...accordionProps}
        />
    );
}
