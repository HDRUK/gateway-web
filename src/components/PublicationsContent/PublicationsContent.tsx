"use client";

import { Fragment, useState } from "react";
import { Link } from "@mui/material";
import { useTranslations } from "next-intl";
import AccordionSection from "@/components/AccordionSection";
import { NetworkPublication } from "@/interfaces/DataCustodianNetwork";
import { useControlledAccordion } from "@/hooks/useControllerAccordion";

export interface PublicationsContentProps {
    publications: NetworkPublication[];
    anchorIndex: number;
    translationPath: string;
}

const TRANSLATION_PATH = ".components.PublicationsContent";

export default function PublicationContent({
    publications,
    anchorIndex,
    translationPath,
}: PublicationsContentProps) {
    const t = useTranslations(translationPath.concat(TRANSLATION_PATH));
    const accordionProps = useControlledAccordion(publications.length > 0);
    return (
        <AccordionSection
            id={`anchor${anchorIndex}`}
            disabled={!publications.length}
            heading={t("heading", {
                length: publications.length,
            })}
            {...accordionProps}
            contents={publications.map(
                ({ id, paper_title, authors, url, year_of_publication }) => (
                    <Fragment key={`publication_${id}`}>
                        <Link component="a" href={url} target="_blank">
                            {paper_title}
                        </Link>
                        {authors && <div>{authors}</div>}
                        {year_of_publication && (
                            <div>{year_of_publication}</div>
                        )}
                    </Fragment>
                )
            )}
        />
    );
}
