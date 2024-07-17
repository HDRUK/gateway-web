import { Fragment, useState } from "react";
import { Box } from "@mui/material";
import Button from "@/components/Button";
import Link from "@/components/Link";
import MenuDropdown from "@/components/MenuDropdown";
import navItems from "@/config/nav";
import { ExpandMoreIcon } from "@/consts/icons";
import { Divider } from '@mui/material';

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
                return (<Fragment key={item.label}>
                 <Divider orientation="vertical" sx={{bgcolor: "white", ml: 2, mr: 2 }}/>
              </Fragment>)
              }
                return item.subItems ? (
                    <Fragment key={item.label}>
                        <Button
                            variant="text"
                            disableRipple
                            key={item.label}
                            sx={{ color: "white" }}
                            endIcon={<ExpandMoreIcon color="primary" />}
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
                    <Link passHref key={item.label} href={item.href}>
                        <Button sx={{ color: "white" }} variant="link">
                            {item.label}
                        </Button>
                    </Link>
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
