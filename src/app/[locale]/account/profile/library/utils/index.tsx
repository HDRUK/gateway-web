import { IconButton } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import { LibraryListItem, SelectedLibrary } from "@/interfaces/Library";
import StyledCheckbox from "@/components/StyledCheckbox";
import TooltipIcon from "@/components/TooltipIcon";
import { CheckIcon, DeleteForeverIcon } from "@/consts/icons";

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
                dataCustodianId,
                dataCustodian,
                dataCustodianMemberOf,
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
                                    teamId: dataCustodianId,
                                    teamName: dataCustodian,
                                    teamMemberOf: dataCustodianMemberOf,
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
        cell: ({
            row: {
                original: { name },
            },
        }) => <div style={{ textAlign: "center" }}>{name}</div>,
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
