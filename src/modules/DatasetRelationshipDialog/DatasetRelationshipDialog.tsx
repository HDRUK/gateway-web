"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import MuiDialogContent from "@mui/material/DialogContent";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { Metadata } from "@/interfaces/Dataset";
import { Library, NewLibrary } from "@/interfaces/Library";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Typography from "@/components/Typography";
import useAuth from "@/hooks/useAuth";
import useDelete from "@/hooks/useDelete";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import ProvidersDialog from "../ProvidersDialog";

interface LinkageDetails {
    linkage_type: string;
    id: string;
    metadata: Metadata;
}

interface DatasetRelationshipDialogProps {
    linkageDetails: LinkageDetails[];
}

const TRANSLATION_PATH = "modules.dialogs.DatasetRelationshipDialog";
const TOOLTIP_SUFFIX = "Tooltip";

const DatasetRelationshipDialog = ({
    linkageDetails,
}: DatasetRelationshipDialogProps) => {
    const { showDialog } = useDialog();
    const { isLoggedIn, user } = useAuth();
    const t = useTranslations(TRANSLATION_PATH);

    const [librariesDatasetIds, setLibrariesDatasetIds] = useState<number[]>(
        []
    );

    // Update the list of libraries
    const { data: libraryData, mutate: mutateLibraries } = useGet<Library[]>(
        `${apis.librariesV1Url}?perPage=1000`,
        { shouldFetch: isLoggedIn }
    );

    useEffect(() => {
        setLibrariesDatasetIds(
            libraryData ? libraryData?.map(a => a.dataset_id) : []
        );
    }, [libraryData]);

    const addLibrary = usePost<NewLibrary>(apis.librariesV1Url, {
        itemName: `Library item`,
    });

    const deleteLibrary = useDelete(apis.librariesV1Url, {
        localeKey: `updateYourLibrary`,
    });

    const handleToggleLibraryItem = async (
        datasetId: string,
        isAddedToLibrary: boolean
    ) => {
        if (isLoggedIn && user) {
            if (!isAddedToLibrary) {
                const payload: NewLibrary = {
                    user_id: user.id,
                    dataset_id: +datasetId,
                };
                addLibrary(payload).then(res => {
                    if (res) {
                        mutateLibraries();
                    }
                });
            } else {
                const libraryIdToDelete = libraryData?.find(
                    element =>
                        element.user_id === user?.id &&
                        element.dataset_id === Number(datasetId)
                )?.id;

                if (!libraryIdToDelete) {
                    return;
                }

                await deleteLibrary(libraryIdToDelete);
                mutateLibraries();
            }
        } else {
            showDialog(ProvidersDialog, { isProvidersDialog: true });
        }
    };

    return (
        <Dialog
            title={t(linkageDetails[0]?.linkage_type)}
            titleTooltip={t(
                `${linkageDetails[0]?.linkage_type}${TOOLTIP_SUFFIX}`
            )}
            titleSx={{ display: "flex", justifyContent: "flex-start" }}
            maxWidth="laptop">
            <MuiDialogContent>
                <BoxContainer
                    sx={{
                        maxHeight: "50vh",
                        overflowY: "auto",
                        mt: 1,
                    }}>
                    {linkageDetails.map(linkage => {
                        const isAddedToLibrary = librariesDatasetIds.includes(
                            +linkage.id
                        );

                        const memberOf = get(
                            linkage,
                            "metadata.original_metadata.summary.publisher.memberOf"
                        );

                        return (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    p: 0,
                                    mb: 3,
                                }}
                                gap={2}>
                                <div>
                                    <Typography variant="h3" component="p">
                                        {get(
                                            linkage,
                                            "metadata.metadata.summary.title"
                                        )}
                                    </Typography>
                                    <Typography>
                                        {memberOf && `${memberOf} > `}
                                        {get(
                                            linkage,
                                            "metadata.metadata.summary.publisher.publisherName"
                                        )}
                                    </Typography>
                                </div>
                                <Button
                                    onClick={() =>
                                        handleToggleLibraryItem(
                                            linkage.id,
                                            isAddedToLibrary
                                        )
                                    }
                                    variant="outlined"
                                    aria-label={
                                        isAddedToLibrary
                                            ? t("removeFromLibrary")
                                            : `${t("addToLibrary")} for
                                     ${get(
                                         linkage,
                                         "metadata.metadata.summary.shortTitle"
                                     )}`
                                    }
                                    startIcon={
                                        isAddedToLibrary ? (
                                            <Bookmark color="secondary" />
                                        ) : (
                                            <BookmarkBorder color="secondary" />
                                        )
                                    }>
                                    {isAddedToLibrary
                                        ? t("removeFromLibrary")
                                        : t("addToLibrary")}
                                </Button>
                            </Box>
                        );
                    })}
                </BoxContainer>
            </MuiDialogContent>
        </Dialog>
    );
};

export default DatasetRelationshipDialog;
