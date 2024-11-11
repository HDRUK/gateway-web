import { MouseEvent } from "react";
import { Menu, MenuItem } from "@mui/material";
import Button from "@/components/Button";
import Link from "@/components/Link";
import useDialog from "@/hooks/useDialog";
import { colors } from "@/config/theme";
import Encoder from "../Encoder";

interface MenuDropdownProps {
    title?: string;
    anchorElement: null | HTMLElement;
    menuItems: {
        label: string;
        href?: string;
        action?: (
            e: MouseEvent<HTMLButtonElement, MouseEvent<Element, MouseEvent>>
        ) => void;
        subItems?: { label: string; href: string }[];
        divider?: boolean;
        icon?: HTMLElement;
        dialog?;
        button?;
    }[];
    handleClose: () => void;
    transformOrigin?: null | {
        horizontal: string;
        vertical: string;
    };
    anchorOrigin?: null | {
        horizontal: string;
        vertical: string;
    };
    stopPropagation?: boolean;
}

function MenuDropdown({
    anchorElement,
    menuItems,
    handleClose,
    transformOrigin,
    anchorOrigin,
    title,
    stopPropagation,
}: MenuDropdownProps) {
    const { showDialog } = useDialog();

    const handleShowDialog = dialog => {
        showDialog(dialog);
    };

    return (
        <Menu
            anchorEl={anchorElement}
            transformOrigin={
                transformOrigin || { horizontal: "left", vertical: "top" }
            }
            anchorOrigin={
                anchorOrigin || { horizontal: "left", vertical: "bottom" }
            }
            onClose={(event: React.MouseEvent<HTMLElement>) => {
                if (stopPropagation) {
                    event.stopPropagation();
                }
                handleClose();
            }}
            open={Boolean(anchorElement)}>
            {menuItems.map(menuItem => {
                if (menuItem.subItems) {
                    return menuItem.subItems.map(subItem => (
                        <MenuItem
                            sx={{ maxWidth: 250 }}
                            key={subItem.label}
                            onClick={() => handleClose()}>
                            <Link underline="none" href={subItem.href}>
                                <Encoder raw={subItem.label} />
                            </Link>
                        </MenuItem>
                    ));
                }
                const ariaLabel = title
                    ? `${menuItem.label} for ${title}`
                    : undefined;
                if (menuItem.href)
                    return (
                        <MenuItem
                            sx={{
                                maxWidth: 250,
                                textWrap: "initial",
                                borderBottom: `${colors.grey300} 1px solid`,
                            }}
                            key={menuItem.label}
                            onClick={() => handleClose()}>
                            {menuItem.icon || null}
                            <Link
                                aria-label={ariaLabel}
                                key={menuItem.label}
                                underline="hover"
                                href={menuItem.href}>
                                <Encoder raw={menuItem.label} />
                            </Link>
                        </MenuItem>
                    );
                if (menuItem.action) {
                    return (
                        <MenuItem key={menuItem.label} sx={{ maxWidth: 250 }}>
                            {menuItem.icon || null}
                            <Button
                                onClick={menuItem.action}
                                variant="link"
                                aria-label={ariaLabel}
                                sx={{ pl: 0 }}>
                                <Encoder raw={menuItem.label} />
                            </Button>
                        </MenuItem>
                    );
                }
                if (menuItem.dialog) {
                    return (
                        <MenuItem key={menuItem.label} sx={{ maxWidth: 250 }}>
                            {menuItem.icon || null}
                            <Button
                                onClick={() =>
                                    handleShowDialog(menuItem.dialog)
                                }
                                variant="link"
                                sx={{ pl: 0 }}>
                                {menuItem.label}
                            </Button>
                        </MenuItem>
                    );
                }
                if (menuItem.button) {
                    return (
                        <MenuItem key={menuItem.label} sx={{ maxWidth: 250 }}>
                            {menuItem.icon || null}
                            {menuItem.button}
                            {/* <Button
                                onClick={() =>
                                    handleShowDialog(menuItem.dialog)
                                }
                                variant="link"
                                sx={{ pl: 0 }}>
                                {menuItem.label}
                            </Button> */}
                        </MenuItem>
                    );
                }

                return null;
            })}
        </Menu>
    );
}

export default MenuDropdown;
