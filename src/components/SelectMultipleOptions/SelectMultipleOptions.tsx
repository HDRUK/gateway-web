import { Dispatch, SetStateAction } from "react";
import { SxProps } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Option } from "@/interfaces/Option";
import SelectMultipleOption from "@/components/SelectMultipleOption";
import { PlusIcon, RemoveIcon } from "@/consts/icons";
import Box from "../Box";
import BoxContainer from "../BoxContainer";

interface SelectMultipleOptionProps {
    options: Option[];
    setOptions: Dispatch<SetStateAction<Option[]>>;
    containerSx?: SxProps;
}

const SelectMultipleOptions = ({
    options,
    setOptions,
    containerSx = {
        p: 2,
        m: 0,
    },
}: SelectMultipleOptionProps) => {
    const handleAdd = () =>
        setOptions(prevOptions => {
            const newOption = {
                label: "",
                value: `new-option-${prevOptions.length + 1}`,
            };

            return [...prevOptions, newOption];
        });

    const handleRemove = (indexToRemove: number) => {
        setOptions(prevOptions =>
            prevOptions.filter((_, index) => index !== indexToRemove)
        );
    };

    return (
        <BoxContainer sx={containerSx}>
            {options.map((option, index) => (
                <Box
                    key={option.value}
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "center",
                        alignContent: "center",
                        p: 0,
                        m: 0,
                    }}>
                    <SelectMultipleOption
                        key={option.value}
                        id={index}
                        option={option}
                        setOptions={setOptions}
                    />
                    <Box sx={{ p: 0, m: 0 }}>
                        <IconButton
                            data-testid={`remove-${option.value}`}
                            size="large"
                            edge="start"
                            onClick={() => handleRemove(index)}>
                            <RemoveIcon />
                        </IconButton>
                    </Box>
                    {index === options.length - 1 && (
                        <Box sx={{ p: 0, m: 0 }}>
                            <IconButton
                                data-testid={`add-after-${option.value}`}
                                size="large"
                                edge="start"
                                onClick={handleAdd}>
                                <PlusIcon />
                            </IconButton>
                        </Box>
                    )}
                </Box>
            ))}
        </BoxContainer>
    );
};

export default SelectMultipleOptions;
