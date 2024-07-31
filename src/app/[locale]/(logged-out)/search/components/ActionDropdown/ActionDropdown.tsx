import { useEffect, useState } from "react";
import { BookmarkBorder } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { Library, NewLibrary } from "@/interfaces/Library";
import { SearchResultDataset } from "@/interfaces/Search";
import MenuDropdown from "@/components/MenuDropdown";
import useDelete from "@/hooks/useDelete";
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
    const { _id: datasetId } = result;

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
        `${apis.librariesV1Url}?perPage=1000`
    );
    useEffect(() => {
        const libraries_dataset_ids = libraryData.map(a => a.dataset_id);
        if (libraries_dataset_ids.includes(Number(datasetId))) {
            setLibraryToggle(true);
        }
    }, [libraryData]);

    const addLibrary = usePost<NewLibrary>(apis.librariesV1Url);

    const deleteLibrary = useDelete(apis.librariesV1Url, {
        itemName: `Library`,
    });

    const handleAddRemoveLibrary = async (
        event: React.MouseEvent<HTMLElement>
    ) => {
        event.stopPropagation();
        if (!isLibraryToggled) {
            const payload: NewLibrary = {
                user_id: 1,
                dataset_id: +datasetId,
            };
            addLibrary(payload).then(res => {
                if (res) {
                    mutateLibraries();
                    setLibraryToggle(true);
                }
            });
        } else {
            const library_id_to_delete = libraryData.find(
                element =>
                    element.user_id === 1 &&
                    element.dataset_id === Number(datasetId)
            ).id;

            await deleteLibrary(library_id_to_delete);

            mutateLibraries();
            setLibraryToggle(false);
        }
    };

    const libraryItem = [
        {
            label: isLibraryToggled ? "Remove from library" : "Add to Library",
            icon: <BookmarkBorder color="primary" sx={{ mr: 1 }} />,
            action: handleAddRemoveLibrary,
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
