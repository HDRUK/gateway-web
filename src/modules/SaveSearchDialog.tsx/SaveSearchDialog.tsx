import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import * as yup from "yup";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import InputWrapper from "@/components/InputWrapper";

export interface SaveSearchValues {
    name: string;
}

const TRANSLATION_PATH = "modules.dialogs.SaveSearch";

export interface SaveSearchDialogProps {
    onCancel: () => void;
    onSubmit: (values: SaveSearchValues) => void;
}

const SaveSearchDialog = ({ onCancel, onSubmit }: SaveSearchDialogProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const [isLoading, setIsLoading] = useState(false);

    const validationSchema = yup.object({
        name: yup.string().required(t("nameRequired")),
    });

    const { control, handleSubmit } = useForm<SaveSearchValues>({
        mode: "onTouched",
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: "",
        },
    });

    const handleSaveQuerySubmit = async (values: SaveSearchValues) => {
        setIsLoading(true);

        await onSubmit(values);

        setIsLoading(false);
    };

    return (
        <Dialog title={t("name")} showCloseButton={false}>
            <form onSubmit={handleSubmit(handleSaveQuerySubmit)}>
                <MuiDialogContent>
                    <InputWrapper
                        component="TextField"
                        control={control}
                        label={t("nameLabel")}
                        name="name"
                    />
                </MuiDialogContent>
                <MuiDialogActions>
                    <Button
                        variant="outlined"
                        autoFocus
                        color="secondary"
                        onClick={onCancel}>
                        {t("cancelButton")}
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        {t("saveQueryButton")}
                    </Button>
                </MuiDialogActions>
            </form>
        </Dialog>
    );
};

export default SaveSearchDialog;
