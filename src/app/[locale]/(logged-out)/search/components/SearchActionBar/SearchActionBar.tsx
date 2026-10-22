"use client";

import { Button } from "@hdruk/ui";
import { BookmarkBorder } from "@mui/icons-material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { Box, IconButton, Skeleton, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";
import { ViewType } from "@/interfaces/Search";
import { IconType } from "@/interfaces/Ui";
import ShowingXofX from "@/components/ShowingXofX";
import { SORT_FIELD } from "@/config/forms/search";
import { DownloadIcon, TableIcon } from "@/consts/icons";
import { exceedsResultLimit, shouldHideTotal } from "../../utils/results";
import Sort from "../Sort";
import {
    ActionBar,
    controls,
    hiddenText,
    ResultLimitText,
    resultLimit,
    resultSummary,
    sortWrapper,
    toggleViewButton,
} from "./SearchActionBar.styles";

const TRANSLATION_PATH = "pages.search";

interface ResultSummary {
    from: number;
    to: number;
    total: number;
    elastic_total: number;
    list?: unknown[];
}

interface SearchActionBarProps {
    data?: ResultSummary;
    isLoading?: boolean;
    showSummary: boolean;
    isCompact: boolean;
    sort?: string;
    sortOptions: { label: string; value: string; icon: IconType }[];
    onSortChange: (value: string) => void;
    canDownload: boolean;
    isDownloading: boolean;
    onDownload: () => void;
    canSave: boolean;
    onSave: () => void;
    showViewToggle: boolean;
    resultsView: string;
    onToggleView: () => void;
}

const SearchActionBar = ({
    data,
    isLoading = false,
    showSummary,
    isCompact,
    sort,
    sortOptions,
    onSortChange,
    canDownload,
    isDownloading,
    onDownload,
    canSave,
    onSave,
    showViewToggle,
    resultsView,
    onToggleView,
}: SearchActionBarProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const isDownloadDisabled = isDownloading || !data?.list?.length;
    const handleDownload = () => !isDownloading && onDownload();

    return (
        <>
            <Box
                sx={resultLimit}
                id="result-summary2"
                role="alert"
                aria-live="polite">
                <ResultLimitText
                    sx={
                        !isLoading && exceedsResultLimit(data)
                            ? undefined
                            : hiddenText
                    }>
                    {t("resultLimit")}
                </ResultLimitText>
            </Box>
            <ActionBar>
                <Box
                    sx={resultSummary}
                    id="result-summary"
                    role="status"
                    aria-live="polite">
                    {isLoading && (
                        <Skeleton>
                            <ShowingXofX from={1} to={25} total={100} />
                        </Skeleton>
                    )}
                    {showSummary &&
                        data &&
                        (shouldHideTotal(data) ? (
                            <ShowingXofX
                                to={data?.to}
                                from={data?.from}
                                hideTotal
                            />
                        ) : (
                            <ShowingXofX
                                to={data?.to}
                                from={data?.from}
                                total={data?.total}
                            />
                        ))}
                </Box>
                {!isCompact && (
                    <Box
                        aria-label="results controls"
                        role="region"
                        sx={controls}>
                        <Box sx={sortWrapper}>
                            <Sort
                                key={sort}
                                sortName={SORT_FIELD}
                                defaultValue={sort}
                                submitAction={onSortChange}
                                sortOptions={sortOptions}
                                iconised={false}
                                disabled={isLoading}
                            />
                        </Box>
                        {canDownload && (
                            <Button
                                onClick={handleDownload}
                                purpose="tertiary"
                                startIcon={<DownloadIcon />}
                                disabled={isDownloadDisabled}>
                                {t("downloadResults")}
                            </Button>
                        )}
                        <Button
                            purpose="tertiary"
                            disabled={!canSave}
                            onClick={onSave}
                            startIcon={<BookmarkBorder />}>
                            {t("saveSearch")}
                        </Button>
                        {showViewToggle && (
                            <Button
                                purpose="secondary"
                                sx={toggleViewButton}
                                onClick={onToggleView}
                                startIcon={
                                    resultsView === ViewType.LIST ? (
                                        <FormatListBulletedIcon />
                                    ) : (
                                        <TableIcon />
                                    )
                                }>
                                {resultsView === ViewType.LIST
                                    ? t("components.Search.toggleLabelTable")
                                    : t("components.Search.toggleLabelList")}
                            </Button>
                        )}
                    </Box>
                )}
                {isCompact && (
                    <Box sx={controls}>
                        <Sort
                            key={sort}
                            sortName={SORT_FIELD}
                            defaultValue={sort}
                            submitAction={onSortChange}
                            sortOptions={sortOptions}
                            iconised
                            disabled={isLoading}
                        />

                        {canDownload && (
                            <Tooltip title={t("downloadResults")}>
                                <IconButton
                                    color="primary"
                                    onClick={handleDownload}
                                    disabled={isDownloadDisabled}>
                                    <DownloadIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                        <Tooltip title={t("saveSearch")}>
                            <IconButton
                                color="primary"
                                disabled={!canSave}
                                onClick={onSave}>
                                <BookmarkBorder />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
            </ActionBar>
        </>
    );
};

export default SearchActionBar;
