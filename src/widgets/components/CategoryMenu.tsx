"use client";

import { useEffect, useState } from "react";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import { WidgetCategory } from "@/interfaces/Widget";
import { colors } from "@/config/theme";
import { ChevronThinIcon } from "@/consts/icons";
import { CATEGORY_LABEL } from "../consts";

const btnFullWidthSx = {
    backgroundColor: "white",
    fontSize: "15px",
    "&:hover": { background: "white" },
    color: "black",
    boxShadow: "none",
    textTransform: "none",
    width: "100%",
};

type CategoryMenuProps = {
    value: WidgetCategory;
    options: WidgetCategory[];
    onChange: (cat: WidgetCategory) => void;
    menuAnchor: HTMLElement | null;
    setMenuAnchor: (el: HTMLElement | null) => void;
    containerRef: React.RefObject<HTMLDivElement>;
};

export default function CategoryMenu({
    value,
    options,
    onChange,
    menuAnchor,
    setMenuAnchor,
    containerRef,
}: CategoryMenuProps) {
    const [menuContainer, setMenuContainer] = useState<Element | null>(null);
    const [menuWidth, setMenuWidth] = useState<number | string>("100%");

    useEffect(() => {
        if (containerRef.current) {
            setMenuContainer(containerRef.current);
            setMenuWidth(containerRef.current.clientWidth);
        }
    }, [containerRef]);

    return (
        <Box component="nav" sx={{ p: 0 }}>
            <Box
                sx={{
                    borderBottom: `3px solid ${colors.green400}`,
                    width: "100%",
                    p: 0,
                }}>
                <Button
                    aria-controls="tab-menu"
                    aria-haspopup="true"
                    onClick={e => setMenuAnchor(e.currentTarget)}
                    aria-label="Open to show search type options"
                    title="Open to show search type options"
                    color="secondary"
                    sx={btnFullWidthSx}
                    endIcon={<ChevronThinIcon color="primary" />}>
                    {CATEGORY_LABEL[value]}
                </Button>

                <Menu
                    container={menuContainer ?? undefined}
                    keepMounted
                    anchorEl={menuAnchor}
                    open={!!menuAnchor}
                    onClose={() => setMenuAnchor(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    slotProps={{
                        paper: {
                            sx: {
                                mt: "3px",
                                width: menuWidth,
                                maxWidth: "100%",
                                borderRadius: 0,
                                boxShadow: "none",
                                pt: 0,
                            },
                        },
                        list: {
                            "aria-labelledby": "basic-button",
                            sx: { p: 0 },
                        },
                    }}>
                    {options.map(cat => (
                        <MenuItem
                            onClick={() => {
                                onChange(cat);
                                setMenuAnchor(null);
                            }}
                            key={cat}
                            value={cat}
                            sx={{
                                fontSize: "15px",
                                py: 1.5,
                                fontWeight: cat === value ? 600 : 400,
                            }}>
                            {CATEGORY_LABEL[cat]}
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
        </Box>
    );
}
