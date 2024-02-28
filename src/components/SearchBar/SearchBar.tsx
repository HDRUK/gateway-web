/** @jsxImportSource @emotion/react */
import { FieldValues, useForm } from "react-hook-form";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { colors } from "@/config/theme";
import { CloseIcon, SearchIcon } from "@/consts/icons";
import TextField from "../TextField";
import { searchBarStyle } from "./SearchBar.styles";

interface SearchBarProps {
    explainerText?: string;
    resetAction: () => void;
    submitAction: (fieldValues: FieldValues) => void;
    isDisabled: boolean;
    defaultValue?: string;
    queryName: string;
    queryPlaceholder: string;
}
export const TEST_ID_WRAPPER = "search-bar";
export const TEST_ID_RESET_BUTTON = "reset-btn";

const SEARCH_ICON_SIZE = "48px";
const CROSS_ICON_SIZE = "60px";

const SearchBar = ({
    explainerText,
    resetAction,
    submitAction,
    isDisabled,
    defaultValue,
    queryName,
    queryPlaceholder,
}: SearchBarProps) => {
    const theme = useTheme();
    const { control, handleSubmit, reset } = useForm({
        defaultValues: { [queryName]: defaultValue },
    });
    return (
        <Box css={searchBarStyle.formWrapper} data-testid={TEST_ID_WRAPPER}>
            <Box
                onSubmit={handleSubmit(submitAction)}
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
                        control={control}
                        name={queryName}
                        placeholder={queryPlaceholder}
                        label=""
                        css={searchBarStyle.input}
                    />
                </Box>
                <IconButton
                    aria-label="search"
                    onClick={() => {
                        reset({ [queryName]: "" });
                        resetAction();
                    }}
                    disabled={isDisabled}
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
