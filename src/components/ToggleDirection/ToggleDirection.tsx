import { Control, useController } from "react-hook-form";
import { Button } from "@hdruk/ui";
import { SortAscIcon, SortDescIcon } from "@/consts/icons";

interface ToggleDirectionProps {
    control: Control;
    name: string;
}

const ToggleDirection = ({ control, name }: ToggleDirectionProps) => {
    const { field } = useController({
        name,
        control,
    });

    return (
        <Button
            sx={{ marginBottom: 2 }}
            purpose="link"
            onClick={() =>
                field.onChange(field.value === "asc" ? "desc" : "asc")
            }>
            {field.value === "desc" ? (
                <SortAscIcon color="primary" fontSize="large" />
            ) : (
                <SortDescIcon color="primary" fontSize="large" />
            )}
        </Button>
    );
};

export default ToggleDirection;
