import { useState } from "react";
import {
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Tooltip,
} from "@mui/material";
import { Dataset } from "@/interfaces/Dataset";
import { IconType } from "@/interfaces/Ui";
import { MoreHorizIcon } from "@/consts/icons";

interface DatasetMenuAction {
    icon: IconType;
    label: string;
    action: (dataset: Dataset) => void;
    color?: "error";
    tooltip?: string;
}

interface DatasetCardMenuProps {
    dataset: Dataset;
    label: string;
    actions: DatasetMenuAction[];
}

const DatasetCardMenu = ({ dataset, label, actions }: DatasetCardMenuProps) => {
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(
        null
    );

    return (
        <>
            <Tooltip placement="left" title={label}>
                <IconButton
                    disableRipple
                    size="large"
                    aria-label={label}
                    aria-haspopup="menu"
                    aria-expanded={!!anchorElement}
                    onClick={event => setAnchorElement(event.currentTarget)}>
                    <MoreHorizIcon color="primary" />
                </IconButton>
            </Tooltip>
            <Menu
                disableScrollLock
                anchorEl={anchorElement}
                open={!!anchorElement}
                onClose={() => setAnchorElement(null)}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}>
                {actions.map(
                    ({
                        icon: Icon,
                        label: actionLabel,
                        action,
                        color,
                        tooltip,
                    }) => (
                        <Tooltip
                            key={actionLabel}
                            describeChild
                            placement="left"
                            title={tooltip ?? ""}>
                            <MenuItem
                                onClick={() => {
                                    setAnchorElement(null);
                                    action(dataset);
                                }}>
                                <ListItemIcon>
                                    <Icon
                                        color={color ?? "primary"}
                                        fontSize="inherit"
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    slotProps={{ primary: { color } }}>
                                    {actionLabel}
                                </ListItemText>
                            </MenuItem>
                        </Tooltip>
                    )
                )}
            </Menu>
        </>
    );
};

export default DatasetCardMenu;
export type { DatasetMenuAction };
