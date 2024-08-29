"use client";

import { Fragment } from "react";
import { InView } from "react-intersection-observer";
import { Link, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Tool } from "@/interfaces/Tool";
import { RouteName } from "@/consts/routeName";
import { formatDate } from "@/utils/date";
import AccordionSection from "../AccordionSection";

const TRANSLATION_PATH = "pages.dataCustodian.components.ToolsContent";

export interface ToolsContentProps {
    tools: Tool[];
    anchorIndex: number;
}

export default function ToolsContent({
    tools,
    anchorIndex,
}: ToolsContentProps) {
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
                disabled={!tools.length}
                heading={t("heading", {
                    length: tools.length,
                })}
                defaultExpanded={tools.length}
                contents={tools.map(({ name, id, created_at, user }) => (
                    <Fragment key={`tool_${id}`}>
                        <Link href={`/${RouteName.TOOL_ITEM}/${id}`}>
                            {name}
                        </Link>
                        <div>{`${user.firstname} ${user.lastname}`}</div>
                        <Typography color="GrayText">
                            Created - {formatDate(created_at, "DD MMMM YYYY")}
                        </Typography>
                    </Fragment>
                ))}
            />
        </InView>
    );
}
