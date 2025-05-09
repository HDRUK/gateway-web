import { MouseEvent, MouseEventHandler } from "react";
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
        action?: MouseEventHandler<HTMLElement>;
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
            onClose={(event: MouseEvent<HTMLElement>) => {
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

                let commonSx = {
                    maxWidth: 250,
                    color: theme.palette.primary.main,
                    textWrap: "initial",
                    borderBottom: `${colors.grey300} 1px solid`,
                };

                let onClick: MouseEventHandler<HTMLElement> | undefined;

                let content = (
                    <MarkDownSanitizedWithHtml
                        content={menuItem.label}
                        wrapper="span"
                    />
                );

                if (menuItem.href) {
                    onClick = () => {
                        handleClose();
                        menuItem.href && router.push(menuItem.href);
                    };
                } else if (menuItem.action) {
                    onClick = menuItem.action;
                } else if (menuItem.dialog) {
                    onClick = () => {
                        handleClose();
                        handleShowDialog(menuItem.dialog);
                    };
                } else if (menuItem.button) {
                    content = menuItem.button;
                } else {
                    return null;
                }

                return (
                    <MenuItem
                        key={menuItem.label}
                        sx={commonSx}
                        onClick={onClick}
                        aria-label={ariaLabel}>
                        {menuItem.icon || null}
                        {content}
                    </MenuItem>
                );
            })}
        </Menu>
    );
}

export default MenuDropdown;
