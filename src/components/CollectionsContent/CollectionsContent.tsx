"use client";

import { useTranslations } from "next-intl";
import { Collection } from "@/interfaces/Collection";
import { NetworkCollection } from "@/interfaces/DataCustodianNetwork";
import AccordionSection from "@/components/AccordionSection";
import { useControlledAccordion } from "@/hooks/useControllerAccordion";
import { RouteName } from "@/consts/routeName";
import CardStacked from "../CardStacked";

export interface CollectionsContentProps {
    collections: NetworkCollection[];
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
    const accordionProps = useControlledAccordion(collections.length > 0);
    return (
        <AccordionSection
            id={`anchor${anchorIndex}`}
            disabled={!collections.length}
            heading={t("heading", {
                length: collections.length,
            })}
            {...accordionProps}
            contents={collections.map(({ name, id, image_link }) => (
                <CardStacked
                    href={`/${RouteName.COLLECTION_ITEM}/${id}`}
                    title={name}
                    imgUrl={image_link}
                    key={`collection_${id}`}
                />
            ))}
        />
    );
}
