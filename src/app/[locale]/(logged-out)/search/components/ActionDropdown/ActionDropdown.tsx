import { useEffect, useState } from "react";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Button } from "@mui/material";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import { KeyedMutator } from "swr";
import { PageTemplatePromo } from "@/interfaces/Cms";
import { Library } from "@/interfaces/Library";
import { SearchResultDataset } from "@/interfaces/Search";
import MenuDropdown from "@/components/MenuDropdown";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAuth from "@/hooks/useAuth";
import useDataAccessRequest from "@/hooks/useDataAccessRequest";
import useDelete from "@/hooks/useDelete";
import useDialog from "@/hooks/useDialog";
import useFeasibilityEnquiry from "@/hooks/useFeasibilityEnquiry";
import useGeneralEnquiry from "@/hooks/useGeneralEnquiry";
import usePostLoginActionCookie from "@/hooks/usePostLoginAction";
import apis from "@/config/apis";
import { colors } from "@/config/theme";
import { CohortIcon, SpeechBubbleIcon } from "@/consts/customIcons";
import { PostLoginActions } from "@/consts/postLoginActions";
import { RouteName } from "@/consts/routeName";
import { COMPONENTS, PAGES, SEARCH } from "@/consts/translation";
import CohortDiscoveryButton from "../../../about/cohort-discovery/components/CohortDiscoveryButton";

interface ResultRowProps {
    result: SearchResultDataset;
    libraryData?: Library[];
    showLibraryModal: (props: { datasetId: number }) => void;
    mutateLibraries: KeyedMutator<Library[]>;
    isCohortDiscoveryDisabled: boolean;
    cohortDiscovery: PageTemplatePromo;
}

const TRANSLATION_PATH = `${PAGES}.${SEARCH}.${COMPONENTS}.ResultCard`;
const COHORT_DISCOVERY_PATH = "isCohortDiscovery";

const ActionDropdown = ({
    result,
    libraryData,
    showLibraryModal,
    mutateLibraries,
    isCohortDiscoveryDisabled,
    cohortDiscovery,
}: ResultRowProps) => {
    const title = get(result, "metadata.summary.title");
    const t = useTranslations(TRANSLATION_PATH);
    const { showDialog } = useDialog();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { isLoggedIn, user } = useAuth();
    const { _id: datasetId, team } = result;
    const showGeneralEnquiry = useGeneralEnquiry();
    const showFeasibilityEnquiry = useFeasibilityEnquiry();
    const { showDARApplicationModal } = useDataAccessRequest();

    const redirectPath = searchParams
        ? `${pathname}?${searchParams.toString()}`
        : pathname;

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

        showGeneralEnquiry({
            dataset: result,
            isLoggedIn,
            redirectPath,
        });
    };

    const handleFeasibilityEnquiryClick = (
        event?: React.MouseEvent<HTMLElement>
    ) => {
        event?.stopPropagation();
        console.log("handleFeasibilityEnquiryClick");

        // if (isLoggedIn) {
        //     console.log("handleFeasibilityEnquiryClick isLoggedIn");

            showFeasibilityEnquiry({
                dataset: result,
                isLoggedIn,
                mutateLibraries,
                redirectPath,
            });
        // } else {
        //     console.log("handleFeasibilityEnquiryClick not isLoggedIn");
        //     console.log('result', result);
        //     setPostLoginActionCookie(
        //         PostLoginActions.OPEN_FEASIBILITY_ENQUIRY,
        //         {
        //             dataset:  {
        //                 _id: result._id,
        //                 metadata: {
        //                     summary: {
        //                         title: result.metadata.summary.title
        //                     },
        //                 },
        //                 team: {
        //                     id: result.team.id,
        //                     name: result.team.name,
        //                     member_of: result.team.member_of
        //                 }
        //             },
        //         }
        //     );

        //     showDialog(ProvidersDialog, {
        //         isProvidersDialog: true,
        //         redirectPath,
        //     });
        // }
    };

    const handleStartDarRequest = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();

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
            icon: <SpeechBubbleIcon color="primary" sx={{ mr: 1 }} />,
        },
        {
            label: "Feasibility enquiry",
            action: handleFeasibilityEnquiryClick,
            icon: <SpeechBubbleIcon color="primary" sx={{ mr: 1 }} />,
        },
        {
            label: "Start a Data Access Request",
            action: handleStartDarRequest,
            icon: <SpeechBubbleIcon color="primary" sx={{ mr: 1 }} />,
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

    const { setPostLoginActionCookie } = usePostLoginActionCookie({});

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
            setPostLoginActionCookie(PostLoginActions.ADD_LIBRARY, {
                datasetId: Number(datasetId),
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
                onClick={handleOpenDropdownMenu}
                aria-label={title ? `${t("actions")} for ${title}` : undefined}>
                {t("actions")}
            </Button>
            <MenuDropdown
                handleClose={() => setAnchorElement(null)}
                menuItems={libraryItem.concat(menuItems)}
                title={title}
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
