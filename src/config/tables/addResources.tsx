import { IconButton } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import { get } from "lodash";
import {
    ResourceDataType,
    ResourceType,
    SelectedResources,
} from "@/interfaces/AddResource";
import { DataUse } from "@/interfaces/DataUse";
import { ReducedDataset } from "@/interfaces/Dataset";
import { Publication } from "@/interfaces/Publication";
import { Tool } from "@/interfaces/Tool";
import Chip from "@/components/Chip";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import Link from "@/components/Link";
import StyledCheckbox from "@/components/StyledCheckbox";
import Typography from "@/components/Typography";
import { PUBLISHER_NAME_LOCATION, TITLE_LOCATION } from "@/consts/dataset";
import { DeleteForeverIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";

const EMPTY_VALUE = "-";

const columnHelper = createColumnHelper<ResourceDataType>();

const isResourceSelected = (
    id: number,
    resourceType: ResourceType,
    selectedResources: SelectedResources
) => {
    const currentResource = selectedResources[resourceType];
    return !!currentResource.find(r => r.id === id);
};

const getTitle = (data: ResourceDataType, resourceType: ResourceType) => {
    const getLink = (url?: string, text?: string) =>
        url ? (
            <Link href={url} target="_blank">
                <EllipsisLineLimit
                    maxLine={2}
                    text={text || EMPTY_VALUE}
                    showToolTip
                />
            </Link>
        ) : (
            <Typography>
                <EllipsisLineLimit
                    maxLine={2}
                    text={text || EMPTY_VALUE}
                    showToolTip
                />
            </Typography>
        );

    const titleMap = {
        [ResourceType.DATASET]: () =>
            getLink(
                `/${RouteName.DATASET_ITEM}/${data.id}`,
                get(data, TITLE_LOCATION) || (data as ReducedDataset).shortTitle
            ),
        [ResourceType.DATA_USE]: () =>
            getLink(
                `/${RouteName.DATA_USE_ITEM}/${data.id}`,
                (data as DataUse).project_title
            ),
        [ResourceType.PUBLICATION]: () => {
            const publicationData = data as Publication;
            return getLink(
                publicationData.full_text_url || publicationData.url,
                publicationData.paper_title
            );
        },
        [ResourceType.TOOL]: () => {
            const toolData = data as Tool;
            return getLink(
                toolData.url || `/${RouteName.TOOL_ITEM}/${data.id}`,
                toolData.name
            );
        },
    };

    return titleMap[resourceType]();
};

const getDataProvider = (
    data: ResourceDataType,
    resourceType: ResourceType
) => {
    const titleMap = {
        [ResourceType.DATASET]: () =>
            (data as ReducedDataset)?.dataCustodian ||
            get(data, PUBLISHER_NAME_LOCATION),
        [ResourceType.DATA_USE]: () => (data as DataUse)?.team?.name,
        [ResourceType.PUBLICATION]: () => EMPTY_VALUE,
        [ResourceType.TOOL]: () => (data as Tool)?.team?.name || EMPTY_VALUE,
    };

    return titleMap[resourceType]();
};

const getColumns = ({
    handleAddResource,
    handleRemoveResource,
    resourceType,
    selectedResources,
    tableTranslations,
    isAddingResource = true,
}: {
    handleAddResource?: (isSelected: boolean, data: ResourceDataType) => void;
    handleRemoveResource?: (
        data: ResourceDataType,
        resourceType: ResourceType
    ) => void;
    resourceType: ResourceType;
    selectedResources: SelectedResources;
    tableTranslations: { [id: string]: string };
    isAddingResource?: boolean;
}) => {
    return [
        columnHelper.display({
            id: "actions",
            cell: ({ row: { original: rowData } }) => {
                return isAddingResource ? (
                    <div style={{ textAlign: "center" }}>
                        <StyledCheckbox
                            name={`${resourceType}_${
                                (rowData as ResourceDataType).id
                            }`}
                            checked={isResourceSelected(
                                (rowData as ResourceDataType).id,
                                resourceType,
                                selectedResources
                            )}
                            onChange={(_e, value) =>
                                handleAddResource &&
                                handleAddResource(
                                    value,
                                    rowData as ResourceDataType
                                )
                            }
                            size="large"
                        />
                    </div>
                ) : (
                    <IconButton
                        onClick={() =>
                            handleRemoveResource &&
                            handleRemoveResource(rowData, resourceType)
                        }
                        color="primary">
                        <DeleteForeverIcon />
                    </IconButton>
                );
            },
            header: () => <span>{tableTranslations.headerAdd}</span>,
            size: 10,
            minSize: 10,
        }),

        columnHelper.display({
            id: "name",
            cell: ({ row: { original: rowData } }) => (
                <Typography>
                    {getTitle(rowData as ResourceDataType, resourceType)}
                </Typography>
            ),
            header: () => <span>{tableTranslations.headerName}</span>,
            size: 70,
        }),
        columnHelper.display({
            id: "dataprovider",
            cell: ({ row: { original: rowData } }) => (
                <div style={{ textAlign: "center" }}>
                    <EllipsisLineLimit
                        maxLine={2}
                        text={
                            getDataProvider(
                                rowData as ResourceDataType,
                                resourceType
                            ) || EMPTY_VALUE
                        }
                        showToolTip
                    />
                </div>
            ),
            header: () => <span>{tableTranslations.dataProvider}</span>,
            size: 20,
        }),
        columnHelper.display({
            id: "entity",
            cell: () => (
                <div style={{ textAlign: "center" }}>
                    <Chip
                        label={tableTranslations[`chip${resourceType}`]}
                        resourceType={resourceType}
                    />
                </div>
            ),
            header: () => <span>{tableTranslations.entityType}</span>,
            maxSize: 30,
        }),
    ];
};

export { getColumns };
