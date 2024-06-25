"use client";

import { InView } from "react-intersection-observer";
import { Link } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Collection } from "@/interfaces/Collection";
import { RouteName } from "@/consts/routeName";
import AccordionSection from "../AccordionSection";

const TRANSLATION_PATH = "pages.tool.components.CollectionsContent";

export interface CollectionsContentProps {
    collections: Collection[];
    anchorIndex: number;
}

export default function CollectionsContent({
    collections,
    anchorIndex,
}: CollectionsContentProps) {
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
                disabled={!collections.length}
                heading={t("heading", {
                    length: collections.length,
                })}
                contents={collections.map(({ name, description, id }) => (
                    <>
                        <Link href={`/${RouteName.DATA_USE_ITEM}/${id}`}>
                            {name}
                        </Link>
                        <div>{description}</div>
                    </>
                ))}
            />
        </InView>
    );
}
