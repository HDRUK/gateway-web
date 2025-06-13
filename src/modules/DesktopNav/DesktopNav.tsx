import { Fragment, useState } from "react";
import { Box, Divider } from "@mui/material";
import Button from "@/components/Button";
import Link from "@/components/Link";
import MenuDropdown from "@/components/MenuDropdown";
import { colors } from "@/config/colors";
import navItems from "@/config/nav";
import { ExpandMoreIcon } from "@/consts/icons";

function DesktopNav() {
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(
        null
    );
    const [menuItems, setMenuItems] = useState<
        { label: string; href: string }[]
    >([]);

    const handleOpenNav = (
        event: HTMLElement,
        subItems: { label: string; href: string }[]
    ) => {
        setMenuItems(subItems);
        setAnchorElement(event);
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
                ml: 4,
            }}>
            {navItems.map(item => {
                if (item.divider) {
                    return (
                        <Fragment key={item.label}>
                            <Divider
                                orientation="vertical"
                                sx={{ bgcolor: "white", ml: 2, mr: 2 }}
                            />
                        </Fragment>
                    );
                }
                return item.subItems ? (
                    <Fragment key={item.label}>
                        <Button
                            variant="text"
                            disableRipple
                            key={item.label}
                            sx={{
                                color: colors.white,
                                "&:focus&.Mui-focusVisible": {
                                    outlineColor: `${colors.white} !important`,
                                    borderRadius: 0,
                                    textDecoration: "underline",
                                    svg: {
                                        color: colors.white,
                                    },
                                },
                            }}
                            endIcon={
                                <ExpandMoreIcon sx={{ color: colors.white }} />
                            }
                            onClick={(event: React.MouseEvent<HTMLElement>) =>
                                handleOpenNav(
                                    event.currentTarget,
                                    item.subItems
                                )
                            }>
                            {item.label}
                        </Button>
                    </Fragment>
                ) : (
                    <Button
                        sx={{
                            color: "white",
                            "&:focus&.Mui-focusVisible": {
                                outlineColor: colors.white,
                                outlineOffset: "3px",
                                borderRadius: 0,
                                textDecoration: "underline",
                            },
                        }}
                        variant="link"
                        component={Link}
                        key={item.label}
                        href={item.href}>
                        {item.label}
                    </Button>
                );
            })}
            <MenuDropdown
                menuItems={menuItems}
                anchorElement={anchorElement}
                handleClose={() => {
                    setMenuItems([]);
                    setAnchorElement(null);
                }}
            />
        </Box>
    );
}

export default DesktopNav;
