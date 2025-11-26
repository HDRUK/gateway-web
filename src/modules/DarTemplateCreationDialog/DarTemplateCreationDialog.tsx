import { Grid } from "@mui/material";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Typography from "@/components/Typography";
import useDialog from "@/hooks/useDialog";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { colors } from "@/config/theme";
import { AddIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";

const TRANSLATION_PATH = "pages.account.team.dar.template.createModal";

interface DarTemplateCreationDialogProps {
    payload: { team_id: number; user_id: number };
}

const BUTTON_SX = {
    backgroundColor: colors.white,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    p: 2,
    maxWidth: "300px",
    justifySelf: "center",
    color: colors.grey700,

    "&:not(:disabled)": {
        h2: {
            color: colors.purple500,
        },

        "&:hover, &:focus": {
            backgroundColor: colors.purple500,
            h2: {
                color: colors.white,
            },
            color: colors.grey300,
        },
    },
};

const DarTemplateCreationDialog = ({
    payload,
}: DarTemplateCreationDialogProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const router = useRouter();

    const { hideDialog } = useDialog();

    const createNewTemplate = usePost(apis.dataAccessTemplateV1Url, {
        itemName: "DAR Template",
    });

    return (
        <Dialog onClose={() => hideDialog()} maxWidth={false} fullWidth={false}>
            <MuiDialogContent
                sx={{
                    paddingX: 4,
                    backgroundColor: colors.grey100,
                }}>
                <Grid
                    container
                    sx={{
                        justifyContent: "center",
                        alignItems: "center",
                        mt: 2,
                    }}
                    spacing={2}
                    columnSpacing={4}>
                    <Grid
                        size={{
                            mobile: 12,
                            desktop: 6,
                        }}>
                        <Button
                            onClick={() => {
                                createNewTemplate(payload).then(res => {
                                    const templateId = res;
                                    const redirectUrl = `${RouteName.DAR_TEMPLATES}/${templateId}`;
                                    router.push(redirectUrl);
                                });
                                hideDialog();
                            }}
                            variant="text"
                            sx={BUTTON_SX}>
                            <AddIcon />
                            <>
                                <Typography variant="h2">
                                    {t(`web.heading`)}
                                </Typography>
                                <Typography>{t(`web.description`)}</Typography>
                            </>
                        </Button>
                    </Grid>
                    <Grid
                        size={{
                            mobile: 12,
                            desktop: 6,
                        }}>
                        <Button
                            onClick={() => {
                                const redirectUrl = `${RouteName.DAR_TEMPLATES}/file`;
                                router.push(redirectUrl);
                                hideDialog();
                            }}
                            variant="text"
                            sx={BUTTON_SX}
                            // Disabled as file creation doesn't exist yet
                            disabled>
                            <AddIcon />
                            <>
                                <Typography variant="h2">
                                    {t(`file.heading`)}
                                </Typography>
                                <Typography>{t(`file.description`)}</Typography>
                            </>
                        </Button>
                    </Grid>
                </Grid>
            </MuiDialogContent>
        </Dialog>
    );
};

export default DarTemplateCreationDialog;
