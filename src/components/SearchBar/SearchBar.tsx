import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import theme from "@/config/theme";
import { SearchIcon } from "@/consts/icons";
import {
    FormWrapper,
    InputWrapper,
    SearchForm,
    SearchInput,
} from "./SearchBar.styles";

interface SearchBarProps {
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
const SearchBar = ({
    resetAction,
    submitAction,
    inputOverrideAction,
    valueOverride,
    defaultValue,
    queryName,
    queryPlaceholder,
}: SearchBarProps) => {
    const { control, handleSubmit, setValue } = useForm({
        defaultValues: { [queryName]: defaultValue },
    });

    useEffect(() => {
        setValue(queryName, valueOverride);
    }, [queryName, setValue, valueOverride]);

    return (
        <FormWrapper data-testid={TEST_ID_WRAPPER}>
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
