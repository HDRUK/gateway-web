import * as React from "react";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import { IconType } from "@/interfaces/Ui";
import { buttonColourType } from "@/config/theme";

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "right",
        }}
        {...props}
    />
))(({ theme }) => ({
    "& .MuiPaper-root": {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === "light"
                ? "rgb(55, 65, 81)"
                : theme.palette.grey[300],
        boxShadow:
            "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
        "& .MuiMenu-list": {
            padding: "4px 0",
        },
        "& .MuiMenuItem-root": {
            "& .MuiSvgIcon-root": {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            "&:active": {
                backgroundColor: theme.palette.grey[300],
            },
        },
    },
}));

interface ActionMenuProps {
    label?: string;
    buttonColor?: buttonColourType;
    actions: { label: string; action: () => void; icon: IconType }[];
}
export default function ActionMenu({
    actions,
    buttonColor = "greyCustom",
    label = "Actions",
}: ActionMenuProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id="action-menu-button"
                aria-controls={open ? "action-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                variant="outlined"
                color={buttonColor}
                size="small"
                disableRipple
                disableElevation
                onClick={handleClick}
                endIcon={<ArrowDropDownIcon color="primary" />}>
                {label}
            </Button>
            <StyledMenu
                id="action-menu"
                MenuListProps={{
                    "aria-labelledby": "action-menu-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}>
                {actions.map(({ icon: Icon, label, action }) => (
                    <MenuItem key={label} dense onClick={action} disableRipple>
                        <Icon />
                        {label}
                    </MenuItem>
                ))}
            </StyledMenu>
        </div>
    );
}
