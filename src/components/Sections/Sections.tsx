"use client";

import { useEffect, useState } from "react";
import { LegendItem, LegendStatus } from "@/interfaces/FormLegend";
import { QuestionBankSection } from "@/interfaces/QuestionBankSection";
import FormLegend from "@/components/FormLegend";
import { MessagesIcon } from "@/consts/customIcons";

interface Props {
    sectionId: number;
    sections: QuestionBankSection[];
    handleLegendClick?: (itemIndex: number) => void;
}

const Sections = ({ sections, sectionId, handleLegendClick }: Props) => {
    const [legendItems, setLegendItems] = useState<LegendItem[]>([]);

    useEffect(() => {
        const findSubSections = (s: QuestionBankSection) =>
            sections?.filter(sub => sub.parent_section === s.id);

        const buildMenu = (s: QuestionBankSection) => {
            return {
                id: s.id,
                name: s.name,
                status:
                    s.id === sectionId
                        ? LegendStatus.ACTIVE
                        : LegendStatus.UNTOUCHED,
                subItems: findSubSections(s).map(sub => ({
                    id: sub.id,
                    name: sub.name,
                    status:
                        sub.id === sectionId
                            ? LegendStatus.ACTIVE
                            : LegendStatus.UNTOUCHED,
                })),
                icon: s.name === "Messages" ? MessagesIcon : undefined,
            };
        };
        const data =
            sections
                ?.filter(s => s.parent_section === null)
                .map(s => buildMenu(s)) || [];

        setLegendItems(data);
    }, [sections, sectionId]);

    return (
        <FormLegend
            items={legendItems}
            handleClickItem={handleLegendClick}
            removeMarginLeft
        />
    );
};

export default Sections;
