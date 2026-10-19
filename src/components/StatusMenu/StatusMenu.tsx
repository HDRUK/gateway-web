"use client";

import { MouseEvent, useId, useState } from "react";
import { Chip, ChipProps, Loading } from "@hdruk/ui";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTranslations } from "next-intl";
import { DataStatus } from "@/consts/application";
import { ChevronThinIcon } from "@/consts/customIcons";

const TRANSLATION_PATH = "components.StatusMenu";

const statusChipProps: Record<DataStatus, ChipProps> = {
    [DataStatus.ACTIVE]: { color: "success" },
    [DataStatus.DRAFT]: { variant: "outlined" },
    [DataStatus.ARCHIVED]: { color: "archived" },
};

export interface StatusMenuProps {
    status: DataStatus;
    onChange: (status: DataStatus) => Promise<void> | void;
    disabledOptions?: DataStatus[];
}

const StatusMenu = ({
    status,
    onChange,
    disabledOptions = [],
}: StatusMenuProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const id = useId();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const open = Boolean(anchorEl);

    const handleSelect = async (option: DataStatus) => {
        setAnchorEl(null);

        if (option === status) {
            return;
        }

        setIsUpdating(true);
        try {
            await onChange(option);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <>
            <Chip
                {...statusChipProps[status]}
                id={`${id}-button`}
                label={t(status)}
                icon={
                    isUpdating ? (
                        <Loading inline size="small" color="inherit" label="" />
                    ) : (
                        <ChevronThinIcon />
                    )
                }
                iconPosition="end"
                disabled={isUpdating}
                aria-busy={isUpdating}
                aria-label={t("label", { status: t(status) })}
                aria-haspopup="menu"
                aria-controls={open ? `${id}-menu` : undefined}
                aria-expanded={open}
                onClick={(event: MouseEvent<HTMLElement>) =>
                    setAnchorEl(event.currentTarget)
                }
            />
            <Menu
                id={`${id}-menu`}
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                slotProps={{ list: { "aria-labelledby": `${id}-button` } }}>
                {Object.values(DataStatus).map(option => (
                    <MenuItem
                        key={option}
                        role="menuitemradio"
                        aria-checked={option === status}
                        selected={option === status}
                        disabled={disabledOptions.includes(option)}
                        onClick={() => handleSelect(option)}>
                        <ListItemText>{t(option)}</ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default StatusMenu;
