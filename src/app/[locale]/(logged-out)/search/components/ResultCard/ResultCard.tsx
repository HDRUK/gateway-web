import { useCallback, useState, useRef } from "react";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import {
    Button,
    Divider,
    ListItem,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Library, NewLibrary } from "@/interfaces/Library";
import { SearchResultDataset } from "@/interfaces/Search";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Typography from "@/components/Typography";
import DatasetQuickViewDialog from "@/modules/DatasetQuickViewDialog";
import useDialog from "@/hooks/useDialog";
import MenuDropdown from "@/components/MenuDropdown";
import Typography from "@/components/Typography";
import useDelete from "@/hooks/useDelete";
import useGet from "@/hooks/useGet";
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
}

const TRANSLATION_PATH = `${PAGES}.${SEARCH}.${COMPONENTS}.ResultCard`;

const getLibraries = () => {
    return useGet<Library[]>(`${apis.librariesV1Url}?perPage=1000`);
};

const ResultCard = ({ result }: ResultCardProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const router = useRouter();
    const { showDialog } = useDialog();
    const metadata = get(result, "metadata");
    const highlight = get(result, "highlight");
    const { _id: datasetId } = result;
    const libraries = getLibraries();
    console.log("getLibraries", libraries);

    const [isLibraryToggled, setLibraryToggle] = useState(false);

    if (!!libraries.data) {
        const libraries_dataset_ids = libraries.data.map(a => a.dataset_id);
        console.log(libraries_dataset_ids);
        // if ( libraries_dataset_ids.includes( Number(datasetId) )) {
        //     setLibraryToggle(true);
        // }
    }
    // const isLibraryToggled =

    const addLibrary = usePost<NewLibrary>(`${apis.librariesV1Url}`);

    // const deleteLibrary(id: number) => {
    //      useDelete(`${apis.librariesV1Url}/${id}`);
    // }

    const handleClickItem = useCallback(() => {
        router.push(`/${RouteName.DATASET_ITEM}/${datasetId}`);
    }, [datasetId, router]);

    const handleClickQuickView = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.stopPropagation();
        showDialog(DatasetQuickViewDialog, { result });
        
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(
        null
    );

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorElement(event.currentTarget);
    };

    const handleAddRemoveLibrary = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        if (!isLibraryToggled) {
            // call post request, await response
            const payload: NewLibrary = {
                user_id: 1,
                dataset_id: +datasetId,
            };
            addLibrary(payload).then(res => {
                console.log(res);
                if (res) {
                    setLibraryToggle(true);
                }
            });
            //if success, set toggle
            // const success = true;
            // if (success) {
            //     setLibraryToggle(true);
            // }
        } else {
            // search for libraryId by datasetId and userId.
            // const libraries = getLibraries();
            // const library_to_delete = libraries.data.find(
            //     element =>
            //         element.user_id === 1 && element.dataset_id === +datasetId
            // );
            // console.log(library_to_delete);
            // const payload: NewLibrary = {
            //     user_id: 1,
            //     dataset_id: datasetId,
            // };
            // call delete request, await response

            // deleteLibrary(libraryId).then(res => {
            //     console.log(res);
            //     if (res) {
            //         setLibraryToggle(true);
            //     }
            // });
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
                                <div>
                                    <Button
                                        // ref={libraryRef}
                                        onClick={handleAddRemoveLibrary}
                                        variant="outlined"
                                        startIcon={
                                            isLibraryToggled ? (
                                                <Bookmark color="secondary" />
                                            ) : (
                                                <BookmarkBorder color="secondary" />
                                            )
                                        }
                                        sx={{ mr: 2 }}>
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
                                        onClick={handleOpenNavMenu}>
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
