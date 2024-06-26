"use client";

import { SyntheticEvent, useState } from "react";
import { Box, Divider, List, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import Tabs from "@/components/Tabs";
import { DataStatus } from "@/consts/application";
import { ACCOUNT, DATA_USES, PAGES, TEAM } from "@/consts/translation";
import DataUsesListCard from "../DataUseListCard";

interface DataUsesListProps {
    isCreate: boolean;
    isEdit: boolean;
    isArchive: boolean;
}

const dataUses = [
    {
        title: "Data use 1",
        id: 1,
        dataList: [
            { label: "Label 1", value: "Value 1" },
            { label: "Label 2", value: "Value 2" },
            { label: "Label 3", value: "Value 3" },
        ],
    },
];

const TRANSLATIONS_DATAUSES_NAMESPACE = `${PAGES}.${ACCOUNT}.${TEAM}.${DATA_USES}`;

export default function DataUsesList({
    isCreate,
    isArchive,
    isEdit,
}: DataUsesListProps) {
    const [, setTabValue] = useState("ACTIVE");
    const t = useTranslations(TRANSLATIONS_DATAUSES_NAMESPACE);

    // Do query here based on changing tabValue

    const handleEditClick = () => {
        console.log("Editting");
    };

    const handleCopyClick = () => {
        console.log("Copying");
    };

    const handleArchiveClick = () => {
        console.log("Archiving");
    };

    const handleAdd = () => {
        console.log("Uploading");
    };

    const handleTabChanged = (
        _: SyntheticEvent<Element, Event>,
        value: string
    ) => {
        setTabValue(value);
    };

    return (
        <>
            <Paper sx={{ mb: 2 }}>
                <Box sx={{ p: 2, display: "flex" }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h2">{t("title")}</Typography>
                        <Typography>{t("description")}</Typography>
                    </Box>
                    {isCreate && (
                        <div>
                            <Button onClick={handleAdd}>
                                {t("uploadButton")}
                            </Button>
                        </div>
                    )}
                </Box>
                <Divider />
                <Tabs
                    handleChange={handleTabChanged}
                    centered
                    tabs={[
                        {
                            label: t("active", {
                                count: 10,
                            }),
                            value: DataStatus.ACTIVE,
                            content: "",
                        },
                        {
                            label: t("draft", {
                                count: 21,
                            }),
                            value: DataStatus.DRAFT,
                            content: "",
                        },
                        {
                            label: t("archived", {
                                count: 0,
                            }),
                            value: DataStatus.ARCHIVED,
                            content: "",
                        },
                    ]}
                    tabBoxSx={{ padding: 0 }}
                    rootBoxSx={{ padding: 0 }}
                />
            </Paper>

            <List>
                {dataUses.map(({ title, dataList, id }) => (
                    <Paper>
                        <DataUsesListCard
                            title={title}
                            dataList={dataList}
                            onEdit={handleEditClick}
                            onCopy={handleCopyClick}
                            onArchive={handleArchiveClick}
                            id={id}
                            isCreate={isCreate}
                            isEdit={isEdit}
                            isArchive={isArchive}
                        />
                    </Paper>
                ))}
            </List>
        </>
    );
}
