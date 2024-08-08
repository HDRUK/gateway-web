import { useEffect, useState } from "react";
import { BookmarkBorder, Bookmark } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Button } from "@mui/material";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import { Library } from "@/interfaces/Library";
import { SearchResultDataset } from "@/interfaces/Search";
import MenuDropdown from "@/components/MenuDropdown";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAuth from "@/hooks/useAuth";
import useDelete from "@/hooks/useDelete";
import useDialog from "@/hooks/useDialog";
import apis from "@/config/apis";
import config from "@/config/config";
import { colors } from "@/config/theme";
import { COMPONENTS, PAGES, SEARCH } from "@/consts/translation";
import menuItems from "./config";

interface ResultCardProps {
    result: SearchResultDataset;
    libraryData: Library[];
    showLibraryModal: (props: unknown) => void;
}

const TRANSLATION_PATH = `${PAGES}.${SEARCH}.${COMPONENTS}.ResultCard`;

const ActionDropdown = ({
    result,
    libraryData,
    showLibraryModal,
}: ResultCardProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { showDialog } = useDialog();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { isLoggedIn, user } = useAuth();
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

    useEffect(() => {
        const librariesDatasetIds: number[] = libraryData?.map(
            a => a.dataset_id
        );
        if (librariesDatasetIds?.includes(Number(datasetId))) {
            setLibraryToggle(true);
        }
    }, [libraryData, datasetId]);

    const handleClickAddLibrary = () => {
        showLibraryModal({ datasetId });
    };

    const deleteLibrary = useDelete(apis.librariesV1Url, {
        localeKey: `updateYourLibrary`,
    });

    const handleToggleLibraryItem = async (
        event: React.MouseEvent<HTMLElement>
    ) => {
        event.stopPropagation();

        if (isLoggedIn) {
            if (!isLibraryToggled) {
                handleClickAddLibrary();
            } else {
                const libraryIdToDelete = libraryData.find(
                    element =>
                        element.user_id === user?.id &&
                        element.dataset_id === Number(datasetId)
                ).id;

                await deleteLibrary(libraryIdToDelete).then(() =>
                    setAnchorElement(null)
                );
                setLibraryToggle(false);
            }
        } else {
            let redirectPath = pathname;
            if (searchParams) {
                redirectPath = `${redirectPath}?${searchParams.toString()}`;
            }

            const action = config.ENTITY_ACTION_COOKIE.ACTION_ADD_LIBRARY;
            const cookieValue = JSON.stringify({ action, datasetId });
            Cookies.set(config.ENTITY_ACTION_COOKIE.COOKIE_NAME, cookieValue, {
                path: "/",
            });

            showDialog(ProvidersDialog, {
                isProvidersDialog: true,
                redirectPath,
            });
        }
    };

    const libraryItem = [
        {
            label: isLibraryToggled
                ? t("removeFromLibrary")
                : t("addToLibrary"),
            icon: isLibraryToggled ? (
                <Bookmark color="primary" />
            ) : (
                <BookmarkBorder color="primary" sx={{ mr: 1 }} />
            ),
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
