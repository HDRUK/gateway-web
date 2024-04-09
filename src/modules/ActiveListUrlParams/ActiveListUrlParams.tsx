"use client";

import { useCallback, useEffect, useState } from "react";
import { toNumber } from "lodash";
import { useSearchParams } from "next/navigation";
import ActiveList from "@/components/ActiveList";

const ActiveListUrlParams = ({
    items,
}: {
    items: {
        label: string;
    }[];
}) => {
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
        <ActiveList
            items={items}
            handleClick={handleScroll}
            activeItem={activeItem}
        />
    );
};

export default ActiveListUrlParams;
