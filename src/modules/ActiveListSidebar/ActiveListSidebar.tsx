"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import ActiveList from "@/components/ActiveList";
import {
    ActiveLinkWrapper,
    BookmarkText,
    Wrapper,
} from "./ActiveListSidebar.styles";

const TRANSLATION_PATH = "modules.ActiveListSidebar";

const ActiveListSidebar = ({
    items,
}: {
    items: {
        label: string;
    }[];
}) => {
    const t = useTranslations(TRANSLATION_PATH);

    const [activeItem, setActiveItem] = useState(0);

    const handleScroll = useCallback((id: number) => {
        const section = document.querySelector(`#anchor${id}`);
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
            setActiveItem(id);
            setTimeout(() => {
                setActiveItem(0);
            }, 200);
        }
    }, []);

    return (
        <Wrapper>
            <BookmarkText>{t("bookmarks")}</BookmarkText>
            <ActiveLinkWrapper>
                <ActiveList
                    items={items}
                    handleClick={handleScroll}
                    activeItem={activeItem}
                />
            </ActiveLinkWrapper>
        </Wrapper>
    );
};

export default ActiveListSidebar;
