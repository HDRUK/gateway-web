import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { useEffect, Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import {
    searchApiDefaultValues,
    searchApiFormFields,
} from "@/config/forms/searchApis";
import InputWrapper from "@/components/InputWrapper";

interface ApplicationSearchBarProps {
    setFilterQuery: Dispatch<SetStateAction<string>>;
}

const ApplicationSearchBar = ({
    setFilterQuery,
}: ApplicationSearchBarProps) => {
    const { control, watch } = useForm({
        defaultValues: { ...searchApiDefaultValues },
    });

    const watched = watch(["status.disabled", "status.enabled", "description"]);

    useEffect(() => {
        const [disabled, enabled, description] = watched;

        const params = new URLSearchParams({
            disabled: `${disabled}`,
            enabled: `${enabled}`,
        });

        description.forEach(item => {
            params.append("text", item);
        });

        setFilterQuery(params.toString());
    }, [setFilterQuery, watched]);

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
