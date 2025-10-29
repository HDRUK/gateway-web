"use client";

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-page-custom-font */
import { useCallback, useMemo, useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import {
    Box,
    Button,
    Chip,
    CssBaseline,
    GlobalStyles,
    IconButton,
    InputAdornment,
    Link,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    OutlinedInput,
    ThemeProvider,
} from "@mui/material";
import { SearchCategory } from "@/interfaces/Search";
import { WidgetEntityData } from "@/interfaces/Widget";
import BoxStacked from "@/components/BoxStacked";
import EllipsisCharacterLimit from "@/components/EllipsisCharacterLimit";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import Form from "@/components/Form";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import TooltipText from "@/components/TooltipText";
import Typography from "@/components/Typography";
import theme, { colors } from "@/config/theme";
import { CancelIcon, ChevronThinIcon, SearchIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import { formatPopulationSize } from "./utils/formatPopulationSize";
import { formatYearRange } from "./utils/formatYearRange";

const GATEWAY_URL = "https://healthdatagateway.org/en";

const TRANSLATIONS = {
    poweredBy: "Powered by",
    footerTtle: "Want to dig deeper?",
    footerDesc:
        "Cohort Discovery indentifies relevant populations across datasets",
    cohortButton: "Open Cohort Discovery",
    populationSize: "Dataset population size",
    dateRange: "Date range",
    leadOrganisation: "Lead Organisation",
    leadOrganisationTooltip:
        "The name of the legal entity that signs the contract to access the data",
    datasets: "Datasets",
    datasetsTooltip: "The name of the dataset(s) being accessed",
    dataCustodian: "Data Custodian",
    dataCustodianTooltip:
        "The individual or organisation responsible for the safe custody, transport, storage of, and access to data",
    noData: "not reported",
    notAvailable: "n/a",
};

const SEARCH_ICON_SIZE = "32px";
const CROSS_ICON_SIZE = "32px";

const btnFullWidthSx = {
    backgroundColor: "white",
    fontSize: "15px",
    "&:hover": { background: "white" },
    color: "black",
    boxShadow: "none",
    textTransform: "none",
    width: "100%",
};

const ResultRowSx = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
    p: 0,

    "&:first-of-type": {
        marginTop: theme.spacing(2),
    },
};

const ResultRowCategorySx = {
    flexBasis: "20%",
    fontWeight: 500,
    marginRight: theme.spacing(2),
};

const boxStackedSX = { aspectRatio: "1.9 / 1", minHeight: 130 };

const categoryDropdowns = {
    [SearchCategory.DATASETS]: "Datasets & Biosamples",
    data_uses: "Data Uses / Research Projects",
    scripts: "Analysis Scripts & Software",
    [SearchCategory.COLLECTIONS]: "Collections",
};

const categoryTabs = [
    {
        label: SearchCategory.DATASETS,
        value: SearchCategory.DATASETS,
    },
    {
        label: SearchCategory.DATA_USE,
        value: "data_uses",
    },
    {
        label: SearchCategory.TOOLS,
        value: "scripts",
    },
    {
        label: SearchCategory.COLLECTIONS,
        value: SearchCategory.COLLECTIONS,
    },
];

export default function WidgetDisplay({ data }: { data: WidgetEntityData }) {
    const {
        include_cohort_link,
        include_search_bar,
        // keep_proportions,
        size_height,
        size_width,
        unit,
    } = data.widget;

    const [entityType, setEntityType] = useState(SearchCategory.DATASETS);
    const [anchorEl, setAnchorEl] = useState(null);

    const [searchValue, setSearchValue] = useState("");

    const createSearchFilter = useCallback((keys: string[], query: string) => {
        const terms = (query ?? "")
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean);
        if (!terms.length) return () => true;

        return (item: Record<string, unknown>) =>
            terms.every(term =>
                keys.some(key => {
                    const value = (item as any)?.[key];
                    const text = Array.isArray(value)
                        ? value.join(" ")
                        : String(value ?? "");
                    return text.toLowerCase().includes(term);
                })
            );
    }, []);

    const resultsByType = useMemo(() => {
        const filterDatasets = createSearchFilter(
            ["title", "short_title", "description", "publisher.name"],
            searchValue
        );
        const filterCollections = createSearchFilter(["name"], searchValue);
        const filterDataUses = createSearchFilter(
            ["name", "organisation_name", "team_name"],
            searchValue
        );
        const filterTools = createSearchFilter(
            ["name", "description"],
            searchValue
        );

        return {
            [SearchCategory.DATASETS]: (
                data[SearchCategory.DATASETS] ?? []
            ).filter(filterDatasets),
            [SearchCategory.COLLECTIONS]: (
                data[SearchCategory.COLLECTIONS] ?? []
            ).filter(filterCollections),
            data_uses: (data?.data_uses ?? []).filter(filterDataUses),
            scripts: (data.scripts ?? []).filter(filterTools),
        };
    }, [data, createSearchFilter, searchValue]);

    const widgetContainer = useRef<HTMLDivElement | null>(null);

    const handleSearch = (event, searchValue: FieldValues) => {
        event.preventDefault();
        setSearchValue(searchValue);
    };

    const handleClick = e => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const CHARACTER_LIMIT = 35;

    const renderResult = (entityType: string, results: any[]) => {
        switch (entityType) {
            case SearchCategory.DATASETS:
                return (
                    <List
                        key={`list-${entityType}`}
                        sx={{
                            background: colors.grey100,
                            px: 1,
                            mt: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                        }}>
                        {results.map(result => (
                            <ListItem
                                key={`listitem-${result.id}`}
                                sx={{
                                    p: 0,
                                    mb: 1,
                                    borderBottom: `1px solid ${colors.grey300}`,
                                    background: colors.white,
                                }}>
                                <ListItemText
                                    disableTypography
                                    sx={{
                                        padding: 2,
                                        paddingBottom: 1,
                                        m: 0,
                                    }}
                                    primary={
                                        <Box
                                            sx={{
                                                flexDirection: {
                                                    mobile: "column",
                                                    tablet: "column",
                                                    laptop: "row",
                                                },
                                                mb: 1.5,
                                                display: "flex",
                                                justifyContent: "space-between",
                                                p: 0,
                                            }}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    p: 0,
                                                }}>
                                                <Link
                                                    href={`${GATEWAY_URL}/dataset/${result.id}`}
                                                    fontSize={16}
                                                    fontWeight={600}
                                                    marginBottom={0.5}
                                                    target="_blank">
                                                    {result.title}
                                                </Link>

                                                <Link
                                                    href={`${GATEWAY_URL}/data-custodian/${result.team_id}`}
                                                    target="_blank">
                                                    <Typography
                                                        // eslint-disable-next-line
                                                        aria-description="Data Custodian"
                                                        sx={{
                                                            mb: 1.5,
                                                        }}>
                                                        {result.publisher?.name}
                                                    </Typography>
                                                </Link>
                                            </Box>
                                        </Box>
                                    }
                                    secondary={
                                        <section aria-describedby={result.id}>
                                            {result.description && (
                                                <Box
                                                    sx={{
                                                        p: 0,
                                                        mb: 2,
                                                    }}>
                                                    <EllipsisLineLimit
                                                        text={
                                                            result.description
                                                        }
                                                        maxLine={2}
                                                    />
                                                </Box>
                                            )}

                                            <Box
                                                sx={{
                                                    p: 0,
                                                    display: "flex",
                                                    flexDirection: {
                                                        mobile: "column",
                                                        tablet: "row",
                                                    },
                                                    justifyContent:
                                                        "space-between",
                                                }}>
                                                <Typography
                                                    color={colors.green700}
                                                    sx={{ fontSize: 16 }}>
                                                    {`${TRANSLATIONS.populationSize}: `}
                                                    {formatPopulationSize(
                                                        result.population_size,
                                                        TRANSLATIONS.noData
                                                    )}
                                                </Typography>
                                                <Typography
                                                    color={colors.green700}
                                                    sx={{
                                                        fontSize: 16,
                                                    }}>
                                                    {`${TRANSLATIONS.dateRange}: `}
                                                    {formatYearRange(
                                                        result.start_date,
                                                        result.end_date,
                                                        TRANSLATIONS.notAvailable
                                                    )}
                                                </Typography>
                                            </Box>
                                        </section>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                );
            case SearchCategory.COLLECTIONS:
                return (
                    <Box
                        sx={{
                            display: "grid",
                            gap: 2,
                            gridTemplateColumns: {
                                mobile: "1fr",
                                tablet: "repeat(2, 1fr)",
                            },
                            p: 1,
                        }}>
                        {results.map(result => (
                            <BoxStacked sx={boxStackedSX}>
                                <Box
                                    component={Link}
                                    href={`${GATEWAY_URL}/collection/${result.id}`}
                                    sx={{
                                        color: colors.white,
                                        px: 3,
                                        py: 2,
                                        display: "flex",
                                        alignItems: "flex-end",
                                        backgroundImage: `url(${
                                            result?.image_link ||
                                            "https://media.prod.hdruk.cloud/static/default_placeholder.png"
                                        })`,
                                        backgroundColor: colors.white,
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "contain",
                                        backgroundPosition: "center",
                                        textDecoration: "none",
                                    }}>
                                    <Chip
                                        size="small"
                                        label={result.name}
                                        sx={{
                                            backgroundColor: colors.grey600,
                                            color: colors.white,
                                            maxWidth: "220px",
                                        }}
                                    />
                                </Box>
                            </BoxStacked>
                        ))}
                    </Box>
                );
            case "scripts":
                return (
                    <List
                        key={`list-${entityType}`}
                        sx={{
                            background: colors.white,
                            p: 0,
                            m: 0,
                        }}>
                        {results.map(result => (
                            <ListItem
                                alignItems="flex-start"
                                sx={{
                                    borderBottom: `1px solid ${colors.grey300}`,
                                    "&:last-of-type": {
                                        borderBottom: "none",
                                        pb: 0,
                                    },
                                }}>
                                <ListItemText
                                    disableTypography
                                    primary={
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                width: "100%",
                                                p: 0,
                                                mb: 1.5,
                                            }}>
                                            <Link
                                                href={`${GATEWAY_URL}/${RouteName.TOOL_ITEM}/${result.id}`}
                                                target="_blank"
                                                fontSize={16}
                                                fontWeight={600}>
                                                <EllipsisLineLimit
                                                    text={result.name}
                                                    component="span"
                                                />
                                            </Link>
                                        </Box>
                                    }
                                    secondary={
                                        <EllipsisLineLimit
                                            component="div"
                                            maxLine={2}
                                            sx={{
                                                margin: `${theme.spacing(
                                                    2
                                                )} 0 ${theme.spacing(1.5)}`,
                                                color: colors.grey800,
                                            }}
                                            text={
                                                result?.description ? (
                                                    <MarkDownSanitizedWithHtml
                                                        content={
                                                            result?.description
                                                        }
                                                    />
                                                ) : (
                                                    TRANSLATIONS.notAvailable
                                                )
                                            }
                                        />
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                );
            default:
                return (
                    <List
                        key={`list-${entityType}`}
                        sx={{
                            background: colors.white,
                            p: 0,
                            m: 0,
                        }}>
                        {results.map(result => (
                            <ListItem
                                sx={{
                                    p: 0,
                                    borderBottom: `1px solid ${colors.grey300}`,
                                }}
                                alignItems="flex-start">
                                <ListItemText
                                    disableTypography
                                    sx={{ padding: 2, paddingBottom: 1, m: 0 }}
                                    primary={
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}>
                                            <Link
                                                href={`${RouteName.DATA_USE_ITEM}/${result.id}`}
                                                fontSize={16}
                                                fontWeight={600}
                                                marginBottom={2}>
                                                <EllipsisLineLimit
                                                    text={result.name || ""}
                                                    showToolTip
                                                />
                                            </Link>
                                        </Box>
                                    }
                                    secondary={
                                        <>
                                            <Box sx={ResultRowSx}>
                                                <Typography
                                                    sx={ResultRowCategorySx}>
                                                    <TooltipText
                                                        content={
                                                            TRANSLATIONS.leadOrganisationTooltip
                                                        }
                                                        label={
                                                            TRANSLATIONS.leadOrganisation
                                                        }
                                                    />
                                                </Typography>

                                                {(!!result.organisation_name && (
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 500,
                                                        }}>
                                                        {
                                                            result.organisation_name
                                                        }
                                                    </Typography>
                                                )) ||
                                                    TRANSLATIONS.notAvailable}
                                            </Box>

                                            <Box sx={ResultRowSx}>
                                                <Typography
                                                    sx={ResultRowCategorySx}>
                                                    <TooltipText
                                                        content={
                                                            TRANSLATIONS.datasetsTooltip
                                                        }
                                                        label={
                                                            TRANSLATIONS.datasets
                                                        }
                                                    />
                                                </Typography>

                                                {result.dataset
                                                    ?.dataset_title ? (
                                                    <>
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                flexWrap:
                                                                    "wrap",
                                                                gap: theme.spacing(
                                                                    1
                                                                ),
                                                            }}>
                                                            <EllipsisCharacterLimit
                                                                text={
                                                                    result
                                                                        .dataset
                                                                        ?.dataset_title ||
                                                                    "TEST" ||
                                                                    ""
                                                                }
                                                                isButton
                                                                characterLimit={
                                                                    CHARACTER_LIMIT
                                                                }
                                                                href={`${GATEWAY_URL}/dataset/${result.dataset?.dataset_id}`}
                                                                target="_blank"
                                                            />
                                                        </Box>
                                                        {result.dataset
                                                            ?.dataset_count >
                                                            1 && (
                                                            <Typography
                                                                sx={{
                                                                    fontWeight: 500,
                                                                    ml: 1,
                                                                }}>
                                                                (
                                                                {
                                                                    result
                                                                        .dataset
                                                                        .dataset_count
                                                                }
                                                                )
                                                            </Typography>
                                                        )}
                                                    </>
                                                ) : (
                                                    "-"
                                                )}
                                            </Box>

                                            <Box sx={ResultRowSx}>
                                                <Typography
                                                    sx={ResultRowCategorySx}>
                                                    <TooltipText
                                                        content={
                                                            TRANSLATIONS.dataCustodianTooltip
                                                        }
                                                        label={
                                                            TRANSLATIONS.dataCustodian
                                                        }
                                                    />
                                                </Typography>
                                                {(result?.team_name && (
                                                    <Link
                                                        href={`${GATEWAY_URL}/${RouteName.DATA_CUSTODIANS_ITEM}/${result.team_id}`}
                                                        target="_blank">
                                                        {result?.member_of &&
                                                            `${result?.member_of} > `}
                                                        <EllipsisCharacterLimit
                                                            text={
                                                                result.team_name
                                                            }
                                                            characterLimit={
                                                                CHARACTER_LIMIT
                                                            }
                                                        />
                                                    </Link>
                                                )) ||
                                                    TRANSLATIONS.noData}
                                            </Box>
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                );
        }
    };

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600&display=swap&subset=latin"
                rel="stylesheet"
            />
            <ThemeProvider theme={theme}>
                <GlobalStyles
                    styles={{
                        body: {
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            minHeight: "100vh",
                        },
                    }}
                />
                <CssBaseline />
                <Box
                    sx={{
                        width: `${size_width}${unit}`,
                        height: `${size_height}${unit}`,
                        overflow: "hidden",
                        backgroundColor: theme.palette.grey[100],
                    }}
                    ref={widgetContainer}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            p: 0,
                        }}>
                        <Box
                            component="header"
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                maxHeight: "80px",
                                gap: 4,
                                width: "100%",
                                justifyContent: include_search_bar
                                    ? "space-between"
                                    : "flex-end",
                                py: 2,
                                px: 1,
                                backgroundColor: colors.white,
                                borderBottom: `1px solid ${theme.palette.grey[300]}`,
                            }}>
                            {!!include_search_bar && (
                                <Form
                                    onSubmit={handleSearch}
                                    role="search"
                                    sx={{ flexGrow: 1 }}>
                                    <OutlinedInput
                                        sx={{
                                            border: `2px solid ${theme.palette.greyCustom.main}`,
                                            fontSize: "1.25rem",
                                            marginBottom: 0,
                                            backgroundColor: "white",
                                            "& fieldset": { border: "none" },
                                            "& input": { padding: 0 },
                                            minHeight: 44,
                                        }}
                                        size="small"
                                        fullWidth
                                        placeholder="Start searching"
                                        id="search"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <SearchIcon
                                                    sx={{
                                                        fontSize:
                                                            SEARCH_ICON_SIZE,
                                                    }}
                                                    color="primary"
                                                />
                                            </InputAdornment>
                                        }
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    disableRipple
                                                    aria-label="clear text"
                                                    data-testid="reset-btn"
                                                    onClick={() =>
                                                        setSearchValue("")
                                                    }
                                                    edge="end">
                                                    <CancelIcon
                                                        fontSize={
                                                            CROSS_ICON_SIZE
                                                        }
                                                    />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        onChange={v =>
                                            setSearchValue(v.target.value)
                                        }
                                        value={searchValue}
                                    />
                                </Form>
                            )}

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: 2,
                                    p: 0,
                                }}>
                                <Typography fontSize={15}>
                                    {TRANSLATIONS.poweredBy}
                                </Typography>

                                <a
                                    href="https://healthdatagateway.org/en"
                                    target="_blank"
                                    rel="noreferrer">
                                    <img
                                        src="https://media.prod.hdruk.cloud/static/heath_data_research_gateway_logo.svg"
                                        alt="Gateway logo"
                                        width="118"
                                    />
                                </a>
                            </Box>
                        </Box>

                        <Box
                            component="nav"
                            sx={{
                                p: 0,
                            }}>
                            <Box
                                sx={{
                                    borderBottom: `3px solid ${colors.green400}`,
                                    width: "100%",
                                    p: 0,
                                }}>
                                <Button
                                    id="basic-button"
                                    aria-controls="tab-menu"
                                    aria-haspopup="true"
                                    onClick={handleClick}
                                    aria-label="Open to show search type options"
                                    title="Open to show search type options"
                                    color="secondary"
                                    sx={btnFullWidthSx}
                                    endIcon={
                                        <ChevronThinIcon color="primary" />
                                    }>
                                    {categoryDropdowns[entityType]}
                                </Button>
                                <Menu
                                    container={() =>
                                        widgetContainer.current as Element
                                    }
                                    id="entity-menu"
                                    keepMounted
                                    anchorEl={anchorEl}
                                    open={!!anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "left",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "left",
                                    }}
                                    MenuListProps={{
                                        "aria-labelledby": "basic-button",
                                        sx: { p: 0 },
                                    }}
                                    slotProps={{
                                        paper: {
                                            sx: {
                                                mt: "3px",
                                                width:
                                                    widgetContainer.current
                                                        ?.clientWidth ?? "100%",
                                                maxWidth: "100%",
                                                borderRadius: 0,
                                                boxShadow: "none",
                                                left: "0 !important",
                                                pt: 0,
                                            },
                                        },
                                    }}>
                                    {categoryTabs.map(item => (
                                        <MenuItem
                                            onClick={() => {
                                                setEntityType(item.value);
                                                handleClose();
                                            }}
                                            key={categoryDropdowns[item.value]}
                                            value={item.value}
                                            sx={{
                                                fontSize: "15px",
                                                py: 1.5,
                                                fontWeight:
                                                    item.value === entityType
                                                        ? 600
                                                        : 400,
                                            }}>
                                            {categoryDropdowns[item.value]}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        </Box>

                        <Box sx={{ flex: 1, overflow: "auto", mb: 1, p: 0 }}>
                            {renderResult(
                                entityType,
                                resultsByType[entityType]
                            )}
                        </Box>

                        {!!include_cohort_link && (
                            <Box
                                component="footer"
                                sx={{
                                    backgroundColor: colors.grey200,
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: 2,
                                    p: 1,
                                }}>
                                <Typography>
                                    <strong>{TRANSLATIONS.footerTtle}</strong>
                                    {TRANSLATIONS.footerDesc}
                                </Typography>
                                <Button
                                    href="https://healthdatagateway.org/about/cohort-discovery"
                                    target="_blank"
                                    sx={{
                                        backgroundColor: colors.white,
                                        flexShrink: 0,
                                    }}
                                    color="greyCustom"
                                    disableElevation>
                                    {TRANSLATIONS.cohortButton}
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Box>
            </ThemeProvider>
        </>
    );
}
