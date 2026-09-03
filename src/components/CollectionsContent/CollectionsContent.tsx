"use client";

import { useTranslations } from "next-intl";
import { NetworkCollection } from "@/interfaces/DataCustodianNetwork";
import AccordionSection from "@/components/AccordionSection";
import AccordionSectionSplit from "@/components/AccordionSectionSplit";
import { useControlledAccordion } from "@/hooks/useControllerAccordion";
import { RouteName } from "@/consts/routeName";
import CardStacked from "../CardStacked";

export interface CollectionsContentProps {
    collections: NetworkCollection[];
    associatedCollections?: NetworkCollection[];
    anchorIndex: number;
    translationPath: string;
}

const TRANSLATION_PATH = ".components.CollectionsContent";

const COLLECTION_CARD_HEIGHT = 200;
const COLLECTION_VISIBLE_ROWS = 2;

export default function CollectionsContent({
    collections,
    associatedCollections,
    anchorIndex,
    translationPath,
}: CollectionsContentProps) {
    const t = useTranslations(translationPath.concat(TRANSLATION_PATH));
    const accordionProps = useControlledAccordion(
        collections.length > 0 || (associatedCollections?.length ?? 0) > 0
    );

    const renderCard = ({ name, id, image_link }: NetworkCollection) => (
        <CardStacked
            href={`/${RouteName.COLLECTION_ITEM}/${id}`}
            title={name}
            imgUrl={image_link}
            key={`collection_${id}`}
        />
    );

    const renderFixedHeightCard = (collection: NetworkCollection) => (
        <CardStacked
            href={`/${RouteName.COLLECTION_ITEM}/${collection.id}`}
            title={collection.name}
            imgUrl={collection.image_link}
            boxStackedProps={{
                sx: {
                    height: "100%",
                },
            }}
            key={`collection_${collection.id}`}
        />
    );

    if (associatedCollections === undefined) {
        return (
            <AccordionSection
                id={`anchor${anchorIndex}`}
                disabled={!collections.length}
                heading={t("heading", {
                    length: collections.length,
                })}
                title={t("title")}
                {...accordionProps}
                contents={collections.map(renderCard)}
            />
        );
    }

    return (
        <AccordionSectionSplit
            id={`anchor${anchorIndex}`}
            disabled={!collections.length && !associatedCollections.length}
            heading={t("title")}
            ownedHeading={t("title")}
            ownedCount={collections.length}
            associatedHeading={t("associatedHeading")}
            associatedCount={associatedCollections.length}
            ownedContents={collections.map(renderFixedHeightCard)}
            associatedContents={associatedCollections.map(
                renderFixedHeightCard
            )}
            cardHeight={COLLECTION_CARD_HEIGHT}
            visibleRows={COLLECTION_VISIBLE_ROWS}
            disableCardWrapper
            {...accordionProps}
        />
    );
}
