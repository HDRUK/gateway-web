import { useEffect, Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import InputWrapper from "@/components/InputWrapper";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import useDebounce from "@/hooks/useDebounce";
import {
    searchApiDefaultValues,
    searchApiFormFields,
} from "@/config/forms/searchApis";

interface ApplicationSearchBarQueryParams {
    team_id: string;
    enabled: string;
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
    }, [filterTextDebounced]);

    useEffect(() => {
        setQueryParams(previous => ({
            ...previous,
            status:
                watchAll.status.enabled && watchAll.status.disabled
                    ? ""
                    : watchAll.status.enabled
                    ? "1"
                    : watchAll.status.disabled
                    ? "0"
                    : "",
            page: "1",
        }));
    }, [watchAll.status.enabled, watchAll.status.disabled]);

    return (
        <Paper>
            <BoxContainer>
                <Box sx={{ paddingBottom: 0 }}>
                    <Typography variant="h2">Application List</Typography>
                </Box>
                <Box sx={{ paddingTop: 0 }}>
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
        </Paper>
    );
};

export default ApplicationSearchBar;
