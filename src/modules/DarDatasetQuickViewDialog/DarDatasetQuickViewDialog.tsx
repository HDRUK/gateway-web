import { FC, useMemo } from "react";
import { Divider } from "@mui/material";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { DataAccessRequestApplication } from "@/interfaces/DataAccessRequestApplication";
import Box from "@/components/Box";
import Dialog from "@/components/Dialog";
import EllipsisCharacterLimit from "@/components/EllipsisCharacterLimit";
import Typography from "@/components/Typography";
import useDialog from "@/hooks/useDialog";
import { RouteName } from "@/consts/routeName";

const TRANSLATION_PATH = "modules.dialogs.DarDatasetQuickView";
const TITLE_CHARACTER_LIMIT = 120;
const CHARACTER_LIMIT = 50;

interface DarDatasetQuickViewDialogProps {
    application: DataAccessRequestApplication;
    teamId?: string;
}
type Dataset = {
    dataset_id: number;
    dataset_name: string;
    custodian_name: string;
    custodian_id: number;
};

type DatasetGroup = {
    custodian_id: number;
    custodian_name: string;
    datasets: Dataset[];
};

interface CustodianDatasetsProps {
    group: DatasetGroup;
    showCustodianName?: boolean;
    push: (url: string) => void;
}

const CustodianDatasets: FC<CustodianDatasetsProps> = ({
    group,
    showCustodianName = true,
    push,
}) => {
    return (
        <Box key={group.custodian_id} sx={{ pl: 0, pr: 0 }}>
            {showCustodianName && (
                <Typography variant="h3" mb={2}>
                    {group.custodian_name}
                </Typography>
            )}
            <Box sx={{ display: "flex", flexWrap: "wrap", p: 0 }} gap={1}>
                {group.datasets.map(dataset => (
                    <EllipsisCharacterLimit
                        key={dataset.dataset_id}
                        text={dataset.dataset_name}
                        isButton
                        characterLimit={CHARACTER_LIMIT}
                        onClick={() =>
                            push(
                                `/${RouteName.DATASET_ITEM}/${dataset.dataset_id}`
                            )
                        }
                    />
                ))}
            </Box>
        </Box>
    );
};

const DatasetQuickViewDialog = ({
    application,
    teamId,
}: DarDatasetQuickViewDialogProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { hideDialog } = useDialog();
    const { push } = useRouter();

    const formattedTitle =
        application.project_title.length > TITLE_CHARACTER_LIMIT
            ? `${application.project_title.slice(0, TITLE_CHARACTER_LIMIT)}...`
            : application.project_title;

    const groupedDatasets = useMemo(
        () =>
            application.datasets.reduce<DatasetGroup[]>((grouped, dataset) => {
                const {
                    dataset_id,
                    dataset_title,
                    custodian: { id: custodian_id, name: custodian_name },
                } = dataset;

                // Find if the custodian group already exists in the array
                const existingGroup = grouped.find(
                    group => group.custodian_id === custodian_id
                );

                if (existingGroup) {
                    // If the group exists, add the dataset to that group
                    existingGroup.datasets.push({
                        dataset_id,
                        dataset_name: dataset_title,
                        custodian_name,
                        custodian_id,
                    });
                } else {
                    // If the group doesn't exist, create a new group
                    grouped.push({
                        custodian_id,
                        custodian_name,
                        datasets: [
                            {
                                dataset_id,
                                dataset_name: dataset_title,
                                custodian_name,
                                custodian_id,
                            },
                        ],
                    });
                }

                return grouped;
            }, []),
        [application.datasets]
    );

    const teamDatasets = useMemo(
        () =>
            groupedDatasets.filter(
                group => group.custodian_id.toString() === teamId?.toString()
            ),
        [groupedDatasets, teamId]
    );

    const otherDatasets = useMemo(
        () =>
            groupedDatasets.filter(
                group => group.custodian_id.toString() !== teamId?.toString()
            ),
        [groupedDatasets, teamId]
    );

    return (
        <Dialog
            titleSx={{ paddingLeft: 4 }}
            title={formattedTitle}
            onClose={() => hideDialog()}>
            <MuiDialogContent sx={{ paddingX: 4 }}>
                <Typography variant="h3">{t("datasets")}</Typography>

                {teamId &&
                    teamDatasets.map(group => (
                        <CustodianDatasets
                            group={group}
                            push={push}
                            showCustodianName={false}
                            key={group.custodian_id}
                        />
                    ))}

                {!!otherDatasets.length && (
                    <>
                        {teamId && (
                            <>
                                <Divider sx={{ mt: 2 }} />
                                <Typography variant="h3" p={0} mb={2} mt={4}>
                                    {t("otherCustodianDatasets")}
                                </Typography>
                            </>
                        )}

                        {otherDatasets.map(group => (
                            <CustodianDatasets
                                group={group}
                                push={push}
                                key={group.custodian_id}
                            />
                        ))}
                    </>
                )}
            </MuiDialogContent>
        </Dialog>
    );
};

export default DatasetQuickViewDialog;
