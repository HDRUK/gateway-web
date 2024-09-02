"use client";

import { InView } from "react-intersection-observer";
import { Link } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Tool } from "@/interfaces/Tool";
import { RouteName } from "@/consts/routeName";
import AccordionSection from "../AccordionSection";

const TRANSLATION_PATH = "pages.collection.components.ToolsContent";

export interface PublicationsContentProps {
    tools: Tool[];
    anchorIndex: number;
}

export default function ToolsContent({
    tools,
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
                disabled={!tools.length}
                heading={t("heading", {
                    length: tools.length,
                })}
                defaultExpanded={tools.length > 0}
                contents={tools.map(({ name, id }) => (
                    <Link
                        href={`/${RouteName.TOOL_ITEM}/${id}`}
                        key={`tool_${id}`}>
                        {name}
                    </Link>
                ))}
            />
        </InView>
    );
}
