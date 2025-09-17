import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import {
    Column,
    DetailBanner,
    Justify,
} from "@/components/FormBanner/FormBanner.styles";
import Typography from "@/components/Typography";
import { LAST_SAVED_DATE_FORMAT } from "@/config/forms/dataAccessApplication";
import { AccessTimeIcon } from "@/consts/icons";
import { formatDate } from "@/utils/date";

const TRANSLATION_PATH = "pages.account.team.dar.application.create";

interface DarFormBannerProps {
    lastSavedDate?: Date;
    projectTitle?: string;
    buttonText?: string;
    buttonAction?: () => Promise<void> | void | undefined;
    downloadButtonEnabled?: boolean;
    downloadButtonUrl?: string;
}

const DarFormBanner = ({
    lastSavedDate,
    projectTitle,
    buttonText,
    buttonAction,
    downloadButtonEnabled,
    downloadButtonUrl,
}: DarFormBannerProps) => {
    const { push } = useRouter();
    const t = useTranslations(TRANSLATION_PATH);

    const downloadButtonAction = () => push(downloadButtonUrl ?? "");
    return (
        <DetailBanner sx={{ pt: 2.5, pb: 2.5 }}>
            <Column justify={Justify.START} sx={{ gap: 2 }}>
                <Typography variant="h2" component="p" sx={{ m: 0 }}>
                    {t("darRequest")}
                </Typography>
                {projectTitle && <Typography>{projectTitle}</Typography>}
            </Column>

            <Column justify={Justify.END}>
                {lastSavedDate && (
                    <>
                        <AccessTimeIcon fontSize="small" />
                        <Typography sx={{ display: "flex", ml: 1, mr: 2 }}>
                            {t("lastSaved", {
                                date: formatDate(
                                    lastSavedDate,
                                    LAST_SAVED_DATE_FORMAT
                                ),
                            })}
                        </Typography>
                    </>
                )}

                {buttonAction && buttonText && (
                    <Button
                        sx={{ display: "flex", ml: 1, mr: 2 }}
                        onClick={buttonAction}
                        size="small"
                        color="greyCustom">
                        {t(buttonText)}
                    </Button>
                )}

                {downloadButtonEnabled && (
                    <Button
                        onClick={downloadButtonAction}
                        size="small"
                        color="greyCustom">
                        {t("downloadApplication")}
                    </Button>
                )}
            </Column>
        </DetailBanner>
    );
};

export default DarFormBanner;
