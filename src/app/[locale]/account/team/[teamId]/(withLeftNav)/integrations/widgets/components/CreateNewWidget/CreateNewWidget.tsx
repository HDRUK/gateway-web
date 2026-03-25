"use client";

import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import useDialog from "@/hooks/useDialog";
import { AddIcon } from "@/consts/icons";
import CreateWidgetDialog from "../CreateWidgetDialog/CreateWidgetDialog";

const TRANSLATION_PATH = "pages.account.team.widgets.createmodal";

export default function CreateNewWidget() {
    const { showDialog } = useDialog();
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <Button
            startIcon={<AddIcon />}
            sx={{ mt: 5, mb: 3 }}
            onClick={() => showDialog(CreateWidgetDialog)}>
            {t("create")}
        </Button>
    );
}
