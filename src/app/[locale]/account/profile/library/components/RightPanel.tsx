"use client";

import { useMemo } from "react";
import { FileUploadOutlined } from "@mui/icons-material";
import { Divider, Stack, Tooltip } from "@mui/material";
import { uniq } from "lodash";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { PageTemplatePromo } from "@/interfaces/Cms";
import { SelectedLibrary } from "@/interfaces/Library";
import Box from "@/components/Box";
import Button from "@/components/Button";
import CohortDiscoveryButton from "@/components/CohortDiscoveryButton";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import FeasibilityEnquirySidebar from "@/modules/FeasibilityEnquirySidebar";
import GeneralEnquirySidebar from "@/modules/GeneralEnquirySidebar";
import useDataAccessRequest from "@/hooks/useDataAccessRequest";
import useSidebar from "@/hooks/useSidebar";
import { colors } from "@/config/theme";
import { DarTemplateType } from "@/consts/dataAccess";
import { QuestionAnswerIcon, DeleteForeverIcon } from "@/consts/icons";
import { createDarSidebarData } from "../utils";

const TRANSLATION_PATH = "pages.account.profile.library.components.RightPanel";
const TRANSLATION_PATH_DAR =
    "pages.account.profile.library.components.RightPanel.dataAccessRequest";

interface RightPanelProps {
    selected: SelectedLibrary;
    handleRemove: (id: string) => void;
    cohortDiscovery: PageTemplatePromo;
}

const RightPanel = ({
    selected,
    handleRemove,
    cohortDiscovery,
}: RightPanelProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const tDar = useTranslations(TRANSLATION_PATH_DAR);
    const { showSidebar } = useSidebar();
    const { createDARApplication } = useDataAccessRequest();
    const path = usePathname();

    const selectedDatasets = useMemo(() => {
        return Object.values(selected)
            .filter(item => item.selected)
            .map(item => {
                return {
                    datasetId: Number(item.datasetId),
                    name: item.name,
                    teamId: Number(item.teamId),
                    teamName: item.teamName,
                    darEnabled: item.darEnabled,
                    darTemplatePublished: item.darTemplatePublished,
                    cohortEnabled: item.cohortEnabled,
                    darTemplateType: item.darTemplateType,
                };
            });
    }, [selected]);

    const selectedLibraryIds = useMemo(
        () => Object.keys(selected).filter(key => selected[key].selected),
        [selected]
    );

    const handleGeneralEnquiries = () => {
        showSidebar({
            title: t("generalEnquiries.sidebarTitle"),
            content: <GeneralEnquirySidebar datasets={selectedDatasets} />,
        });
    };

    const handleFeasibilityEnquiries = () => {
        showSidebar({
            title: t("feasibilityEnquiries.sidebarTitle"),
            content: <FeasibilityEnquirySidebar datasets={selectedDatasets} />,
        });
    };

    const handleMultiDelete = () => {
        selectedLibraryIds.forEach(id => handleRemove(id));
    };

    const handleDar = () => {
        const datasetIds = uniq(
            selectedDatasets.map(dataset => dataset.datasetId)
        );
        const teamIds = uniq(selectedDatasets.map(dataset => dataset.teamId));

        createDARApplication({
            datasetIds,
            teamIds,
            redirectPath: path,
        });
    };

    const darSidebarData = useMemo(() => {
        return createDarSidebarData(selectedDatasets);
    }, [selectedDatasets]);

    return (
        <Paper sx={{ mb: 2 }}>
            <Box
                sx={{
                    bgcolor: "white",
                    p: 2,
                    gap: 2,
                    alignItems: "center",
                }}>
                <Box sx={{ p: 0 }}>
                    <Typography variant="h2">
                        {t("generalEnquiries.title")}
                    </Typography>
                    <Typography>{t("generalEnquiries.text")}</Typography>
                    <Tooltip
                        title={
                            selectedDatasets.length > 0
                                ? ""
                                : t("generalEnquiries.buttonTooltip")
                        }>
                        <div>
                            <Button
                                onClick={handleGeneralEnquiries}
                                sx={{ mt: 2, width: "100%" }}
                                disabled={!(selectedDatasets.length > 0)}>
                                <QuestionAnswerIcon sx={{ pr: 1 }} />
                                {t("generalEnquiries.buttonText")}
                            </Button>
                        </div>
                    </Tooltip>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ p: 0 }}>
                    <Typography variant="h2">
                        {t("feasibilityEnquiries.title")}
                    </Typography>
                    <Typography>{t("feasibilityEnquiries.text")}</Typography>
                    <Tooltip
                        title={
                            selectedDatasets.length > 0
                                ? ""
                                : t("feasibilityEnquiries.buttonTooltip")
                        }>
                        <div>
                            <Button
                                onClick={handleFeasibilityEnquiries}
                                sx={{ mt: 2, width: "100%" }}
                                disabled={!(selectedDatasets.length > 0)}>
                                <QuestionAnswerIcon sx={{ pr: 1 }} />
                                {t("feasibilityEnquiries.buttonText")}
                            </Button>
                        </div>
                    </Tooltip>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ p: 0 }}>
                    <Typography variant="h2">{tDar("title")}</Typography>
                    <Typography>{tDar("text")}</Typography>
                    {selectedDatasets.length > 0 && (
                        <Box
                            sx={{
                                backgroundColor: colors.grey100,
                                border: `1px solid ${colors.grey400}`,
                                gap: 1,
                                display: "flex",
                                flexDirection: "column",
                                mt: 2,
                            }}>
                            <Stack
                                direction="row"
                                useFlexGap
                                sx={{
                                    justifyContent: "space-between",
                                    borderBottom: `1px solid ${colors.grey300}`,
                                    pb: 1,
                                }}>
                                <Stack direction="row" sx={{ p: 0, gap: 1 }}>
                                    <Box
                                        sx={{
                                            p: 0,
                                            width: 18,
                                            height: 18,
                                            borderRadius: "50%",
                                            background:
                                                darSidebarData.type ===
                                                DarTemplateType.DOCUMENT.toLowerCase()
                                                    ? colors.purple100
                                                    : darSidebarData.type ===
                                                      DarTemplateType.FORM.toLowerCase()
                                                    ? colors.purple500
                                                    : `linear-gradient(to right, ${colors.purple100} 50%,${colors.purple500} 50%)`,
                                        }}
                                    />
                                    <Typography>
                                        {darSidebarData.type &&
                                            tDar(darSidebarData.type)}
                                    </Typography>
                                </Stack>
                                <Typography>
                                    <Typography
                                        component="span"
                                        sx={{
                                            color: colors.grey600,
                                            mr: 1,
                                        }}>
                                        {tDar("selectedDatasets")}
                                    </Typography>
                                    {selectedDatasets.length}
                                </Typography>
                            </Stack>
                            <Typography>
                                {darSidebarData.info &&
                                    tDar(darSidebarData.info)}
                            </Typography>
                        </Box>
                    )}
                    <Tooltip
                        title={
                            !selectedDatasets.every(
                                dataset =>
                                    dataset.darEnabled &&
                                    dataset.darTemplatePublished
                            )
                                ? tDar("buttonTooltipDar")
                                : selectedDatasets.length > 0
                                ? ""
                                : tDar("buttonTooltip")
                        }>
                        <div>
                            <Button
                                onClick={handleDar}
                                sx={{ mt: 2, width: "100%" }}
                                disabled={
                                    !darSidebarData.enabled ||
                                    !(selectedDatasets.length > 0) ||
                                    !selectedDatasets.every(
                                        dataset =>
                                            dataset.darEnabled &&
                                            dataset.darTemplatePublished
                                    )
                                }>
                                <FileUploadOutlined sx={{ pr: 1 }} />
                                {tDar("buttonText")}
                            </Button>
                        </div>
                    </Tooltip>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ p: 0 }}>
                    <Typography variant="h2">
                        {t("cohortDiscovery.title")}
                    </Typography>
                    <Typography>{t("cohortDiscovery.text")}</Typography>
                    <div>
                        <CohortDiscoveryButton
                            sx={{ mt: 2, width: "100%" }}
                            disabledOuter={
                                !(selectedDatasets.length > 0) ||
                                !selectedDatasets.every(
                                    dataset => dataset.cohortEnabled
                                )
                            }
                            ctaLink={
                                cohortDiscovery?.template?.promofields?.ctaLink
                            }
                            showDatasetExplanatoryTooltip
                            tooltipOverride={
                                !selectedDatasets.every(
                                    dataset => dataset.cohortEnabled
                                )
                                    ? t("cohortDiscovery.buttonTooltipCohort")
                                    : selectedDatasets.length > 0
                                    ? ""
                                    : t("cohortDiscovery.buttonTooltip")
                            }
                        />
                    </div>
                </Box>
                {selectedDatasets.length > 1 && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Box
                            sx={{
                                p: 2,
                                m: 0,
                                backgroundColor: colors.grey,
                            }}>
                            <Button
                                color="greyCustom"
                                variant="outlined"
                                onClick={handleMultiDelete}
                                sx={{
                                    width: "100%",
                                    backgroundColor: "greyCustom.light",
                                }}>
                                <DeleteForeverIcon
                                    color="primary"
                                    sx={{ pr: 1 }}
                                />
                                {t("multiDelete.label")}
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Paper>
    );
};

export default RightPanel;
