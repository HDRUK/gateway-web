import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import theme from "@/config/theme";
import { SearchIcon } from "@/consts/icons";
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
    defaultValue?: string;
    queryName: string;
    queryPlaceholder: string;
}
export const TEST_ID_WRAPPER = "search-bar";
export const TEST_ID_RESET_BUTTON = "reset-btn";

const SEARCH_ICON_SIZE = "32px";
const CROSS_ICON_SIZE = "32px";
const TRANSLATION_PATH = "pages.search";

const SearchBar = ({
    explainerText,
    resetAction,
    submitAction,
    inputOverrideAction,
    valueOverride,
    defaultValue,
    queryName,
    queryPlaceholder,
}: SearchBarProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const { control, handleSubmit, setValue } = useForm({
        defaultValues: { [queryName]: defaultValue },
    });

    useEffect(() => {
        setValue(queryName, valueOverride);
    }, [queryName, setValue, valueOverride]);

    return (
        <FormWrapper data-testid={TEST_ID_WRAPPER}>
            {explainerText && (
                <>
                    <ExplainerText>{explainerText}</ExplainerText>
                    <ExplainerLink href={`/${RouteName.HOW_TO_SEARCH}`}>
                        {t("howToSearch")}
                    </ExplainerLink>
                </>
            )}

            <SearchForm onSubmit={handleSubmit(submitAction)} role="search">
                <InputWrapper
                    onClick={() =>
                        inputOverrideAction && inputOverrideAction()
                    }>
                    <SearchInput
                        control={control}
                        name={queryName}
                        label=""
                        placeholder={queryPlaceholder}
                        sx={{
                            border: `2px solid ${theme.palette.greyCustom.main}`,
                        }}
                        inputProps={{
                            "aria-label": "Search",
                        }}
                        icon={SearchIcon}
                        startAdornmentSize={SEARCH_ICON_SIZE}
                        showClearButton
                        clearButtonSize={CROSS_ICON_SIZE}
                        resetAction={resetAction}
                        setValue={setValue}
                    />
                </InputWrapper>
            </SearchForm>
        </FormWrapper>
    );
};

export default SearchBar;
