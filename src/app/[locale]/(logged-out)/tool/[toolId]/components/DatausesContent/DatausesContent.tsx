"use client";

import { InView } from "react-intersection-observer";
import { Link } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { DataUse } from "@/interfaces/DataUse";
import { RouteName } from "@/consts/routeName";
import AccordionSection from "../AccordionSection";

const TRANSLATION_PATH = "pages.tool.components.DatausesContent";

export interface DatausesContentProps {
    datauses: DataUse[];
    anchorIndex: number;
}

export default function DatausesContent({
    datauses,
    anchorIndex,
}: DatausesContentProps) {
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
                disabled={!datauses.length}
                heading={t("heading", {
                    length: datauses.length,
                })}
                contents={datauses.map(
                    ({ project_title, organisation_name, id }) => (
                        <>
                            <Link href={`/${RouteName.DATA_USE_ITEM}/${id}`}>
                                {project_title}
                            </Link>
                            <div>{organisation_name}</div>
                        </>
                    )
                )}
            />
        </InView>
    );
}
