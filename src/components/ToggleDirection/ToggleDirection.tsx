import { Control, useController } from "react-hook-form";
import { Button } from "@hdruk/ui";
import { useTranslations } from "next-intl";
import { SortAscIcon, SortDescIcon } from "@/consts/icons";
import { SortDirection } from "@/consts/sort";

const TRANSLATION_PATH = "components.ToggleDirection";

interface ToggleDirectionProps {
    control: Control;
    name: string;
}

const ToggleDirection = ({ control, name }: ToggleDirectionProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { field } = useController({
        name,
        control,
    });

    return (
        <Button
            sx={{ marginBottom: 2 }}
            purpose="link"
            aria-label={
                field.value === SortDirection.DESC
                    ? t("sortAscending")
                    : t("sortDescending")
            }
            onClick={() =>
                field.onChange(
                    field.value === SortDirection.ASC
                        ? SortDirection.DESC
                        : SortDirection.ASC
                )
            }>
            {field.value === SortDirection.DESC ? (
                <SortAscIcon color="primary" fontSize="large" />
            ) : (
                <SortDescIcon color="primary" fontSize="large" />
            )}
        </Button>
    );
};

export default ToggleDirection;
