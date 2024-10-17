"use client";

import { Fragment } from "react";
import { Link, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { ReducedTool, Tool } from "@/interfaces/Tool";
import AccordionSection from "@/components/AccordionSection";
import { RouteName } from "@/consts/routeName";
import { formatDate } from "@/utils/date";

export interface ToolsContentProps {
    tools: Tool[] | ReducedTool[];
    anchorIndex: number;
    translationPath: string;
}

const TRANSLATION_PATH = ".components.ToolsContent";

export default function ToolsContent({
    tools,
    anchorIndex,
    translationPath,
}: ToolsContentProps) {
    const t = useTranslations(translationPath.concat(TRANSLATION_PATH));

    return (
        <AccordionSection
            id={`anchor${anchorIndex}`}
            disabled={!tools.length}
            heading={t("heading", {
                length: tools.length,
            })}
            defaultExpanded={tools.length > 0}
            contents={tools.map(({ name, id, created_at, user }) => (
                <Fragment key={`tool_${id}`}>
                    <Link href={`/${RouteName.TOOL_ITEM}/${id}`}>{name}</Link>
                    {!!user && (
                        <div>{`${user.firstname} ${user.lastname}`}</div>
                    )}
                    {!!created_at && (
                        <Typography color="GrayText">
                            Created - {formatDate(created_at, "DD MMMM YYYY")}
                        </Typography>
                    )}
                </Fragment>
            ))}
        />
    );
}
