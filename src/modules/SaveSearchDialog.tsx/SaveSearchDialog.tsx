import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CircularProgress } from "@mui/material";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import * as yup from "yup";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import InputWrapper from "@/components/InputWrapper";
import Loading from "@/components/Loading";

export interface SaveSearchValues {
    name: string;
}

const TRANSLATION_PATH = "modules.dialogs.SaveSearch";

export interface SaveSearchDialogProps {
    onCancel: () => void;
    onSubmit: () => void;
    isLoading?: boolean;
}

const SaveSearchDialog = ({
    onCancel,
    onSubmit,
    isLoading,
}: SaveSearchDialogProps) => {
    const t = useTranslations(TRANSLATION_PATH);

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

    return (
        <Dialog title={t("name")} showCloseButton={false}>
            <form onSubmit={handleSubmit(onSubmit)}>
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
