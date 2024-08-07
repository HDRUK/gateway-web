import { useEffect, useState } from "react";
import { BookmarkBorder, Bookmark } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
import { RouteName } from "@/consts/routeName";
import { COMPONENTS, PAGES, SEARCH } from "@/consts/translation";
import menuItems from "./config";
import useAddLibraryModal from "./hooks/useAddLibraryModal";

interface ResultCardProps {
    result: SearchResultDataset;
}

const TRANSLATION_PATH = `${PAGES}.${SEARCH}.${COMPONENTS}.ResultCard`;

const ActionDropdown = ({ result }: ResultCardProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { showDialog } = useDialog();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { _id: datasetId } = result;
    const { isLoggedIn, user } = useAuth();
    const router = useRouter();

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

    const addLibrary = usePost<NewLibrary>(apis.librariesV1Url, {
        localeKey: "updateYourLibrary",
    });

    const onAddLibrary = () => {
        const payload: NewLibrary = {
            user_id: user?.id,
            dataset_id: +datasetId,
        };
        return addLibrary(payload);
    };

    const onAddAndContinue = () => {
        onAddLibrary().then(res => {
            if (res) {
                mutateLibraries();
                setLibraryToggle(true);
            }
        });
    };

    const onAddAndRedirect = () => {
        onAddLibrary().then(() => {
            router.push(
                `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.LIBRARY}`
            );
        });
    };

    const { showLibraryModal } = useAddLibraryModal({
        onAddAndRedirect,
        onAddAndContinue,
    });

    const handleClickAddLibrary = () => {
        showLibraryModal();
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

                await deleteLibrary(libraryIdToDelete);

                mutateLibraries();
                setLibraryToggle(false);
            }
        } else {
            let redirectPath = pathname;
            if (searchParams) {
                redirectPath = `${redirectPath}?${searchParams.toString()}`;
            }

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
