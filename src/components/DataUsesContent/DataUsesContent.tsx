"use client";

import { Fragment } from "react";
import { InView } from "react-intersection-observer";
import { Link } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { DataUse } from "@/interfaces/DataUse";
import { RouteName } from "@/consts/routeName";
import AccordionSection from "../AccordionSection";

export interface DataUsesContentProps {
    datauses: DataUse[];
    anchorIndex: number;
    translationPath: string;
}

const TRANSLATION_PATH = ".components.DatausesContent";

export default function DataUsesContent({
    datauses,
    anchorIndex,
    translationPath,
}: DataUsesContentProps) {
    const router = useRouter();
    const path = usePathname();

    const t = useTranslations(translationPath.concat(TRANSLATION_PATH));

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
                defaultExpanded={datauses.length > 0}
                contents={datauses.map(
                    ({ project_title, organisation_name, id }) => (
                        <Fragment key={`dataUse_${id}`}>
                            <Link href={`/${RouteName.DATA_USE_ITEM}/${id}`}>
                                {project_title}
                            </Link>
                            <div>{organisation_name}</div>
                        </Fragment>
                    )
                )}
            />
        </InView>
    );
}
