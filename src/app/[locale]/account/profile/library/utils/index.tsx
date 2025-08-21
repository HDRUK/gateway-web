import { IconButton } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import { LibraryListItem, SelectedLibrary } from "@/interfaces/Library";
import Link from "@/components/Link";
import StyledCheckbox from "@/components/StyledCheckbox";
import TooltipIcon from "@/components/TooltipIcon";
import { CheckIcon, DeleteForeverIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";

const columnHelper = createColumnHelper<LibraryListItem>();

const getColumns = ({
    handleSelect,
    handleRemove,
    selected,
    translations,
}: {
    handleSelect: (data: SelectedLibrary) => void;
    handleRemove: (id: string | number) => void;
    selected: SelectedLibrary;
    translations: { [id: string]: string };
}) => [
    columnHelper.display({
        id: "actions",
        meta: { isPinned: true },
        cell: ({ row }) => {
            const {
                id,
                datasetId,
                name,
                dataCustodianId,
                dataCustodian,
                darEnabled,
                darTemplatePublished,
                cohortEnabled,
            } = row.original;
            return (
                <div style={{ textAlign: "center" }}>
                    <StyledCheckbox
                        checked={selected[id]?.selected}
                        onChange={(_e, value) =>
                            handleSelect({
                                [id]: {
                                    selected: value,
                                    datasetId,
                                    name,
                                    teamId: dataCustodianId,
                                    teamName: dataCustodian,
                                    darEnabled,
                                    darTemplatePublished,
                                    cohortEnabled,
                                },
                            })
                        }
                        size="large"
                        sx={{ p: 0 }}
                        iconSx={{ mr: 0 }}
                    />
                </div>
            );
        },
        header: () => null,
        size: 43,
    }),

    columnHelper.display({
        id: "name",
        cell: ({ row: { original } }) => {
            const { datasetId, name } = original;
            const linkHref = `/${RouteName.DATASET_ITEM}/${datasetId}`;

            return (
                <Link href={linkHref}>
                    <div style={{ textAlign: "center" }}>{name}</div>
                </Link>
            );
        },
        header: () => <span>{translations.name}</span>,
        size: 150,
    }),

    columnHelper.display({
        id: "darEnabled",
        cell: ({
            row: {
                original: { darEnabled },
            },
        }) => (
            <div style={{ textAlign: "center" }}>
                {darEnabled ? <CheckIcon color="primary" /> : "-"}
            </div>
        ),
        header: () => (
            <TooltipIcon
                buttonSx={{ p: 0 }}
                size="small"
                label={translations.darEnabled}
                content={translations.darEnabled}
            />
        ),
        size: 100,
    }),

    columnHelper.display({
        id: "cohortEnabled",
        cell: ({
            row: {
                original: { cohortEnabled },
            },
        }) => (
            <div style={{ textAlign: "center" }}>
                {cohortEnabled ? <CheckIcon color="primary" /> : "-"}
            </div>
        ),
        header: () => <span>{translations.cohortEnabled}</span>,
        size: 100,
    }),

    columnHelper.display({
        id: "dataCustodian",
        cell: ({
            row: {
                original: { dataCustodian },
            },
        }) => <div style={{ textAlign: "center" }}>{dataCustodian}</div>,
        header: () => <span>{translations.dataCustodian}</span>,
        size: 100,
    }),

    columnHelper.display({
        id: "entityType",
        cell: ({
            row: {
                original: { entityType },
            },
        }) => <div style={{ textAlign: "center" }}>{entityType}</div>,
        header: () => <span>{translations.entityType}</span>,
        size: 100,
    }),

    columnHelper.display({
        id: "delete",
        cell: ({ row: { original } }) => {
            return (
                <div style={{ textAlign: "center" }}>
                    <IconButton onClick={() => handleRemove(original.id)}>
                        <DeleteForeverIcon color="primary" />
                    </IconButton>
                </div>
            );
        },
        header: () => null,
        size: 43,
    }),
];

export { getColumns };
