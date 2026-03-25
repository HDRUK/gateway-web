"use client";

import { useState } from "react";
import {
    RadioGroup,
    Card,
    CardActionArea,
    Box,
    CardMedia,
    CardContent,
    Stack,
    FormControlLabel,
    Typography,
    FormControl,
    Grid,
} from "@mui/material";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import Dialog from "@/components/Dialog";
import ModalButtons from "@/components/ModalButtons";
import StyledRadio from "@/components/StyledRadio";
import theme from "@/config/theme";
import { RouteName } from "@/consts/routeName";
import { DATASETS, DATA_USES, CUSTODIAN } from "@/consts/translation";

const dataCustodianPreview = "/images/widgets/data_custodian.png";
const dataUsePreview = "/images/widgets/data_use.png";
const datasetsPreview = "/images/widgets/datasets.png";

type TemplateValue =
    | typeof CUSTODIAN
    | typeof DATASETS
    | typeof DATA_USES
    | "blank";

type TemplateOption = {
    value: TemplateValue;
    title: string;
    description: string;
    thumbnail?: string;
};

const OPTIONS: TemplateOption[] = [
    {
        value: CUSTODIAN,
        title: "Data Custodian widget",
        description:
            "This widget allows users to show users your catalogue of datasets, data uses , publications etc from the Gateway.",
        thumbnail: dataCustodianPreview,
    },
    {
        value: DATASETS,
        title: "Datasets search widget",
        description:
            "This widget allows users to search Datasets across the Gateway.",
        thumbnail: datasetsPreview,
    },
    {
        value: DATA_USES,
        title: "Data Uses search widget",
        description:
            "This widget allows users to search Data Uses across the Gateway.",
        thumbnail: dataUsePreview,
    },
    {
        value: "blank",
        title: "Start from scratch",
        description:
            "Select the options you want without starting from an existing template.",
    },
];

const TRANSLATION_PATH = "pages.account.team.widgets.createmodal";
const IMAGE_HEIGHT = "30vh";

const cardActionAreaSx = {
    height: "100%",
    alignItems: "stretch",
    display: "flex",
    flexDirection: "column",
};

const cardMediaSx = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
};

type RouteParams = {
    teamId: string;
};

const CreateWidgetDialog = () => {
    const t = useTranslations(TRANSLATION_PATH);
    const { teamId } = useParams<RouteParams>();
    const { push } = useRouter();
    const [templateType, setTemplateType] = useState<TemplateValue>("blank");

    return (
        <Dialog title={t("title")} maxWidth="desktop">
            <Stack sx={{ p: 3 }}>
                <MuiDialogContent>
                    <FormControl component="fieldset" fullWidth>
                        <RadioGroup
                            value={templateType}
                            onChange={(_, v) =>
                                setTemplateType(v as TemplateValue)
                            }
                            name="template-picker">
                            <Grid container spacing={3}>
                                {OPTIONS.map(opt => {
                                    return (
                                        <Grid
                                            size={{
                                                mobile: 6,
                                                laptop: 3,
                                                desktop: 3,
                                            }}
                                            key={opt.value}>
                                            <Card
                                                sx={{
                                                    height: "100%",
                                                    position: "relative",
                                                }}>
                                                <CardActionArea
                                                    onClick={() =>
                                                        setTemplateType(
                                                            opt.value
                                                        )
                                                    }
                                                    sx={cardActionAreaSx}>
                                                    {opt.thumbnail ? (
                                                        <Box
                                                            sx={{
                                                                width: "100%",
                                                                position:
                                                                    "relative",
                                                                height: IMAGE_HEIGHT,
                                                            }}>
                                                            <CardMedia
                                                                component="img"
                                                                image={
                                                                    opt.thumbnail
                                                                }
                                                                alt={`${opt.description} image`}
                                                                sx={cardMediaSx}
                                                            />
                                                        </Box>
                                                    ) : (
                                                        <Box
                                                            sx={{
                                                                border: `2px solid ${theme.palette.secondary.main}`,
                                                                height: IMAGE_HEIGHT,
                                                            }}
                                                        />
                                                    )}

                                                    <CardContent
                                                        sx={{
                                                            flexGrow: 1,
                                                            px: 0,
                                                        }}>
                                                        <Stack>
                                                            <FormControlLabel
                                                                value={
                                                                    opt.value
                                                                }
                                                                sx={{
                                                                    alignItems:
                                                                        "flex-start",
                                                                }}
                                                                control={
                                                                    <StyledRadio
                                                                        color="success"
                                                                        sx={{
                                                                            py: 0,
                                                                        }}
                                                                    />
                                                                }
                                                                label={
                                                                    <Stack
                                                                        spacing={
                                                                            1
                                                                        }>
                                                                        <Typography>
                                                                            {
                                                                                opt.title
                                                                            }
                                                                        </Typography>
                                                                        <Typography color="text.secondary">
                                                                            {
                                                                                opt.description
                                                                            }
                                                                        </Typography>
                                                                    </Stack>
                                                                }
                                                            />
                                                        </Stack>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </RadioGroup>
                    </FormControl>
                </MuiDialogContent>

                <MuiDialogActions>
                    <ModalButtons
                        confirmText={t("confirm")}
                        cancelText={t("cancel")}
                        onSuccess={() =>
                            push(
                                `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.INTEGRATIONS}/${RouteName.WIDGETS}/create?template=${templateType}`
                            )
                        }
                    />
                </MuiDialogActions>
            </Stack>
        </Dialog>
    );
};

export default CreateWidgetDialog;
