"use client";

import Button from "@/components/Button";
import { useTranslations } from "@/mocks/next-intl";

export default function CookieToggle() {
    const t = useTranslations("pages.about.cookies");
    return (
        <>
            <Button
                onClick={() => {
                    if (window.Optanon?.ToggleInfoDisplay) {
                        window.Optanon.ToggleInfoDisplay();
                    }
                }}>
                {t("settings")}
            </Button>
        </>
    );
}
