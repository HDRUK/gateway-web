"use client";

// import { useState } from "react";
// import { FieldValues, useForm } from "react-hook-form";
// import Box from "@/components/Box";
import { useState } from "react";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    TextField,
} from "@mui/material";
import { SearchCategory, SearchResult } from "@/interfaces/Search";
import { WidgetEntityData } from "@/interfaces/Widget";
import Button from "@/components/Button";
import Typography from "@/components/Typography";

// import { SearchIcon } from "@/consts/icons";

// import { SearchCategory } from "@/interfaces/Search";
// import { WidgetEntityData } from "@/interfaces/Widget";
// import theme, { colors } from "@/config/theme";

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

const categoryDropdowns = {
    [SearchCategory.DATASETS]: "Datasets & Biosamples",
    [SearchCategory.DATA_USE]: "Data Uses / Research Projects",
    [SearchCategory.TOOLS]: "Analysis Scripts & Software",
    [SearchCategory.COLLECTIONS]: "Collections",
};
const categoryTabs = [
    {
        label: SearchCategory.DATASETS,
        value: SearchCategory.DATASETS,
    },
    {
        label: SearchCategory.DATA_USE,
        value: SearchCategory.DATA_USE,
    },
    {
        label: SearchCategory.TOOLS,
        value: SearchCategory.TOOLS,
    },
    {
        label: SearchCategory.COLLECTIONS,
        value: SearchCategory.COLLECTIONS,
    },
];

export default function WidgetDisplay({ data }: { data: WidgetEntityData }) {
    console.log(data);

    console.log("TEST");

    const {
        include_cohort_link,
        include_search_bar,
        keep_proportions,
        size_height,
        size_width,
        unit,
    } = data.widget;

    console.log(
        include_cohort_link,
        include_search_bar,
        keep_proportions,
        size_height,
        size_width,
        unit,
        data,
        data.widget
    );

    // const queryName = "search";

    // const { control, handleSubmit, setValue } = useForm({
    //     defaultValues: { [queryName]: "" },
    // });

    const [entityType, setEntityType] = useState(SearchCategory.DATASETS);
    const [anchorEl, setAnchorEl] = useState(null);

    const [searchValue, setSearchValue] = useState("");

    // const handleSearch = (searchValue: FieldValues) => {
    //     setSearchValue(searchValue.search);
    // };

    const handleClick = e => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const filterResults = <T extends Record<string, any>>(
        filterProperties: string[],
        searchValue: string
    ) => {
        const terms = (searchValue ?? "")
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean); // remove empty strings

        if (!terms.length) return () => true; // no query → include all

        return (item: T): boolean =>
            // every search term must match at least one property
            terms.every(term =>
                filterProperties.some(key => {
                    const val = item?.[key];
                    if (val == null) return false;
                    const txt = Array.isArray(val)
                        ? val.join(" ")
                        : String(val);
                    return txt.toLowerCase().includes(term);
                })
            );
    };

    const renderResult = (results: SearchResult) => {
        const { _id: resultId } = results;

        switch (entityType) {
            case SearchCategory.DATASETS:
                return (
                    <List
                        key={`list-${entityType}`}
                        sx={{
                            // background: colors.grey100,
                            px: 1,
                            mt: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                        }}>
                        {results
                            .filter(
                                filterResults(
                                    ["name", "description"],
                                    searchValue
                                )
                            )
                            .map(result => (
                                <ListItem
                                    key={`listitem-${result.id}`}
                                    sx={{
                                        p: 0,
                                        mb: 1,
                                        // borderBottom: `1px solid ${colors.grey300}`,
                                        // background: colors.white,
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
                                                    justifyContent:
                                                        "space-between",
                                                    p: 0,
                                                }}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        p: 0,
                                                    }}>
                                                    {/* <Link
                                                        href={`https://healthdatagateway.org/en/dataset/${result.id}`}
                                                        fontSize={16}
                                                        fontWeight={600}
                                                        marginBottom={0.5}>
                                                        {result.name}
                                                    </Link> */}

                                                    {/* <Link
                                                        id={resultId}
                                                        href="/"
                                                        sx={{
                                                            display:
                                                                "inline-block",
                                                        }}>
                                                        <Typography
                                                            // eslint-disable-next-line
                                                            aria-description="Data Custodian"
                                                            sx={{
                                                                mb: 1.5,
                                                            }}>
                                                            MISSING CUSTODIAN
                                                            TEXT
                                                        </Typography>
                                                    </Link> */}
                                                </Box>
                                            </Box>
                                        }
                                        secondary={
                                            <section
                                                aria-describedby={resultId}>
                                                <Typography>
                                                    MISSING INTRO
                                                </Typography>
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
                                                        // color={colors.green700}
                                                        sx={{ fontSize: 16 }}>
                                                        Dataset Population size:
                                                        MISSING
                                                    </Typography>
                                                    <Typography
                                                        // color={colors.green700}
                                                        sx={{
                                                            fontSize: 16,
                                                        }}>
                                                        Date range: MISSING
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
                    <List
                        sx={{
                            display: "grid",
                            gap: 2,
                            gridTemplateColumns: {
                                mobile: "1fr",
                                tablet: "repeat(2, 1fr)",
                                desktop: "repeat(3, 1fr)",
                            },
                            p: 1,
                        }}>
                        {results.map(result => (
                            // <CardStacked
                            //     href={`/https://healthdatagateway.org/en/collection/${result.id}`}
                            //     title={result.name}
                            //     imgUrl={
                            //         result?.image_link ||
                            //         StaticImages.BASE.placeholder
                            //     }
                            // />
                            <p>COLLECTION</p>
                        ))}
                    </List>
                );
            case SearchCategory.DATA_CUSTODIANS:
                return (
                    // <ResultCardDataProvider
                    //     result={result as SearchResultDataProvider}
                    // />
                    null
                );
            case SearchCategory.TOOLS:
                // return <ResultCardTool result={result as SearchResultTool} />;
                return null;
            default:
                return (
                    // <ResultCardDataUse
                    //     result={result as SearchResultDataUse}
                    //     key={resultId}
                    // />
                    null
                );
        }
    };

    // console.log(entityType, data?.[entityType]);

    // console.log(include_cohort_link);
    return (
        // <ThemeProvider theme={theme}>
        // <CssBaseline />

        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh",
                    p: 0,
                }}>
                {searchValue}
                {/* HEADER */}
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
                    }}>
                    {!!include_search_bar && (
                        // <Form
                        //     onSubmit={handleSubmit(handleSearch)}
                        //     role="search"
                        //     sx={{ flexGrow: 1 }}>
                        <TextField
                            // control={control}
                            // name={queryName}
                            label=""
                            placeholder="Start searching"
                            sx={{
                                // border: `2px solid ${theme.palette.greyCustom.main}`,
                                fontSize: "1.25rem",
                                marginBottom: 0,
                                paddingBottom: 1,
                                paddingTop: 1,
                                backgroundColor: "white",
                                "& fieldset": { border: "none" },
                                "& input": { padding: 0 },
                            }}
                            inputProps={{
                                "aria-label": "Search",
                            }}
                            // icon={SearchIcon}
                            // startAdornmentSize={SEARCH_ICON_SIZE}
                            // showClearButton
                            // clearButtonSize={CROSS_ICON_SIZE}
                            // setValue={setValue}
                            onChange={e => setSearchValue(e.target.value)}
                        />
                        // </Form>
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 2,
                            p: 0,
                        }}>
                        <Typography fontSize={15}>Powered by</Typography>

                        <a
                            href="https://healthdatagateway.org/en"
                            target="_blank"
                            rel="noreferrer">
                            <img
                                src="https://healthdatagateway.org/en/public/images/logos/gateway-main.svg"
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
                            // borderBottom: `3px solid ${colors.green400}`,
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
                            // endIcon={<ChevronThinIcon color="primary" />}
                        >
                            {categoryDropdowns[entityType]}
                        </Button>
                        <Menu
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
                                        width: "100vw",
                                        maxWidth: "100vw",
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
                    {renderResult(data?.[entityType])}
                </Box>

                {!!include_cohort_link && (
                    <Box
                        component="footer"
                        sx={{
                            // backgroundColor: colors.grey200,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                        }}>
                        <Typography>
                            <strong>Want to dig deeper?</strong> Cohort
                            Discovery indentifies relevant populations across
                            datasets
                        </Typography>
                        <Button
                            href="https://healthdatagateway.org/about/cohort-discovery"
                            target="_blank"
                            sx={{
                                // backgroundColor: colors.white,
                                flexShrink: 0,
                            }}
                            color="greyCustom">
                            Open Cohort Discovery
                        </Button>
                    </Box>
                )}
            </Box>
            <p>TEST</p>
        </>
        // </ThemeProvider>
    );
}

// export default WidgetDisplay;
