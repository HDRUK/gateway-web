import { useState } from "react";
import { Button } from "@hdruk/ui";
import { tokens } from "@hdruk/ui/theme";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import { ListItem, ListItemText } from "@mui/material";
import DOMPurify from "isomorphic-dompurify";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import { SearchResultDataset } from "@/interfaces/Search";
import Box from "@/components/Box";
import CohortDiscoveryButton from "@/components/CohortDiscoveryButton";
import Link from "@/components/Link";
import MenuDropdown from "@/components/MenuDropdown";
import Typography from "@/components/Typography";
import DatasetQuickViewDialog from "@/modules/DatasetQuickViewDialog";
import useAuth from "@/hooks/useAuth";
import useDataAccessRequest from "@/hooks/useDataAccessRequest";
import useDialog from "@/hooks/useDialog";
import useFeasibilityEnquiry from "@/hooks/useFeasibilityEnquiry";
import useGeneralEnquiry from "@/hooks/useGeneralEnquiry";
import useLibraryToggle from "@/hooks/useLibraryToggle";
import { CohortIcon, SpeechBubbleIcon } from "@/consts/customIcons";
import { ChevronThinIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import { formatTextDelimiter } from "@/utils/dataset";
import { getDateRange, getPopulationSize } from "@/utils/search";
import { Highlight, ResultTitle } from "./ResultCard.styles";

interface ResultCardProps {
    result: SearchResultDataset;
    isCohortDiscoveryDisabled: boolean;
}

const TRANSLATION_PATH = "pages.search.components.ResultCard";
const COHORT_DISCOVERY_PATH = "isCohortDiscovery";

const ResultCard = ({ result, isCohortDiscoveryDisabled }: ResultCardProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { showDialog } = useDialog();

    const highlight = get(result, "highlight");
    const { isLoggedIn } = useAuth();
    const { _id: datasetId, metadata, team } = result;
    const showGeneralEnquiry = useGeneralEnquiry();
    const showFeasibilityEnquiry = useFeasibilityEnquiry();
    const { showDARApplicationModal } = useDataAccessRequest();

    const resultId = `result-title-${datasetId}`;

    const redirectPath = searchParams
        ? `${pathname}?${searchParams.toString()}`
        : pathname;

    const { isInLibrary, toggleLibrary, mutateLibraries } = useLibraryToggle({
        datasetId: +datasetId,
        redirectPath,
        handlePostLoginAction: false,
    });

    const handleClickQuickView = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.stopPropagation();
        showDialog(DatasetQuickViewDialog, { result });
    };

    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(
        null
    );

    const handleOpenDropdownMenu = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorElement(event.currentTarget);
    };

    const handleGeneralEnquiryClick = (
        event?: React.MouseEvent<HTMLElement>
    ) => {
        event?.stopPropagation();
        setAnchorElement(null);

        showGeneralEnquiry({ dataset: result, isLoggedIn, redirectPath });
    };

    const handleFeasibilityEnquiryClick = (
        event?: React.MouseEvent<HTMLElement>
    ) => {
        event?.stopPropagation();
        setAnchorElement(null);

        showFeasibilityEnquiry({
            dataset: result,
            isLoggedIn,
            mutateLibraries,
            redirectPath,
        });
    };

    const handleStartDarRequest = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorElement(null);

        showDARApplicationModal({
            onGeneralEnquiryClick: handleGeneralEnquiryClick,
            onFeasibilityEnquiryClick: handleFeasibilityEnquiryClick,
            isDarEnabled: team.is_question_bank,
            hasPublishedDarTemplate: team.has_published_dar_template,
            url: `/${RouteName.DATASET_ITEM}/${datasetId}`,
            teamName: team.name,
            modalHeader: team.dar_modal_header,
            modalContent: team.dar_modal_content,
            modalFooter: team.dar_modal_footer,
            datasetIds: [+datasetId],
            teamIds: [team.id],
            redirectPath: pathname,
        });
    };

    const isCohortDiscovery = get(result, COHORT_DISCOVERY_PATH);

    const menuItems = [
        {
            label: "General enquiry",
            action: handleGeneralEnquiryClick,
        },
        {
            label: "Feasibility enquiry",
            action: handleFeasibilityEnquiryClick,
        },
        {
            label: "Start a Data Access Request",
            action: handleStartDarRequest,
        },
        ...(isCohortDiscovery
            ? [
                  {
                      label: "Start a Cohort Discovery query",
                      button: (
                          <CohortDiscoveryButton
                              showDatasetExplanatoryTooltip
                              purpose="link"
                              clickedAction={() => setAnchorElement(null)}
                          />
                      ),
                      icon: (
                          <CohortIcon
                              color={
                                  !isCohortDiscoveryDisabled
                                      ? "primary"
                                      : "greyCustom"
                              }
                              sx={{ mr: 1 }}
                          />
                      ),
                  },
              ]
            : []),
    ];

    const handleToggleLibraryItem = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        toggleLibrary();
    };

    if (!metadata) return null;

    // If available, display the first of the highlights from the abstract, or failing that from the description.
    // Fallback is the (un-highlighted) abstract.
    const formattedText =
        highlight?.abstract?.[0] ??
        highlight?.description?.[0] ??
        metadata.summary.abstract;
    const datasetAliases = metadata.summary.datasetAliases;
    const linkHref = `/${RouteName.DATA_CUSTODIANS_ITEM}/${team.id}`;

    return (
        <ListItem
            sx={{ p: 0, borderBottom: `1px solid ${tokens.status.grey}` }}
            alignItems="flex-start">
            <section
                style={{ width: "100%" }}
                aria-description={`Result for ${metadata.summary.shortTitle}`}>
                <ListItemText
                    disableTypography
                    sx={{ padding: 2, paddingBottom: 1, m: 0 }}
                    primary={
                        <ResultTitle
                            sx={{
                                flexDirection: {
                                    xs: "column",
                                    sm: "column",
                                    md: "row",
                                },
                                mb: 1.5,
                            }}>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}>
                                <h3 style={{ margin: 0 }}>
                                    <Link
                                        id={resultId}
                                        href={`${RouteName.DATASET_ITEM}/${datasetId}`}
                                        fontSize={16}
                                        fontWeight={600}
                                        marginBottom={0.5}
                                        marginRight={{
                                            sm: 0,
                                            md: 1,
                                        }}>
                                        {metadata.summary.shortTitle}
                                    </Link>
                                </h3>
                                <Link
                                    href={linkHref}
                                    sx={{ display: "inline-block" }}>
                                    <Typography
                                        aria-description="Data Custodian"
                                        sx={{
                                            textDecoration: "uppercase",
                                            fontWeight: 400,
                                            fontSize: 14,
                                            color: "secondary",
                                            mb: 1.5,
                                            mr: {
                                                sm: 0,
                                                md: 1,
                                            },
                                        }}>
                                        {team.name}
                                    </Typography>
                                </Link>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "end",
                                    textAlign: "end",
                                    marginBottom: 1.5,
                                }}>
                                <Button
                                    onClick={handleToggleLibraryItem}
                                    variant="outlined"
                                    aria-label={
                                        isInLibrary
                                            ? t("removeFromLibrary")
                                            : `${t("addToLibrary")} for ${
                                                  metadata.summary.shortTitle
                                              }`
                                    }
                                    // color="secondary"
                                    startIcon={
                                        isInLibrary ? (
                                            <Bookmark color="secondary" />
                                        ) : (
                                            <BookmarkBorder color="secondary" />
                                        )
                                    }
                                    sx={{
                                        alignSelf: "flex-start",
                                    }}>
                                    {isInLibrary
                                        ? t("removeFromLibrary")
                                        : t("addToLibrary")}
                                </Button>
                                <Button
                                    aria-label={`${t("actions")} for ${
                                        metadata.summary.shortTitle
                                    }`}
                                    startIcon={
                                        <SpeechBubbleIcon
                                            sx={{ fill: "white" }}
                                        />
                                    }
                                    endIcon={
                                        <ChevronThinIcon
                                            fontSize="medium"
                                            style={{ color: "white" }}
                                        />
                                    }
                                    sx={{
                                        ml: 2,
                                        px: 3,
                                        alignSelf: "flex-start",
                                    }}
                                    onClick={handleOpenDropdownMenu}>
                                    {t("actions")}
                                </Button>
                                <MenuDropdown
                                    handleClose={() => setAnchorElement(null)}
                                    menuItems={menuItems}
                                    anchorElement={anchorElement}
                                    title={metadata.summary.shortTitle}
                                    stopPropagation
                                />
                            </div>
                        </ResultTitle>
                    }
                    primaryTypographyProps={{
                        color: "primary",
                        fontWeight: 600,
                        fontSize: 16,
                        mb: 1.5,
                    }}
                    secondary={
                        <section aria-describedby={resultId}>
                            <Highlight
                                sx={{ mb: 1.5 }}
                                component="div"
                                variant="body2"
                                color="text.gray"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(formattedText),
                                }}
                            />
                            {!!datasetAliases?.length && (
                                <Typography
                                    variant="body2"
                                    color="text.gray"
                                    sx={{ mb: 1.5 }}>
                                    {t("matchedAliases")}:{" "}
                                    {formatTextDelimiter(datasetAliases)}
                                </Typography>
                            )}
                            <Box
                                sx={{
                                    p: 0,
                                    display: "flex",
                                    flexDirection: {
                                        xs: "column",
                                        sm: "row",
                                    },
                                    justifyContent: "space-between",
                                }}>
                                <Typography
                                    color={tokens.brand.secondary}
                                    sx={{ fontSize: 16 }}>
                                    {t("populationSize")}:{" "}
                                    {getPopulationSize(
                                        metadata,
                                        t("populationSizeNotReported")
                                    )}
                                </Typography>
                                <Typography
                                    color={tokens.brand.secondary}
                                    sx={{
                                        fontSize: 16,
                                        mb: {
                                            xs: 1,
                                            sm: 0,
                                        },
                                    }}>
                                    {t("dateLabel")}: {getDateRange(metadata)}
                                </Typography>
                                <Typography>
                                    <Button
                                        onClick={handleClickQuickView}
                                        purpose="secondary">
                                        {t("showAll")}
                                    </Button>
                                </Typography>
                            </Box>
                        </section>
                    }
                />
            </section>
        </ListItem>
    );
};

export default ResultCard;
