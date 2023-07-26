import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "@/components/Link";
import Button from "@/components/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import useAuth from "@/hooks/useAuth";

import { useEffect } from "react";

interface AccountNavProps {
    onCloseMenu: () => void;
    onLogout: () => void;
    anchorElement: null | HTMLElement;
}

const AccountNav = ({
    anchorElement,
    onCloseMenu,
    onLogout,
}: AccountNavProps) => {
    let links = [
        { id: -99, label: "Profile", href: "/account/profile" },
    ];

    const { user } = useAuth();

    const handleCloseUserMenu = () => {
        if (typeof onCloseMenu === "function") {
            onCloseMenu();
        }
    };

    const handleLogout = () => {
        if (typeof onLogout === "function") {
            onLogout();
        }
    };

    useEffect(() => {
        if (!user) {
            return;
        }
    }, [user]);

    user.teams.map(team => {
        let t = { id: team.id, label: team.name, href: `/account/team/${team.id}` };

        if (!links.includes(t)) {
            links.push(t);
        }
    });

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
            id="account-nav"
            anchorEl={anchorElement}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            onClose={handleCloseUserMenu}
            open={Boolean(anchorElement)}>
            {links.map(link => (
                <Link key={link.label} underline="hover" href={link.href}>
                    <MenuItem
                        sx={{ width: 220 }}
                        key={link.label}
                        LinkComponent={Link}
                        onClick={handleCloseUserMenu}>
                        <ChevronLeftIcon />
                        {link.label}
                    </MenuItem>
                </Link>
            ))}
            <Button variant="link">
                <MenuItem sx={{ width: 220 }} onClick={handleLogout}>
                    Logout
                </MenuItem>
            </Button>
        </Menu>
    );
};

export default AccountNav;
