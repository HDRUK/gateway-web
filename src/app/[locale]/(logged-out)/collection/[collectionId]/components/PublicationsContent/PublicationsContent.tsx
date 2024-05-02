"use client";

import { InView } from "react-intersection-observer";
import { Link } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Publication } from "@/interfaces/Publication";
import AccordionSection from "../AccordionSection";

const TRANSLATION_PATH = "pages.collection.components.PublicationsContent";

export interface PublicationsContentProps {
    publications: Publication[];
    anchorIndex: number;
}

export default function DatasetContent({
    publications,
    anchorIndex,
}: PublicationsContentProps) {
    const router = useRouter();
    const path = usePathname();
    const t = useTranslations(TRANSLATION_PATH);

    console.log("publications", publications);

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
                contents={publications.map(
                    ({ paper_title, authors, url, year_of_publication }) => (
                        <>
                            <Link component="a" href={url} target="_blank">
                                {paper_title}
                            </Link>
                            {authors && <div>{authors}</div>}
                            {year_of_publication && (
                                <div>{year_of_publication}</div>
                            )}
                        </>
                    )
                )}
            />
        </InView>
    );
}
