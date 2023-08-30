import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "@/components/Link";
import { Typography } from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import { Fragment } from "react";

interface DropdownProps {
    onCloseMenu: () => void;
    anchorElement: null | HTMLElement;
    dropMenus: { label: string; href: string; subtext: string }[];
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
                    border: 1,
                    padding: "2px",
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
                <Fragment key={link.href}>
                    <Link
                        key={link.label}
                        href={link.href}
                        sx={{
                            textDecoration: "none",
                            color: "#000",
                        }}>
                        <MenuItem
                            sx={{
                                fontSize: "14pt",
                            }}
                            key={link.label}
                            LinkComponent={Link}
                            onClick={handleCloseUserMenu}>
                            <StorageIcon /> &nbsp;{link.label}
                        </MenuItem>
                    </Link>
                    <Typography
                        sx={{
                            marginLeft: "5px",
                        }}>
                        {link.subtext}
                    </Typography>
                </Fragment>
            ))}
        </Menu>
    );
};

export default Dropdown;
