"use client";

import { Fragment } from "react";
import { InView } from "react-intersection-observer";
import { Link, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Publication } from "@/interfaces/Publication";
import { RouteName } from "@/consts/routeName";
import AccordionSection from "../AccordionSection";

const TRANSLATION_PATH = "pages.dataCustodian.components.PublicationsContent";

export interface PublicationsContentProps {
    publications: Publication[];
    anchorIndex: number;
}

export default function PublicationContent({
    publications,
    anchorIndex,
}: PublicationsContentProps) {
    const router = useRouter();
    const path = usePathname();
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
