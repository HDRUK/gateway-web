"use client";

import { useMemo } from "react";
import { LegendStatus } from "@/interfaces/FormLegend";
import { QuestionBankSection } from "@/interfaces/QuestionBankSection";
import FormLegend from "@/components/FormLegend";
import { MessagesIcon } from "@/consts/customIcons";

type SectionCount = { sectionId: number; count: number };

interface Props {
    sectionId: number;
    sections: QuestionBankSection[];
    sectionCounts: SectionCount[];
    handleLegendClick?: (itemIndex: number) => void;
}

const buildMenu = (
    s: QuestionBankSection,
    sections: QuestionBankSection[],
    sectionId: number,
    sectionCounts: SectionCount[]
) => {
    const findSubSections = (s: QuestionBankSection) =>
        sections?.filter(sub => sub.parent_section === s.id);

    return {
        id: s.id,
        name: s.name,
        status:
            s.id === sectionId ? LegendStatus.ACTIVE : LegendStatus.UNTOUCHED,
        subItems: findSubSections(s).map(sub => ({
            id: sub.id,
            name: sub.name,
            count: sectionCounts?.[sub.id] ?? 0,
            status:
                sub.id === sectionId
                    ? LegendStatus.ACTIVE
                    : LegendStatus.UNTOUCHED,
        })),
        icon: s.name === "Messages" ? MessagesIcon : undefined,
    };
};

const Sections = ({
    sections,
    sectionId,
    sectionCounts,
    handleLegendClick,
}: Props) => {
    const legendItems = useMemo(() => {
        return (
            sections
                ?.filter(s => s.parent_section === null)
                .map(s => buildMenu(s, sections, sectionId, sectionCounts)) ||
            []
        );
    }, [sections, sectionId, sectionCounts]);

    return (
        <FormLegend
            items={legendItems}
            handleClickItem={handleLegendClick}
            removeMarginLeft
        />
    );
};

export default Sections;
