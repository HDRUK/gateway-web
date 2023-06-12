import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "@/components/Link";

const links = [{ label: "Profile", href: "/account/profile" }];

interface AccountNavigationProps {
    onCloseMenu: () => void;
    anchorElement: null | HTMLElement;
}

const AccountNavigation = ({
    anchorElement,
    onCloseMenu,
}: AccountNavigationProps) => {
    const handleCloseUserMenu = () => {
        if (typeof onCloseMenu === "function") {
            onCloseMenu();
        }
    };

    return (
        <Menu
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: "visible",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                    },
                    "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                    },
                },
            }}
            id="account-navigation"
            anchorEl={anchorElement}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            onClose={handleCloseUserMenu}
            open={Boolean(anchorElement)}>
            {links.map(link => (
                <Link underline="hover" href={link.href}>
                    <MenuItem
                        sx={{ width: 220 }}
                        key={link.label}
                        LinkComponent={Link}
                        onClick={handleCloseUserMenu}>
                        {link.label}
                    </MenuItem>
                </Link>
            ))}
        </Menu>
    );
};

export default AccountNavigation;
