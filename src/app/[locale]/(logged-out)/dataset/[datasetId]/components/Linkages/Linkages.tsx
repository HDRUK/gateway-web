"use client";

import { useTranslations } from "next-intl";
import { Dataset } from "@/interfaces/Dataset";
import Box from "@/components/Box";
import EllipsisCharacterLimit from "@/components/EllipsisCharacterLimit";
import Paper from "@/components/Paper";

const TRANSLATION_PATH = "pages.dataset.components.Linkages";

interface LinkagesProps {
    data: Dataset;
}

const Linkages = ({ data }: LinkagesProps) => {
    const { linked_dataset_versions } = data.versions[0];

    const linkageCounts = linked_dataset_versions.reduce<
        Record<string, number>
    >((counts, { pivot: { linkage_type } }) => {
        return {
            ...counts,
            [linkage_type]: (counts[linkage_type] || 0) + 1,
        };
    }, {} as Record<string, number>);

    const t = useTranslations(TRANSLATION_PATH);
    return (
        <Paper sx={{ borderRadius: 2, p: 2 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", p: 0 }} gap={1}>
                {Object.entries(linkageCounts).map(([type, count]) => (
                    <EllipsisCharacterLimit
                        isButton
                        text={t(type, { count })}
                    />
                ))}
            </Box>
        </Paper>
    );
};

export default Linkages;
