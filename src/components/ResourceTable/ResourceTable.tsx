"use client";

import { useTranslations } from "next-intl";
import {
    ResourceDataType,
    ResourceType,
    SelectedResources,
} from "@/interfaces/AddResource";
import Box from "@/components/Box";
import Table from "@/components/Table";
import { getColumns } from "@/config/tables/addResources";

const TRANSLATION_PATH = "modules.dialogs.RelatedResources";

interface AddDatasetDialogProps {
    selectedResources: SelectedResources;
    handleRemove: (
        isSelected: boolean,
        data: ResourceDataType,
        resourceType: ResourceType
    ) => void;
}

const ResourceTable = ({
    selectedResources,
    handleRemove,
}: AddDatasetDialogProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const tableTranslations = {
        headerAdd: t("headerAdd"),
        headerName: t("headerName"),
        dataProvider: t("dataProvider"),
        entityType: t("entityType"),
        chipdataset: t("chipDataset"),
        chipdatause: t("chipDatause"),
        chippublication: t("chipPublication"),
        chiptool: t("chipTool"),
    };

    const tableData = [
        {
            resourceType: ResourceType.DATA_USE,
            rows: selectedResources[ResourceType.DATA_USE],
            hideHeader: false,
        },
        {
            resourceType: ResourceType.PUBLICATION,
            rows: selectedResources[ResourceType.PUBLICATION],
            hideHeader: true,
        },
        {
            resourceType: ResourceType.TOOL,
            rows: selectedResources[ResourceType.TOOL],
            hideHeader: true,
        },
    ];

    return (
        <Box
            sx={{
                maxHeight: "38vh",
                overflowY: "scroll",
                mt: 1,
            }}>
            {tableData.map(({ resourceType, rows, hideHeader }, index) => (
                <Table
                    key={`${resourceType}_${index}`}
                    columns={getColumns({
                        handleAction: handleRemove,
                        resourceType,
                        selectedResources,
                        tableTranslations,
                        isAddingResource: false,
                    })}
                    rows={rows}
                    hideHeader={hideHeader}
                />
            ))}
        </Box>
    );
};

export default ResourceTable;
