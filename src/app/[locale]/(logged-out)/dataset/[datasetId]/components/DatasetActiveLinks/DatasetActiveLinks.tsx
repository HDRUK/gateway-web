"use client";

import { useEffect, useState } from "react";
import { toNumber } from "lodash";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import ActiveList from "@/components/ActiveList";
import Box from "@/components/Box";
import Typography from "@/components/Typography";

const TRANSLATION_PATH = "pages.dataset.components.ActiveLinks";

const DatasetContent = ({
    activeLinkList,
}: {
    activeLinkList: {
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

    const handleScroll = (id: number) => {
        const section = document.querySelector(`#anchor${id}`);
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
            setActiveItem(id);
        }
    };

    return (
        <Box sx={{ position: "sticky", top: 0, p: 0 }}>
            <Typography
                sx={{
                    p: 3,
                    pl: 1,
                    pr: 1,
                    borderBottom: 1,
                    borderColor: "greyCustom.main",
                    ml: 2,
                    mr: 2,
                }}>
                {t("bookmarks")}
            </Typography>
            <Box sx={{ pt: 0, pl: 3, pr: 3 }}>
                <ActiveList
                    items={activeLinkList}
                    handleClick={handleScroll}
                    activeItem={activeItem}
                />
            </Box>
        </Box>
    );
};

export default DatasetContent;
