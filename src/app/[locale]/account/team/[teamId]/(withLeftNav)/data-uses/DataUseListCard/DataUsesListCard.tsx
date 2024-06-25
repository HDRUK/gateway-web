"use client";

import EditIcon from "@mui/icons-material/Edit";
import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useTranslations } from "next-intl";
import { DataList, DataListItem } from "@/components/DataList";
import ListItemActions from "@/components/ListItemActions";
import { DISABLED_OPACITY } from "@/config/theme";
import { ArchiveIcon, ContentCopyIcon } from "@/consts/icons";
import { ACCOUNT, DATA_USES, PAGES, TEAM } from "@/consts/translation";

interface DataUsesListCardProps {
    isCreate: boolean;
    isEdit: boolean;
    isArchive: boolean;
    onEdit: (id: number) => void;
    onCopy: (id: number) => void;
    onArchive: (id: number) => void;
    dataList: {
        label: string;
        value: string;
    }[];
    title: string;
    id: number;
}

const TRANSLATIONS_DATAUSES_NAMESPACE = `${PAGES}.${ACCOUNT}.${TEAM}.${DATA_USES}`;

export default function DataUsesListCard({
    onEdit,
    onCopy,
    onArchive,
    dataList,
    title,
    id,
    isCreate,
    isArchive,
    isEdit,
}: DataUsesListCardProps) {
    const t = useTranslations(TRANSLATIONS_DATAUSES_NAMESPACE);

    const disabledButtonStyles = {
        opacity: DISABLED_OPACITY,
        cursor: "default",
    };

    return (
        <ListItem
            secondaryAction={
                <ListItemActions
                    sx={{
                        minHeight: "100%",
                        color: "primary.main",
                    }}>
                    <EditIcon
                        titleAccess={t("editButtonLabel", {
                            title,
                        })}
                        role="button"
                        onClick={() => onEdit(id)}
                        sx={isEdit ? disabledButtonStyles : {}}
                    />
                    <ContentCopyIcon
                        titleAccess={t("copyButtonLabel", {
                            title,
                        })}
                        role="button"
                        onClick={() => onCopy(id)}
                        sx={isCreate ? disabledButtonStyles : {}}
                    />
                    <ArchiveIcon
                        titleAccess={t("copyButtonLabel", {
                            title,
                        })}
                        role="button"
                        onClick={() => onArchive(id)}
                        sx={isArchive ? disabledButtonStyles : {}}
                    />
                </ListItemActions>
            }
            sx={{ p: 0, minHeight: "160px" }}
            alignItems="flex-start">
            <ListItemButton component="a">
                <ListItemText
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                    primary={title}
                    primaryTypographyProps={{
                        fontWeight: 600,
                        fontSize: 16,
                        mb: 4,
                    }}
                    secondary={
                        <DataList>
                            {dataList.map(({ label, value }) => (
                                <DataListItem
                                    primary={label}
                                    secondary={value}
                                />
                            ))}
                        </DataList>
                    }
                />
            </ListItemButton>
        </ListItem>
    );
}
