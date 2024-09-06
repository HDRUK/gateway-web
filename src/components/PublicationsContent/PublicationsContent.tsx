"use client";

import { Fragment } from "react";
import { InView } from "react-intersection-observer";
import { Link, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Publication } from "@/interfaces/Publication";
import AccordionSection from "@/components/AccordionSection";

export interface PublicationsContentProps {
    publications: Publication[];
    anchorIndex: number;
    page: string;
}

export default function PublicationContent({
    publications,
    anchorIndex,
    page,
}: PublicationsContentProps) {
    const router = useRouter();
    const path = usePathname();
    const TRANSLATION_PATH = `pages.${page}.components.PublicationsContent`;

    const t = useTranslations(TRANSLATION_PATH);

    return (
        <InView
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
            <AccordionSection
                disabled={!publications.length}
                heading={t("heading", {
                    length: publications.length,
                })}
                defaultExpanded={publications.length > 0}
                contents={publications.map(({ paper_title, authors, url }) => (
                    <Fragment key={`publication_${paper_title}`}>
                        <Link href={url}>{paper_title}</Link>
                        {authors && <div>{authors}</div>}
                        {true && (
                            <Typography color="GrayText">
                                LINK TYPE HERE - when BE supports it
                            </Typography>
                        )}
                    </Fragment>
                ))}
            />
        </InView>
    );
}
