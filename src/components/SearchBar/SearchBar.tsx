/** @jsxImportSource @emotion/react */
import { Control } from "react-hook-form";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { colors } from "@/config/theme";
import { CloseIcon, SearchIcon } from "@/consts/icons";
import TextField from "../TextField";
import { searchBarStyle } from "./SearchBar.styles";

interface SearchBarProps {
    control: Control;
    explainerText?: string;
    resetAction: () => void;
    resetDisabled: boolean;
    submitAction: () => void;
    queryName: string;
    queryPlaceholder: string;
}
export const TEST_ID_WRAPPER = "search-bar";
export const TEST_ID_RESET_BUTTON = "reset-btn";

const SEARCH_ICON_SIZE = "48px";
const CROSS_ICON_SIZE = "60px";

const SearchBar = ({
    control,
    explainerText,
    resetAction,
    resetDisabled,
    submitAction,
    queryName,
    queryPlaceholder,
}: SearchBarProps) => {
    const theme = useTheme();

    return (
        <Box css={searchBarStyle.formWrapper} data-testid={TEST_ID_WRAPPER}>
            <Box
                onSubmit={submitAction}
                component="form"
                css={searchBarStyle.form(theme)}>
                <SearchIcon
                    color="primary"
                    sx={{
                        height: SEARCH_ICON_SIZE,
                        width: SEARCH_ICON_SIZE,
                    }}
                />
                <Box css={searchBarStyle.inputWrapper}>
                    <TextField
                        name={queryName}
                        control={control}
                        placeholder={queryPlaceholder}
                        label=""
                        css={searchBarStyle.input}
                    />
                </Box>
                <IconButton
                    aria-label="search"
                    onClick={() => resetAction()}
                    disabled={resetDisabled}
                    data-testid={TEST_ID_RESET_BUTTON}>
                    <CloseIcon
                        sx={{ height: CROSS_ICON_SIZE, width: CROSS_ICON_SIZE }}
                    />
                </IconButton>
            </Box>

            {explainerText && (
                <Typography
                    css={searchBarStyle.explainerText}
                    color={colors.grey600}>
                    {explainerText}
                </Typography>
            )}
        </Box>
    );
};

export default SearchBar;
