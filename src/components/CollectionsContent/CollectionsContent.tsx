"use client";

import { useTranslations } from "next-intl";
import { Collection } from "@/interfaces/Collection";
import AccordionSection from "@/components/AccordionSection";
import { RouteName } from "@/consts/routeName";
import CardStacked from "../CardStacked";

export interface CollectionsContentProps {
    collections: Collection[];
    anchorIndex: number;
    translationPath: string;
}

const TRANSLATION_PATH = ".components.CollectionsContent";

export default function CollectionsContent({
    collections,
    anchorIndex,
    translationPath,
}: CollectionsContentProps) {
    const t = useTranslations(translationPath.concat(TRANSLATION_PATH));

    return (
        <AccordionSection
            id={`anchor${anchorIndex}`}
            disabled={!collections.length}
            heading={t("heading", {
                length: collections.length,
            })}
            defaultExpanded={collections.length > 0}
            contents={collections.map(({ name, id, image_link }) => (
                <CardStacked
                    href={`/${RouteName.COLLECTION_ITEM}/${id}`}
                    title={name}
                    imgUrl={image_link}
                />
            ))}
        />
    );
}
