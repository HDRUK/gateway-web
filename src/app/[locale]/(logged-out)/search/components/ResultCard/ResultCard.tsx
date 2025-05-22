import { useEffect, useRef, useState } from "react";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import { Divider, ListItem, ListItemText } from "@mui/material";
import { get } from "lodash";
import uniqueId from "lodash/uniqueId";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import { KeyedMutator } from "swr";
import { PageTemplatePromo } from "@/interfaces/Cms";
import { Library, NewLibrary } from "@/interfaces/Library";
import { SearchResultDataset } from "@/interfaces/Search";
import { isValueNumber } from "@/interfaces/isValueNumber";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Link from "@/components/Link";
import MenuDropdown from "@/components/MenuDropdown";
import Typography from "@/components/Typography";
import DatasetQuickViewDialog from "@/modules/DatasetQuickViewDialog";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAuth from "@/hooks/useAuth";
import useDataAccessRequest from "@/hooks/useDataAccessRequest";
import useDelete from "@/hooks/useDelete";
import useDialog from "@/hooks/useDialog";
import useFeasibilityEnquiry from "@/hooks/useFeasibilityEnquiry";
import useGeneralEnquiry from "@/hooks/useGeneralEnquiry";
import usePost from "@/hooks/usePost";
import usePostLoginActionCookie from "@/hooks/usePostLoginAction";
import apis from "@/config/apis";
import { CohortIcon, SpeechBubbleIcon } from "@/consts/customIcons";
import { ChevronThinIcon } from "@/consts/icons";
import { PostLoginActions } from "@/consts/postLoginActions";
import { RouteName } from "@/consts/routeName";
import { getDateRange, getPopulationSize } from "@/utils/search";
import CohortDiscoveryButton from "../../../about/cohort-discovery/components/CohortDiscoveryButton";
import { Highlight, ResultTitle } from "./ResultCard.styles";

interface ResultCardProps {
    result: SearchResultDataset;
    libraryData: Library[];
    mutateLibraries: KeyedMutator<Library[]>;
    isCohortDiscoveryDisabled: boolean;
    cohortDiscovery: PageTemplatePromo;
}

const TRANSLATION_PATH = "pages.search.components.ResultCard";
const COHORT_DISCOVERY_PATH = "isCohortDiscovery";

const ResultCard = ({
    result,
    libraryData,
    mutateLibraries,
    isCohortDiscoveryDisabled,
    cohortDiscovery,
}: ResultCardProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { current: resultId } = useRef(uniqueId("result-title-"));
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { showDialog } = useDialog();

    const highlight = get(result, "highlight");
    const { isLoggedIn, user } = useAuth();
    const { _id: datasetId, metadata, team } = result;
    const showGeneralEnquiry = useGeneralEnquiry();
    const showFeasibilityEnquiry = useFeasibilityEnquiry();
    const { showDARApplicationModal } = useDataAccessRequest();

    const [isLibraryToggled, setLibraryToggle] = useState(false);

    const redirectPath = searchParams
        ? `${pathname}?${searchParams.toString()}`
        : pathname;

    useEffect(() => {
        const librariesDatasetIds: number[] = libraryData?.map(
            a => a.dataset_id
        );
        if (librariesDatasetIds?.includes(Number(datasetId))) {
            setLibraryToggle(true);
        }
    }, [libraryData, datasetId]);

    const addLibrary = usePost<NewLibrary>(apis.librariesV1Url, {
        itemName: `Library item`,
    });

    const deleteLibrary = useDelete(apis.librariesV1Url, {
        itemName: `Library item`,
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
            url: `/${RouteName.DATASET_ITEM}/${datasetId}`,
            modalHeader: team.dar_modal_header,
            modalContent: team.dar_modal_content,
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
                              ctaLink={
                                  cohortDiscovery.template.promofields.ctaLink
                              }
                              showDatasetExplanatoryTooltip
                              variant="link"
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

    const { setPostLoginActionCookie } = usePostLoginActionCookie({});

    const handleToggleLibraryItem = async (
        event: React.MouseEvent<HTMLElement>
    ) => {
        event.stopPropagation();
        if (isLoggedIn) {
            if (!isLibraryToggled) {
                const payload: NewLibrary = {
                    user_id: user?.id,
                    dataset_id: +datasetId,
                };
                addLibrary(payload).then(res => {
                    if (res) {
                        mutateLibraries();
                        setLibraryToggle(true);
                    }
                });
            } else {
                const libraryIdToDelete = libraryData.find(
                    element =>
                        element.user_id === user?.id &&
                        element.dataset_id === Number(datasetId)
                )?.id;

                if (!libraryIdToDelete) {
                    return;
                }

                if (libraryIdToDelete) {
                    await deleteLibrary(libraryIdToDelete);

                    mutateLibraries();
                    setLibraryToggle(false);
                }
            }
        } else {
            setPostLoginActionCookie(PostLoginActions.ADD_LIBRARY, {
                datasetId: Number(datasetId),
            });

            showDialog(ProvidersDialog, {
                isProvidersDialog: true,
                redirectPath,
            });
        }
    };

    if (!metadata) return null;

    // If available, display the first of the highlights from the abstract, or failing that from the description.
    // Fallback is the (un-highlighted) abstract.
    const formattedText =
        highlight?.abstract?.[0] ??
        highlight?.description?.[0] ??
        metadata.summary.abstract;
    const dataCustodianId = metadata.summary.publisher.gatewayId;
    // if the below is false, its because the api has failed to find the team id based off the original uid for gatewayId
    const isNumber = isValueNumber(dataCustodianId);
    const linkHref = `/${RouteName.DATA_PROVIDERS_ITEM}/${dataCustodianId}`;

    return (
        <>
            <ListItem sx={{ p: 0 }} alignItems="flex-start">
                <section
                    style={{ width: "100%" }}
                    // eslint-disable-next-line
                    aria-description={`Result for ${metadata.summary.shortTitle}`}>
                    <ListItemText
                        disableTypography
                        sx={{ padding: 2, paddingBottom: 1, m: 0 }}
                        primary={
                            <ResultTitle>
                                <Link
                                    id={resultId}
                                    href={`${RouteName.DATASET_ITEM}/${datasetId}`}
                                    role="heading"
                                    aria-level={3}
                                    fontSize={16}
                                    fontWeight={600}
                                    marginBottom={2}>
                                    {metadata.summary.shortTitle}
                                </Link>
                                <div
                                    style={{
                                        display: "flex",
                                        textAlign: "end",
                                    }}>
                                    <Button
                                        onClick={handleToggleLibraryItem}
                                        variant="outlined"
                                        aria-label={
                                            isLibraryToggled
                                                ? t("removeFromLibrary")
                                                : `${t("addToLibrary")} for ${
                                                      metadata.summary
                                                          .shortTitle
                                                  }`
                                        }
                                        startIcon={
                                            isLibraryToggled ? (
                                                <Bookmark color="secondary" />
                                            ) : (
                                                <BookmarkBorder color="secondary" />
                                            )
                                        }
                                        sx={{ alignSelf: "flex-start" }}>
                                        {isLibraryToggled
                                            ? t("removeFromLibrary")
                                            : t("addToLibrary")}
                                    </Button>
                                    <Button
                                        aria-label={`${t("actions")} for ${
                                            metadata.summary.shortTitle
                                        }`}
                                        variant="contained"
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
                                        handleClose={() =>
                                            setAnchorElement(null)
                                        }
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
                                {isNumber && (
                                    <Link
                                        href={linkHref}
                                        sx={{ display: "inline-block" }}>
                                        <Typography
                                            // eslint-disable-next-line
                                            aria-description="Data Custodian"
                                            sx={{
                                                textDecoration: "uppercase",
                                                fontWeight: 400,
                                                fontSize: 14,
                                                color: "secondary",
                                                mb: 1.5,
                                            }}>
                                            {metadata.summary.publisher.name !==
                                            undefined
                                                ? metadata.summary.publisher
                                                      .name
                                                : metadata.summary.publisher
                                                      .publisherName}
                                        </Typography>
                                    </Link>
                                )}

                                {!isNumber && (
                                    <Typography
                                        // eslint-disable-next-line
                                        aria-description="Data Custodian"
                                        sx={{
                                            textDecoration: "uppercase",
                                            fontWeight: 400,
                                            fontSize: 14,
                                            color: "secondary",
                                            mb: 1.5,
                                        }}>
                                        {metadata.summary.publisher.name !==
                                        undefined
                                            ? metadata.summary.publisher.name
                                            : metadata.summary.publisher
                                                  .publisherName}
                                    </Typography>
                                )}
                                <Highlight
                                    sx={{ mb: 1.5 }}
                                    component="div"
                                    variant="body2"
                                    color="text.gray"
                                    dangerouslySetInnerHTML={{
                                        __html: formattedText,
                                    }}
                                />
                                <Box
                                    sx={{
                                        p: 0,
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}>
                                    <Typography
                                        color="secondary"
                                        sx={{ fontSize: 16 }}>
                                        {t("populationSize")}:{" "}
                                        {getPopulationSize(
                                            metadata,
                                            t("populationSizeNotReported")
                                        )}
                                    </Typography>
                                    <Typography
                                        color="secondary"
                                        sx={{ fontSize: 16 }}>
                                        {t("dateLabel")}:{" "}
                                        {getDateRange(metadata)}
                                    </Typography>
                                    <Typography>
                                        <Button
                                            onClick={handleClickQuickView}
                                            color="secondary"
                                            variant="outlined">
                                            {t("showAll")}
                                        </Button>
                                    </Typography>
                                </Box>
                            </section>
                        }
                    />
                </section>
            </ListItem>

            <Divider component="li" />
        </>
    );
};

export default ResultCard;
