import { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Dataset } from "@/interfaces/Dataset";
import { IconType } from "@/interfaces/Ui";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import DatasetCard from "@/components/DatasetCard";
import DownloadCSV from "@/components/DownloadCSV";
import InputWrapper from "@/components/InputWrapper";
import Pagination from "@/components/Pagination";
import Paper from "@/components/Paper";
import ShowingXofX from "@/components/ShowingXofX";
import apis from "@/config/apis";
import {
    searchFilter,
    sortField,
    toggleDirection,
} from "@/config/forms/datasetAccountSearch";
import {
    PAGES,
    ACCOUNT,
    TEAM,
    DATASETS,
    COMPONENTS,
} from "@/consts/translation";

interface DatasetTabProps {
    list?: Dataset[];
    actions: {
        icon: IconType;
        href?: string;
        action?: (id: number) => void;
        label: string;
    }[];
    lastPage?: number;
    from?: number;
    to?: number;
    control: Control;
    total?: number;
    label: string;
    currentPage: number;
    setValue: (name: string, value: unknown) => void;
    setCurrentPage: (page: number) => void;
    isLoading: boolean;
}

const DatasetTab = ({
    actions,
    list,
    label,
    lastPage,
    from,
    to,
    total,
    currentPage,
    setCurrentPage,
    control,
    setValue,
    isLoading,
}: DatasetTabProps) => {
    const params = useParams<{ teamId: string }>();

    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.DatasetTab`
    );

    return (
        <Box sx={{ p: 0 }}>
            <BoxContainer
                sx={{
                    my: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                <Box sx={{ p: 0, width: "50%" }}>
                    <InputWrapper
                        setValue={setValue}
                        control={control}
                        {...searchFilter}
                    />
                </Box>
                <BoxContainer
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}>
                    <Box sx={{ p: 0 }}>
                        <InputWrapper control={control} {...sortField} />
                    </Box>
                    <Box sx={{ p: 0 }}>
                        <InputWrapper control={control} {...toggleDirection} />
                    </Box>
                </BoxContainer>
            </BoxContainer>

            <Box
                sx={{
                    p: 0,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                <ShowingXofX from={from} to={to} total={total} />
                <DownloadCSV
                    buttonText={t("downloadButton")}
                    apiPath={`${apis.datasetsExportV1Url}?team_id=${params?.teamId}`}
                />
            </Box>

            {(list || [])
                .map(dataset => (
                    <DatasetCard
                        actions={actions}
                        key={dataset.id}
                        dataset={dataset}
                    />
                ))
                .filter(dataset => !!dataset)}
            {list?.length === 0 && (
                <Paper sx={{ p: 2, mb: 2 }}>
                    {t("noDatasets", { status: label.toLowerCase() })}
                </Paper>
            )}
            <Pagination
                isLoading={isLoading}
                page={currentPage}
                count={lastPage}
                onChange={(e: React.ChangeEvent<unknown>, page: number) =>
                    setCurrentPage(page)
                }
            />
        </Box>
    );
};

export default DatasetTab;
