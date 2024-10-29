"use client";

import { useTranslations } from "next-intl";
import { Dataset } from "@/interfaces/Dataset";
import Box from "@/components/Box";
import EllipsisCharacterLimit from "@/components/EllipsisCharacterLimit";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import DatasetRelationshipDialog from "@/modules/DatasetRelationshipDialog";
import useDialog from "@/hooks/useDialog";

const TRANSLATION_PATH = "pages.dataset.components.Linkages";

interface LinkagesProps {
    data: Dataset;
}

const Linkages = ({ data }: LinkagesProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { showDialog } = useDialog();

    const { reduced_linked_dataset_versions } = data.versions[0];

    const linkageCounts = Object.entries(
        reduced_linked_dataset_versions.reduce<Record<string, number>>(
            (counts, { pivot: { linkage_type } }) => {
                return {
                    ...counts,
                    [linkage_type]: (counts[linkage_type] || 0) + 1,
                };
            },
            {} as Record<string, number>
        )
    );

    const linkageDetails = reduced_linked_dataset_versions.map(item => ({
        linkage_type: item.pivot.linkage_type,
        id: item.id,
        title: item.title,
        shortTitle: item.shortTitle,
    }));

    if (!linkageCounts.length) {
        return null;
    }

    return (
        <Paper sx={{ borderRadius: 2, p: 2 }}>
            <Typography variant="h2"> {t("title")} </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", p: 0 }} gap={1}>
                {linkageCounts.map(([type, count]) => (
                    <EllipsisCharacterLimit
                        isButton
                        text={t(type, { count })}
                        onClick={() =>
                            showDialog(DatasetRelationshipDialog, {
                                datasetId: data.id,
                                linkageDetails: linkageDetails.filter(
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
