import Button from "@/components/Button";
import { SortAscIcon, SortDescIcon } from "@/consts/icons";
import { Control, useController } from "react-hook-form";

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
            variant="link"
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
