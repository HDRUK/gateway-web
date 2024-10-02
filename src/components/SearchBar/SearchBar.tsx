import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { IconButton } from "@mui/material";
import { useTranslations } from "next-intl";
import { CloseIcon, HelpIcon, SearchIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import {
    ExplainerLink,
    ExplainerText,
    FormWrapper,
    InputWrapper,
    SearchForm,
    SearchInput,
} from "./SearchBar.styles";

interface SearchBarProps {
    explainerText?: string;
    resetAction: () => void;
    submitAction: (fieldValues: FieldValues) => void;
    inputOverrideAction?: () => void;
    valueOverride?: string;
    isDisabled: boolean;
    defaultValue?: string;
    queryName: string;
    queryPlaceholder: string;
}
export const TEST_ID_WRAPPER = "search-bar";
export const TEST_ID_RESET_BUTTON = "reset-btn";

const SEARCH_ICON_SIZE = "48px";
const CROSS_ICON_SIZE = "60px";
const HELP_ICON_SIZE = "12px";
const TRANSLATION_PATH = "pages.search";

const SearchBar = ({
    explainerText,
    resetAction,
    submitAction,
    inputOverrideAction,
    valueOverride,
    isDisabled,
    defaultValue,
    queryName,
    queryPlaceholder,
}: SearchBarProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const { control, handleSubmit, reset, setValue } = useForm({
        defaultValues: { [queryName]: defaultValue },
    });

    useEffect(() => {
        setValue(queryName, valueOverride);
    }, [queryName, setValue, valueOverride]);

    return (
        <FormWrapper data-testid={TEST_ID_WRAPPER}>
            <SearchForm onSubmit={handleSubmit(submitAction)}>
                <SearchIcon
                    color="primary"
                    sx={{
                        height: SEARCH_ICON_SIZE,
                        width: SEARCH_ICON_SIZE,
                    }}
                />
                <InputWrapper
                    onClick={() =>
                        inputOverrideAction && inputOverrideAction()
                    }>
                    <SearchInput
                        control={control}
                        name={queryName}
                        placeholder={queryPlaceholder}
                        label=""
                        sx={{
                            borderBottom: "1px solid #3DB28C",
                        }}
                    />
                </InputWrapper>
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
            </SearchForm>

            {explainerText && (
                <ExplainerText>
                    {explainerText}
                    <ExplainerLink href={`/${RouteName.HOW_TO_SEARCH}`}>
                        {t("howToSearch")}
                        <HelpIcon
                            sx={{
                                height: HELP_ICON_SIZE,
                                width: HELP_ICON_SIZE,
                            }}
                        />
                    </ExplainerLink>
                </ExplainerText>
            )}
        </FormWrapper>
    );
};

export default SearchBar;
