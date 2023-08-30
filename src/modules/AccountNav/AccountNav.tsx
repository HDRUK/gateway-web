import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "@/components/Link";
import Button from "@/components/Button";
import useAuth from "@/hooks/useAuth";
import { colors } from "@/config/theme";

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
    const { user } = useAuth();
    const links = [
        {
            label: `${user?.firstname} ${user?.lastname}`,
            href: "/account/profile",
        },
    ];

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

    user.teams.forEach(team => {
        const t = {
            id: team.id,
            label: team.name,
            href: `/account/team/${team.id}/team-management`,
        };

        if (!links.includes(t)) {
            links.push(t);
        }
    });

    return (
        <Menu
            id="account-nav"
            anchorEl={anchorElement}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            onClose={handleCloseUserMenu}
            open={Boolean(anchorElement)}>
            {links.map(link => (
                <Link key={link.label} underline="hover" href={link.href}>
                    <MenuItem
                        sx={{
                            textWrap: "initial",
                            width: 207,
                            borderBottom: `${colors.grey300} 1px solid`,
                        }}
                        key={link.label}
                        LinkComponent={Link}
                        onClick={handleCloseUserMenu}>
                        {link.label}
                    </MenuItem>
                </Link>
            ))}
            <Button variant="link">
                <MenuItem sx={{ width: 207 }} onClick={handleLogout}>
                    Logout
                </MenuItem>
            </Button>
        </Menu>
    );
};

export default AccountNav;
