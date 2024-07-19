import { Menu, MenuItem } from "@mui/material";
import Button from "@/components/Button";
import Link from "@/components/Link";
import { colors } from "@/config/theme";

interface MenuDropdownProps {
    anchorElement: null | HTMLElement;
    menuItems: {
        label: string;
        href?: string;
        action?: () => void;
        subItems?: { label: string; href: string }[];
        divider?: boolean;
    }[];
    handleClose: () => void;
}

function MenuDropdown({
    anchorElement,
    menuItems,
    handleClose,
}: MenuDropdownProps) {
    return (
        <Menu
            anchorEl={anchorElement}
            transformOrigin={{ horizontal: "left", vertical: "top" }}
            anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
            onClose={() => handleClose()}
            open={Boolean(anchorElement)}>
            {menuItems.map(menuItem => {
                if (menuItem.subItems) {
                    return menuItem.subItems.map(subItem => (
                        <MenuItem
                            sx={{ maxWidth: 250 }}
                            key={subItem.label}
                            onClick={() => handleClose()}>
                            <Link underline="none" href={subItem.href}>
                                {subItem.label}
                            </Link>
                        </MenuItem>
                    ));
                }
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
                            <Link
                                key={menuItem.label}
                                underline="hover"
                                href={menuItem.href}>
                                {menuItem.label}
                            </Link>
                        </MenuItem>
                    );
                if (menuItem.action) {
                    return (
                        <MenuItem key={menuItem.label} sx={{ maxWidth: 250 }}>
                            <Button
                                onClick={menuItem.action}
                                variant="link"
                                sx={{ pl: 0 }}>
                                {menuItem.label}
                            </Button>
                        </MenuItem>
                    );
                }

                return null;
            })}
        </Menu>
    );
}

export default MenuDropdown;
