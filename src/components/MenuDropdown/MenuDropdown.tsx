import { MouseEvent } from "react";
import { Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import useDialog from "@/hooks/useDialog";
import theme, { colors } from "@/config/theme";
import { MarkDownSanitizedWithHtml } from "../MarkDownSanitizedWithHTML";

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
    const router = useRouter();

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
                            sx={{
                                maxWidth: 250,
                                color: theme.palette.primary.main,
                            }}
                            key={subItem.label}
                            onClick={() => {
                                handleClose();
                                router.push(subItem.href);
                            }}>
                            <MarkDownSanitizedWithHtml
                                content={subItem.label}
                                wrapper="span"
                            />
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
                                color: theme.palette.primary.main,
                            }}
                            key={menuItem.label}
                            onClick={() => {
                                handleClose();
                                menuItem.href && router.push(menuItem.href);
                            }}
                            aria-label={ariaLabel}>
                            {menuItem.icon || null}
                            <MarkDownSanitizedWithHtml
                                content={menuItem.label}
                                wrapper="span"
                            />
                        </MenuItem>
                    );
                if (menuItem.action) {
                    return (
                        <MenuItem
                            key={menuItem.label}
                            sx={{
                                maxWidth: 250,
                                color: theme.palette.primary.main,
                            }}
                            onClick={menuItem.action}
                            aria-label={ariaLabel}>
                            {menuItem.icon || null}
                            <MarkDownSanitizedWithHtml
                                content={menuItem.label}
                                wrapper="span"
                            />
                        </MenuItem>
                    );
                }
                if (menuItem.dialog) {
                    return (
                        <MenuItem
                            key={menuItem.label}
                            sx={{ maxWidth: 250 }}
                            onClick={() => handleShowDialog(menuItem.dialog)}>
                            {menuItem.icon || null}
                            <span>{menuItem.label}</span>
                        </MenuItem>
                    );
                }
                if (menuItem.button) {
                    return (
                        <MenuItem key={menuItem.label} sx={{ maxWidth: 250 }}>
                            {menuItem.icon || null}
                            {menuItem.button}
                        </MenuItem>
                    );
                }

                return null;
            })}
        </Menu>
    );
}

export default MenuDropdown;
