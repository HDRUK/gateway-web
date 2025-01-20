import { Control, useFieldArray } from "react-hook-form";
import { IconButton } from "@mui/material";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
import { AddIcon, CloseIcon } from "@/consts/icons";

interface SelectMultipleOptionsProps {
    control: Control;
    name: string;
}

const SelectMultipleOptions = ({
    control,
    name,
}: SelectMultipleOptionsProps) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });

    const handleAdd = () =>
        append({
            label: "",
        });

    const handleRemove = (indexToRemove: number) => remove(indexToRemove);

    return (
        <BoxContainer sx={{ mb: 2 }}>
            {fields.map((option, index) => (
                <Box
                    sx={{
                        p: 0,
                        m: 0,
                    }}>
                    <Box
                        key={option.value}
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            p: 0,
                            m: 0,
                        }}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                alignItems: "center",
                                alignContents: "center",
                                m: 0,
                                py: 0,
                                px: 0,
                                justifyContent: "space-between",
                                width: "100%",
                            }}>
                            <TextField
                                key={option.value}
                                control={control}
                                name={`${name}.${index}.label`}
                                label=""
                                sx={{
                                    backgroundColor: "white",
                                    minWidth: "350px",
                                }}
                                formControlSx={{
                                    marginBottom: 0,
                                }}
                                placeholder="Option label"
                            />

                            <IconButton
                                size="large"
                                onClick={() => handleRemove(index)}
                                sx={{ mt: 0 }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            ))}

            <Box sx={{ p: 0, mb: 3, mt: 1 }}>
                <Button onClick={handleAdd} startIcon={<AddIcon />}>
                    Add option
                </Button>
            </Box>
        </BoxContainer>
    );
};

export default SelectMultipleOptions;
