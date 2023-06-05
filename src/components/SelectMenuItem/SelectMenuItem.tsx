/** @jsxImportSource @emotion/react */
import { IconType } from "@/interfaces/Ui";
import { ListItemIcon, ListItemText } from "@mui/material";

interface MenuItemContentProps {
    iconRight: boolean;
    icon?: IconType;
    invertListItem: boolean;
    option: { value: string | number; label: string; icon?: IconType };
}

const MenuItemContent = ({
    iconRight,
    icon,
    option,
    invertListItem,
}: MenuItemContentProps) => {
    const Icon = icon;

    if (!Icon) return <ListItemText>{option.label}</ListItemText>;

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
                <ListItemText> {option.label}</ListItemText>
            </>
        );
    }

    return (
        <>
            <ListItemText> {option.label}</ListItemText>
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
};

export default MenuItemContent;
