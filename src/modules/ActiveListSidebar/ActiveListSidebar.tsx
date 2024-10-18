"use client";

import { useCallback, useState, useEffect } from "react";
import { toNumber } from "lodash";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
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

    const searchParams = useSearchParams();
    const isDatasetPage = usePathname()?.includes("dataset");

    useEffect(() => {
        if (!searchParams) {
            return;
        }

        if (isDatasetPage) {
            const sectionInView = searchParams.get("section");
            if (sectionInView) {
                setActiveItem(toNumber(sectionInView));
            }
        }
    }, [searchParams]);

    const handleScroll = useCallback((id: number) => {
        const section = document.querySelector(`#anchor${id}`);
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
            setActiveItem(id);
            if (!isDatasetPage) {
                setTimeout(() => {
                    setActiveItem(0);
                }, 200);
            }
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
