import { useCallback, useEffect, useRef, useState } from "react";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import { Divider, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { get } from "lodash";
import uniqueId from "lodash/uniqueId";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { KeyedMutator } from "swr";
import { Library, NewLibrary } from "@/interfaces/Library";
import { SearchResultDataset } from "@/interfaces/Search";
import Box from "@/components/Box";
import Button from "@/components/Button";
import MenuDropdown from "@/components/MenuDropdown";
import Typography from "@/components/Typography";
import DarEnquiryDialog from "@/modules/DarEnquiryDialog";
import DatasetQuickViewDialog from "@/modules/DatasetQuickViewDialog";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAuth from "@/hooks/useAuth";
import useDelete from "@/hooks/useDelete";
import useDialog from "@/hooks/useDialog";
import useFeasibilityEnquiry from "@/hooks/useFeasibilityEnquiry";
import useGeneralEnquiry from "@/hooks/useGeneralEnquiry";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { SpeechBubbleIcon } from "@/consts/customIcons";
import { ChevronThinIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import { getDateRange, getPopulationSize } from "@/utils/search";
import { Highlight, ResultTitle } from "./ResultCard.styles";

interface ResultCardProps {
    result: SearchResultDataset;
    libraryData: Library[];
    mutateLibraries: KeyedMutator<Library[]>;
}

const TRANSLATION_PATH = "pages.search.components.ResultCard";

const ResultCard = ({
    result,
    libraryData,
    mutateLibraries,
}: ResultCardProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { current: resultId } = useRef(uniqueId("result-title-"));
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { showDialog } = useDialog();

    const highlight = get(result, "highlight");
    const { isLoggedIn, user } = useAuth();
    const { _id: datasetId, metadata, team } = result;
    const showGeneralEnquiry = useGeneralEnquiry();
    const showFeasibilityEnquiry = useFeasibilityEnquiry();

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

    const handleClickItem = useCallback(() => {
        router.push(`/${RouteName.DATASET_ITEM}/${datasetId}`);
    }, [datasetId, router]);

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

        showDialog(DarEnquiryDialog, {
            isDarEnabled: team.is_question_bank,
            modalHeader: team.dar_modal_header,
            modalContent: team.dar_modal_content,
            onGeneralEnquiryClick: handleGeneralEnquiryClick,
            onFeasibilityEnquiryClick: handleFeasibilityEnquiryClick,
            url: `/${RouteName.DATASET_ITEM}/${datasetId}`,
        });
    };

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
    ];

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

    return (
        <>
            <ListItem sx={{ p: 0 }} alignItems="flex-start">
                <section
                    style={{ width: "100%" }}
                    // eslint-disable-next-line
                    aria-description={`Result for ${metadata.summary.shortTitle}`}>
                    <ListItemButton onClick={handleClickItem}>
                        <ListItemText
                            primary={
                                <ResultTitle>
                                    <span
                                        id={resultId}
                                        role="heading"
                                        aria-level={3}>
                                        {metadata.summary.shortTitle}
                                    </span>
                                    <div style={{ textAlign: "end" }}>
                                        <Button
                                            onClick={handleToggleLibraryItem}
                                            variant="outlined"
                                            aria-label={
                                                isLibraryToggled
                                                    ? t("removeFromLibrary")
                                                    : `${t(
                                                          "addToLibrary"
                                                      )} for ${
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
                                            sx={{ mb: 1 }}>
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
                                            sx={{ ml: 2, mb: 1 }}
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
                            disableTypography
                            secondary={
                                <section aria-describedby={resultId}>
                                    <Typography
                                        // eslint-disable-next-line
                                        aria-description="Data Custodian"
                                        sx={{
                                            textDecoration: "uppercase",
                                            fontWeight: 400,
                                            fontSize: 16,
                                            color: "black",
                                            mb: 1.5,
                                        }}>
                                        {metadata.summary.publisher.name !==
                                        undefined
                                            ? metadata.summary.publisher.name
                                            : metadata.summary.publisher
                                                  .publisherName}
                                    </Typography>
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
                    </ListItemButton>
                </section>
            </ListItem>

            <Divider component="li" />
        </>
    );
};

export default ResultCard;
