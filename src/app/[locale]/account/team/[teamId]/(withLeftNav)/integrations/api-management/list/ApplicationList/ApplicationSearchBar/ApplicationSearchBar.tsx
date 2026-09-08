import { useEffect, Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import InputWrapper from "@/components/InputWrapper";
import useDebounce from "@/hooks/useDebounce";
import {
    searchApiDefaultValues,
    searchApiFormFields,
} from "@/config/forms/searchApis";

interface ApplicationSearchBarQueryParams {
    team_id: string;
    status: string;
    text: string;
    page: string;
    per_page: string;
}

interface ApplicationSearchBarProps {
    setQueryParams: Dispatch<SetStateAction<ApplicationSearchBarQueryParams>>;
}

const ApplicationSearchBar = ({
    setQueryParams,
}: ApplicationSearchBarProps) => {
    const { control, watch, setValue } = useForm({
        defaultValues: { ...searchApiDefaultValues },
    });

    const watchAll = watch();

    const filterTextDebounced = useDebounce(
        watchAll.searchTitleDescription,
        500
    );
    useEffect(() => {
        setQueryParams(previous => ({
            ...previous,
            text: filterTextDebounced,
            page: "1",
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterTextDebounced]);

    return (
        <BoxContainer
            sx={{
                my: 2,
                display: "flex",
                alignItems: "center",
            }}>
            <Box sx={{ p: 0, width: "50%" }}>
                {searchApiFormFields.map(field => (
                    <InputWrapper
                        key={field.name}
                        setValue={setValue}
                        control={control}
                        {...field}
                    />
                ))}
            </Box>
        </BoxContainer>
    );
};

export default ApplicationSearchBar;
