"use client";

import { InView } from "react-intersection-observer";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Collection } from "@/interfaces/Collection";
import AccordionSection from "@/components/AccordionSection";
import { RouteName } from "@/consts/routeName";
import CardStacked from "../CardStacked/CardStacked";

const TRANSLATION_PATH = "pages.dataCustodian.components.CollectionsContent";

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
                contents={collections.map(({ name, id, image_link }) => (
                    <CardStacked
                        href={`${RouteName.COLLECTION_ITEM}/${id}`}
                        title={name}
                        imgUrl={image_link}
                    />
                ))}
            />
        </InView>
    );
}
