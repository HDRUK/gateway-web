/** @jsxImportSource @emotion/react */
import { IconType } from "@/interfaces/Ui";
import { ListItemIcon, ListItemText } from "@mui/material";

interface MenuItemContentProps {
    iconRight?: boolean;
    icon?: IconType;
    invertListItem?: boolean;
    label: string;
}

const MenuItemContent = ({
    iconRight,
    icon,
    label,
    invertListItem,
}: MenuItemContentProps) => {
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
                    fontSize="xsmall"
                    color="primary"
                />
            </ListItemIcon>
        </>
    );
};

MenuItemContent.defaultProps = {
    icon: undefined,
    iconRight: false,
    invertListItem: false,
};

export default MenuItemContent;
