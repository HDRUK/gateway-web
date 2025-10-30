"use client";

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
                    container={() => containerRef.current as Element}
                    keepMounted
                    anchorEl={menuAnchor}
                    open={!!menuAnchor}
                    onClose={() => setMenuAnchor(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    MenuListProps={{
                        "aria-labelledby": "basic-button",
                        sx: { p: 0 },
                    }}
                    slotProps={{
                        paper: {
                            sx: {
                                mt: "3px",
                                width:
                                    containerRef.current?.clientWidth ?? "100%",
                                maxWidth: "100%",
                                borderRadius: 0,
                                boxShadow: "none",
                                left: "0 !important",
                                pt: 0,
                            },
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
