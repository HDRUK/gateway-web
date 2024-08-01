import { useCallback, useState, useEffect } from "react";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import { Divider, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { KeyedMutator } from "swr";
import { Library, NewLibrary } from "@/interfaces/Library";
import { SearchResultDataset } from "@/interfaces/Search";
import Box from "@/components/Box";
import Button from "@/components/Button";
import MenuDropdown from "@/components/MenuDropdown";
import Typography from "@/components/Typography";
import DatasetQuickViewDialog from "@/modules/DatasetQuickViewDialog";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAuth from "@/hooks/useAuth";
import useDelete from "@/hooks/useDelete";
import useDialog from "@/hooks/useDialog";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { SpeechBubbleIcon } from "@/consts/customIcons";
import { ChevronThinIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import { COMPONENTS, PAGES, SEARCH } from "@/consts/translation";
import { getDateRange, getPopulationSize } from "@/utils/search";
import { Highlight, ResultTitle } from "./ResultCard.styles";
import menuItems from "./config";

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
    const router = useRouter();
    const { showDialog } = useDialog();
    const metadata = get(result, "metadata");
    const highlight = get(result, "highlight");
    const { isLoggedIn, user } = useAuth();
    const { _id: datasetId } = result;

    const [isLibraryToggled, setLibraryToggle] = useState(false);

    useEffect(() => {
        const librariesDatasetIds: Number[] = libraryData?.map(a => a.dataset_id);
        if (librariesDatasetIds?.includes(Number(datasetId))) {
            setLibraryToggle(true);
        }
    }, [libraryData, datasetId]);

    const addLibrary = usePost<NewLibrary>(apis.librariesV1Url);

    const deleteLibrary = useDelete(apis.librariesV1Url, {
        itemName: `Library`,
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
                ).id;

                await deleteLibrary(libraryIdToDelete);

                mutateLibraries();
                setLibraryToggle(false);
            }
        } else {
            showDialog(ProvidersDialog, { isProvidersDialog: true });
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
                <ListItemButton component="a" onClick={handleClickItem}>
                    <ListItemText
                        primary={
                            <ResultTitle>
                                {metadata.summary.shortTitle}
                                <div style={{ textAlign: "end" }}>
                                    <Button
                                        onClick={handleToggleLibraryItem}
                                        variant="outlined"
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
                            <>
                                <Typography
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
                            </>
                        }
                    />
                </ListItemButton>
            </ListItem>
            <Divider component="li" />
        </>
    );
};

export default ResultCard;
