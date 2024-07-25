"use client";

import {
    ReactElement,
    JSXElementConstructor,
    ReactFragment,
    ReactNode,
} from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { range } from "lodash";
import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Table from "@/components/Table";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";
import { capitalise, splitCamelcase } from "@/utils/general";

const TRANSLATION_PATH = `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset.structuralMetadata`;

interface StructuralMetadataProps {
    selectedFormSection: string;
}

const columnHelper = createColumnHelper();

const renderTextWrapper = (
    text:
        | ReactElement<string, string | JSXElementConstructor<string>>
        | ReactFragment
) => <Typography>{text}</Typography>;

const renderBoldText = (chunks: ReactNode) => (
    <>
        <br />
        <b>{chunks}</b>
    </>
);

const renderRedText = (chunks: ReactNode) => (
    <span
        style={{
            color: `${colors.red600}`,
            fontWeight: "bold",
        }}>
        {chunks}
    </span>
);

const renderTableHeader = (headerText: string) => (
    <Typography sx={{ textAlign: "left", fontWeight: "bold" }}>
        {headerText}
    </Typography>
);

const StructuralMetadata = ({
    selectedFormSection,
}: StructuralMetadataProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const tableColumns = [
        {
            header: t("metadataFieldHeader"),
            path: "metadataField",
        },
        {
            header: t("completionGuidanceHeader"),
            path: "completionGuidance",
        },
    ];

    const getColumns = () =>
        tableColumns.map(column =>
            columnHelper.display({
                id: column.header,
                cell: ({ row: { index } }) =>
                    renderTextWrapper(
                        t.rich(`${column.path}${index + 1}`, {
                            bold: chunks => renderBoldText(chunks),
                            red: chunks => renderRedText(chunks),
                        })
                    ),
                header: () => renderTableHeader(column.header),
                size: column.path === "metadataField" ? 70 : 150,
            })
        );

    return (
        <Paper
            sx={{
                marginTop: "10px",
                marginBottom: "10px",
                padding: 2,
            }}>
            <Typography variant="h2">
                {capitalise(splitCamelcase(selectedFormSection))}
            </Typography>

            <Box sx={{ p: 0, mb: 2 }}>
                <Typography sx={{ mb: 2 }}>{t("intro")}</Typography>
                <Table columns={getColumns()} rows={range(0, 6)} />
            </Box>
        </Paper>
    );
};

export default StructuralMetadata;
