"use client";

import { Fragment } from "react";
import { Link } from "@mui/material";
import { useTranslations } from "next-intl";
import { DataUse, ReducedDataUse } from "@/interfaces/DataUse";
import { RouteName } from "@/consts/routeName";
import AccordionSection from "../AccordionSection";

export interface DataUsesContentProps {
    datauses: DataUse[] | ReducedDataUse[];
    anchorIndex: number;
    translationPath: string;
}

const TRANSLATION_PATH = ".components.DatausesContent";

export default function DataUsesContent({
    datauses,
    anchorIndex,
    translationPath,
}: DataUsesContentProps) {
    const t = useTranslations(translationPath.concat(TRANSLATION_PATH));

    return (
        <AccordionSection
            id={`anchor${anchorIndex}`}
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
    );
}
