import { Dispatch, SetStateAction } from "react";
import IconButton from "@mui/material/IconButton";
import SelectMultipleOption from "@/components/SelectMultipleOption";
import { AddIcon, RemoveIcon } from "@/consts/icons";
import Box from "../Box";
import BoxContainer from "../BoxContainer";

interface Option {
    label: string;
    value: string | number;
}

interface SelectMultipleOptionProps {
    options: Option[];
    setOptions: Dispatch<SetStateAction<Option[]>>;
}

const SelectMultipleOptions = ({
    options,
    setOptions,
}: SelectMultipleOptionProps) => {
    const handleAdd = () =>
        setOptions(prevOptions => {
            const newOption = {
                label: "",
                value: "",
            };

            return [...prevOptions, newOption];
        });

    const handleRemove = (indexToRemove: number) => {
        setOptions(prevOptions =>
            prevOptions.filter((_, index) => index !== indexToRemove)
        );
    };

    return (
        <BoxContainer
            sx={{
                p: 2,
                m: 0,
            }}>
            {options.map((option, index) => (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "center",
                        alignContent: "center",
                        p: 0,
                        m: 0,
                    }}>
                    <SelectMultipleOption option={option} />
                    <Box sx={{ p: 0, m: 0 }}>
                        <IconButton
                            size="large"
                            edge="start"
                            onClick={
                                index === options.length - 1
                                    ? handleAdd
                                    : () => handleRemove(index)
                            }>
                            {index === options.length - 1 ? (
                                <AddIcon />
                            ) : (
                                <RemoveIcon />
                            )}
                        </IconButton>
                    </Box>
                </Box>
            ))}
        </BoxContainer>
    );
};

export default SelectMultipleOptions;
