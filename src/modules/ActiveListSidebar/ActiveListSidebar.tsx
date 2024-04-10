"use client";

import { useCallback, useEffect, useState } from "react";
import { toNumber } from "lodash";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
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
    const searchParams = useSearchParams();

    const [activeItem, setActiveItem] = useState(1);

    useEffect(() => {
        if (!searchParams) {
            return;
        }

        const sectionInView = searchParams.get("section");
        if (sectionInView) {
            setActiveItem(toNumber(sectionInView));
        }
    }, [searchParams]);

    const handleScroll = useCallback((id: number) => {
        const section = document.querySelector(`#anchor${id}`);
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
            setActiveItem(id);
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
