"use client";

/* eslint-disable @next/next/no-img-element */
import { Box, IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import Typography from "@/components/Typography";
import theme, { colors } from "@/config/theme";
import { SearchIcon, CancelIcon } from "@/consts/icons";

const SEARCH_ICON_SIZE = "32px";
const CROSS_ICON_SIZE = "32px";

const TRANSLATIONS = {
    poweredBy: "Powered by",
};

const headerSx = {
    display: "flex",
    flexDirection: "row",
    maxHeight: "80px",
    gap: 4,
    width: "auto%",
    py: 2,
    px: 1,
    backgroundColor: colors.white,
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
};

type HeaderProps = {
    includeSearch: boolean;
    gatewayUrl: string;
    searchValue: string;
    setSearchValue: (v: string) => void;
};

export default function Header({
    includeSearch,
    gatewayUrl,
    searchValue,
    setSearchValue,
}: HeaderProps) {
    return (
        <Box
            component="header"
            sx={{
                ...headerSx,
                justifyContent: includeSearch ? "space-between" : "flex-end",
            }}>
            {!!includeSearch && (
                <Box sx={{ flexGrow: 1, p: 0 }}>
                    <OutlinedInput
                        sx={{
                            border: `2px solid ${theme.palette.greyCustom.main}`,
                            fontSize: "1.25rem",
                            backgroundColor: "white",
                            "& fieldset": { border: "none" },
                            "& input": { padding: 0 },
                            minHeight: 44,
                            flexGrow: 1,
                        }}
                        size="small"
                        fullWidth
                        placeholder="Start searching"
                        id="search"
                        startAdornment={
                            <InputAdornment position="start">
                                <SearchIcon
                                    sx={{ fontSize: SEARCH_ICON_SIZE }}
                                    color="primary"
                                />
                            </InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    disableRipple
                                    aria-label="clear text"
                                    onClick={() => setSearchValue("")}
                                    edge="end">
                                    <CancelIcon fontSize={CROSS_ICON_SIZE} />
                                </IconButton>
                            </InputAdornment>
                        }
                        onChange={v => setSearchValue(v.target.value)}
                        value={searchValue}
                    />
                </Box>
            )}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    p: 0,
                }}>
                <Typography fontSize={15}>{TRANSLATIONS.poweredBy}</Typography>
                <a href={gatewayUrl} target="_blank" rel="noreferrer">
                    <img
                        src="https://media.prod.hdruk.cloud/static/heath_data_research_gateway_logo.svg"
                        alt="Gateway logo"
                        width="118"
                    />
                </a>
            </Box>
        </Box>
    );
}
