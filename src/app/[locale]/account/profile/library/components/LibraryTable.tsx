"use client";

import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import StyledCheckbox from "@/components/StyledCheckbox";
import Table from "@/components/Table";
import TooltipIcon from "@/components/TooltipIcon";
import { CheckIcon, DeleteForeverIcon } from "@/consts/icons";

interface Library {
    name: string;
    darEnabled: boolean;
    dataCustodian: string;
    entityType: string;
}

const TRANSLATION_PATH = "pages.account.profile.library";

const columnHelper = createColumnHelper<Library>();

const getColumns = ({
    handleSelect,
    selected,
    translations,
}: {
    handleSelect: (data: { [id: string]: boolean }) => void;
    selected: { [id: string]: boolean };
    translations: { [id: string]: string };
}) => [
    columnHelper.display({
        id: "actions",
        meta: { isPinned: true },
        cell: ({ row }) => {
            return (
                <div style={{ textAlign: "center" }}>
                    <StyledCheckbox
                        checked={selected[row.id]}
                        onChange={(_e, value) =>
                            handleSelect({ [row.id]: value })
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
        size: 120,
    }),

    columnHelper.display({
        id: "darEnabled",
        cell: ({
            row: {
                original: { darEnabled },
            },
        }) => (
            <div style={{ textAlign: "center" }}>
                {darEnabled && <CheckIcon color="primary" />}
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
        size: 120,
    }),

    columnHelper.display({
        id: "dataCustodian",
        cell: ({
            row: {
                original: { dataCustodian },
            },
        }) => <div style={{ textAlign: "center" }}>{dataCustodian}</div>,
        header: () => <span>{translations.dataCustodian}</span>,
        size: 120,
    }),

    columnHelper.display({
        id: "entityType",
        cell: ({
            row: {
                original: { entityType },
            },
        }) => <div style={{ textAlign: "center" }}>{entityType}</div>,
        header: () => <span>{translations.entityType}</span>,
        size: 120,
    }),

    columnHelper.display({
        id: "delete",
        cell: () => {
            return (
                <div style={{ textAlign: "center" }}>
                    <DeleteForeverIcon color="primary" />
                </div>
            );
        },
        header: () => null,
        size: 43,
    }),
];
const LibraryTable = () => {
    const t = useTranslations(TRANSLATION_PATH);

    const results = [
        {
            name: "Test name for a dataset",
            darEnabled: true,
            dataCustodian: "SAIL",
            entityType: "Dataset",
        },
    ];
    const [selected, setSelected] = useState({});
    const handleSelect = (data: { [id: string]: boolean }) => {
        setSelected({ ...selected, ...data });
    };

    const translations = {
        name: t("name.label"),
        darEnabled: t("darEnabled.label"),
        dataCustodian: t("dataCustodian.label"),
        entityType: t("entityType.label"),
    };

    return (
        <Table<Library>
            columns={getColumns({
                handleSelect,
                selected,
                translations,
            })}
            rows={results}
        />
    );
};

export default LibraryTable;
