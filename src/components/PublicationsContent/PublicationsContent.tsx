"use client";

import { Fragment } from "react";
import { Link } from "@mui/material";
import { useTranslations } from "next-intl";
import { Publication } from "@/interfaces/Publication";
import AccordionSection from "@/components/AccordionSection";

export interface PublicationsContentProps {
    publications: Publication[];
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

    return (
        <AccordionSection
            id={`anchor${anchorIndex}`}
            disabled={!publications.length}
            heading={t("heading", {
                length: publications.length,
            })}
            defaultExpanded={publications.length > 0}
            contents={publications.map(
                ({ paper_title, authors, url, year_of_publication }) => (
                    <Fragment key={`publication_${paper_title}`}>
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
