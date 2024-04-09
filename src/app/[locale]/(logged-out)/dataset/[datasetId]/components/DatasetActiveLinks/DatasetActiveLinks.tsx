"use client";

import { useTranslations } from "next-intl";
import ActiveListUrlParams from "@/modules/ActiveListUrlParams";
import {
    ActiveLinkWrapper,
    BookmarkText,
    Wrapper,
} from "./DatasetActiveLinks.styles";

const TRANSLATION_PATH = "pages.dataset.components.ActiveLinks";

const DatasetActiveLinks = ({
    activeLinkList,
}: {
    activeLinkList: {
        label: string;
    }[];
}) => {
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <Wrapper>
            <BookmarkText>{t("bookmarks")}</BookmarkText>
            <ActiveLinkWrapper>
                <ActiveListUrlParams items={activeLinkList} />
            </ActiveLinkWrapper>
        </Wrapper>
    );
};

export default DatasetActiveLinks;
