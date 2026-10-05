import { IconButton } from "@mui/material";
import { useTranslations } from "next-intl";
import { DeleteForeverIcon } from "@/consts/icons";

const TRANSLATION_PATH = "pages.saved_searches";

interface DeleteActionProps {
    name: string;
    onDelete: () => void;
}

export default function DeleteAction({ name, onDelete }: DeleteActionProps) {
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <IconButton
            aria-label={t("deleteAction", { name })}
            onClick={onDelete}
            sx={{ p: 0 }}>
            <DeleteForeverIcon color="primary" />
        </IconButton>
    );
}
