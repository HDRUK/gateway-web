import { useTranslations } from "next-intl";
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
}

const DarFormBanner = ({
    lastSavedDate,
    projectTitle,
    buttonText,
    buttonAction,
}: DarFormBannerProps) => {
    const t = useTranslations(TRANSLATION_PATH);

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
                        onClick={buttonAction}
                        size="small"
                        color="greyCustom">
                        {t(buttonText)}
                    </Button>
                )}
            </Column>
        </DetailBanner>
    );
};

export default DarFormBanner;
