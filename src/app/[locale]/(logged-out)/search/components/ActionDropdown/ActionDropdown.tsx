import { useEffect, useState } from "react";
import { BookmarkBorder } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { Library, NewLibrary } from "@/interfaces/Library";
import { SearchResultDataset } from "@/interfaces/Search";
import MenuDropdown from "@/components/MenuDropdown";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAuth from "@/hooks/useAuth";
import useDelete from "@/hooks/useDelete";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { colors } from "@/config/theme";
import { COMPONENTS, PAGES, SEARCH } from "@/consts/translation";
import menuItems from "./config";

interface ResultCardProps {
    result: SearchResultDataset;
}

const TRANSLATION_PATH = `${PAGES}.${SEARCH}.${COMPONENTS}.ResultCard`;

const ActionDropdown = ({ result }: ResultCardProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { showDialog } = useDialog();
    const { _id: datasetId } = result;
    const { isLoggedIn, user } = useAuth();

    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(
        null
    );

    const handleOpenDropdownMenu = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorElement(event.currentTarget);
    };

    const [isLibraryToggled, setLibraryToggle] = useState(false);

    // Update the list of libraries
    const { data: libraryData, mutate: mutateLibraries } = useGet<Library[]>(
        `${apis.librariesV1Url}?perPage=1000`,
        { shouldFetch: isLoggedIn }
    );

    useEffect(() => {
        const librariesDatasetIds: number[] = libraryData?.map(
            a => a.dataset_id
        );
        if (librariesDatasetIds?.includes(Number(datasetId))) {
            setLibraryToggle(true);
        }
    }, [libraryData, datasetId]);

    const addLibrary = usePost<NewLibrary>(apis.librariesV1Url);

    const deleteLibrary = useDelete(apis.librariesV1Url, {
        itemName: `Library`,
    });

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

    const libraryItem = [
        {
            label: isLibraryToggled
                ? t("removeFromLibrary")
                : t("addToLibrary"),
            icon: <BookmarkBorder color="primary" sx={{ mr: 1 }} />,
            action: handleToggleLibraryItem,
        },
    ];

    return (
        <>
            <Button
                variant="contained"
                endIcon={<ArrowDropDownIcon style={{ color: colors.white }} />}
                sx={{ py: 0.5 }}
                onClick={handleOpenDropdownMenu}>
                {t("actions")}
            </Button>
            <MenuDropdown
                handleClose={() => setAnchorElement(null)}
                menuItems={libraryItem.concat(menuItems)}
                anchorElement={anchorElement}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            />
        </>
    );
};

export default ActionDropdown;
