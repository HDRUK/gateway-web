import { useEffect, Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { Option } from "@/interfaces/Option";
import useDebounce from "@/hooks/useDebounce";
import Box from "../Box";
import TextField from "../TextField";

interface SelectMultipleOptionProps {
    id: number;
    option: Option;
    setOptions: Dispatch<SetStateAction<Option[]>>;
}

const SelectMultipleOption = ({
    id,
    option,
    setOptions,
}: SelectMultipleOptionProps) => {
    const { control, reset, watch } = useForm();

    useEffect(() => {
        reset(option);
    }, [reset, option]);

    const debouncedLabel = useDebounce(watch("label") || option.label, 100, 1);

    useEffect(() => {
        setOptions(prevOptions =>
            prevOptions.map((prevOption, index) =>
                index === id
                    ? { value: option.value, label: debouncedLabel }
                    : prevOption
            )
        );
    }, [debouncedLabel, id, option.value, setOptions]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                alignContents: "center",
                gap: 2,
                m: 0,
                py: 0,
                px: 1,
            }}>
            <TextField
                data-testid={`input-${option.value}`}
                formControlSx={{
                    marginBottom: 0,
                }}
                sx={{
                    backgroundColor: "white",
                }}
                label=""
                name="label"
                placeholder="label"
                control={control}
            />
        </Box>
    );
};

export default SelectMultipleOption;
