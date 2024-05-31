"use client";

import { useEffect, useState } from "react";
import { LegendItem, LegendStatus } from "@/interfaces/FormLegend";
import { QuestionBankSection } from "@/interfaces/QuestionBankSection";
import Box from "@/components/Box";
import Container from "@/components/Container";
import FormLegend from "@/components/FormLegend";
import Paper from "@/components/Paper";
import theme from "@/config/theme";

interface Props {
    sectionId: number;
    sections: QuestionBankSection[];
    handleLegendClick?: (itemIndex: number) => void;
}

const Sections = ({ sections, sectionId, handleLegendClick }: Props) => {
    const [legendItems, setLegendItems] = useState<LegendItem[]>([]);

    useEffect(() => {
        const findSubSections = (s: QuestionBankSection) =>
            sections?.filter(sub => sub.sub_section === s.name);

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
            };
        };
        const data =
            sections
                ?.filter(s => s.sub_section === null)
                .map(s => buildMenu(s)) || [];

        setLegendItems(data);
    }, [sections, sectionId]);

    return (
        <Paper sx={{ mx: 0, pr: 1 }}>
            <Container sx={{ pb: 2, p: 0, m: 0 }}>
                <Box
                    sx={{
                        mt: 2,
                        flex: 1,
                        padding: theme.spacing(0),
                    }}>
                    <FormLegend
                        items={legendItems}
                        handleClickItem={handleLegendClick}
                    />
                </Box>
            </Container>
        </Paper>
    );
};

export default Sections;
