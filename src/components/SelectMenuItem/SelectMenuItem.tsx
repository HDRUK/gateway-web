/** @jsxImportSource @emotion/react */
import { IconType } from "@/interfaces/Ui";
import { ListItemIcon, ListItemText } from "@mui/material";

interface SelectMenuItemProps {
    iconRight?: boolean;
    icon?: IconType;
    invertListItem?: boolean;
    label: string;
}

const SelectMenuItem = ({
    iconRight,
    icon,
    label,
    invertListItem,
}: SelectMenuItemProps) => {
    const Icon = icon;

    if (!Icon) return <ListItemText>{label}</ListItemText>;

    if (!iconRight) {
        return (
            <>
                <ListItemIcon>
                    <Icon
                        sx={{
                            marginRight: "0.4rem",
                            ...(invertListItem && { color: "white" }),
                        }}
                        fontSize="small"
                        color="primary"
                    />
                </ListItemIcon>
                <ListItemText> {label}</ListItemText>
            </>
        );
    }

    return (
        <>
            <ListItemText> {label}</ListItemText>
            <ListItemIcon sx={{ marginRight: "-20px" }}>
                <Icon
                    sx={{
                        marginRight: 0,
                        minWidth: 0,
                        ...(invertListItem && { color: "white" }),
                    }}
                    fontSize="small"
                    color="primary"
                />
            </ListItemIcon>
        </>
    );
};

SelectMenuItem.defaultProps = {
    icon: undefined,
    iconRight: false,
    invertListItem: false,
};

export default SelectMenuItem;
