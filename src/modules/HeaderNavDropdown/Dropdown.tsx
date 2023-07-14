import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "@/components/Link";

interface DropdownProps {
    onCloseMenu: () => void;
    anchorElement: null | HTMLElement;
    dropMenus: { label: string; href: string }[];
}

const Dropdown = ({ onCloseMenu, anchorElement, dropMenus }: DropdownProps) => {
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
                    "@media (max-width: 1023px)": {
                        position: "absolute",
                        marginLeft: "142px",
                        mt: "-37px",
                    },
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
            id="account-nav"
            anchorEl={anchorElement}
            transformOrigin={{ horizontal: "left", vertical: "top" }}
            anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
            onClose={handleCloseUserMenu}
            open={Boolean(anchorElement)}>
            {dropMenus.map(link => (
                <Link key={link.label} href={link.href}>
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

export default Dropdown;
