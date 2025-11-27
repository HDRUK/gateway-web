"use client";

import { useTranslations } from "next-intl";
import { Linkage } from "@/interfaces/Dataset";
import Box from "@/components/Box";
import EllipsisCharacterLimit from "@/components/EllipsisCharacterLimit";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import DatasetRelationshipDialog from "@/modules/DatasetRelationshipDialog";
import useDialog from "@/hooks/useDialog";

const TRANSLATION_PATH = "pages.dataset.components.Linkages";

interface LinkagesProps {
    linkages: Linkage[];
}

const Linkages = ({ linkages }: LinkagesProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { showDialog } = useDialog();

    const linkageCounts = Object.entries(
        linkages.reduce<Record<string, number>>((acc, { linkage_type }) => {
            acc[linkage_type] = (acc[linkage_type] ?? 0) + 1;
            return acc;
        }, {})
    );

    if (!linkageCounts.length) {
        return null;
    }

    return (
        <Paper sx={{ borderRadius: 2, p: 2 }}>
            <Typography variant="h2"> {t("title")} </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", p: 0 }} gap={1}>
                {linkageCounts.map(([type, count]) => (
                    <EllipsisCharacterLimit
                        key={type}
                        isButton
                        text={t(type, { count })}
                        onClick={() =>
                            showDialog(DatasetRelationshipDialog, {
                                linkageDetails: linkages.filter(
                                    linkage => linkage.linkage_type === type
                                ),
                            })
                        }
                    />
                ))}
            </Box>
        </Paper>
    );
};

export default Linkages;
