"use client";

import { Box, Link, List, ListItem, ListItemText } from "@mui/material";
import { DataUseItem } from "@/interfaces/Widget";
import EllipsisCharacterLimit from "@/components/EllipsisCharacterLimit";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import TooltipText from "@/components/TooltipText";
import Typography from "@/components/Typography";
import theme, { colors } from "@/config/theme";
import { RouteName } from "@/consts/routeName";
import { FULL_GATEWAY_URL } from "@/consts/urls";

const CHARACTER_LIMIT = 35;

const TRANSLATIONS = {
    leadOrganisation: "Lead Organisation",
    datasets: "Datasets",
    dataCustodian: "Data Custodian",
    notAvailable: "n/a",
    noData: "not reported",
};

const rowSx = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
    p: 0,
    "&:first-of-type": { marginTop: theme.spacing(2) },
} as const;

const categorySx = {
    flexBasis: "20%",
    fontWeight: 500,
    marginRight: theme.spacing(2),
};

type DataUsesListProps = { items: DataUseItem[] };

export default function DataUsesList({ items }: DataUsesListProps) {
    return (
        <List sx={{ background: colors.white, p: 0, m: 0 }}>
            {items.map(result => (
                <ListItem
                    key={result.id}
                    sx={{ p: 0, borderBottom: `1px solid ${colors.grey300}` }}
                    alignItems="flex-start">
                    <ListItemText
                        disableTypography
                        sx={{ p: 2, pb: 1, m: 0 }}
                        primary={
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}>
                                <Link
                                    href={`${FULL_GATEWAY_URL}${RouteName.DATA_USE_ITEM}/${result.id}`}
                                    fontSize={16}
                                    fontWeight={600}
                                    mb={2}>
                                    <EllipsisLineLimit
                                        text={result.name || ""}
                                        showToolTip
                                    />
                                </Link>
                            </Box>
                        }
                        secondary={
                            <>
                                <Box sx={rowSx}>
                                    <Typography sx={categorySx}>
                                        <TooltipText
                                            size="inherit"
                                            label={
                                                TRANSLATIONS.leadOrganisation
                                            }
                                            content="The name of the legal entity that signs the contract to access the data"
                                        />
                                    </Typography>
                                    {result.organisation_name ? (
                                        <Typography sx={{ fontWeight: 500 }}>
                                            {result.organisation_name}
                                        </Typography>
                                    ) : (
                                        TRANSLATIONS.notAvailable
                                    )}
                                </Box>

                                <Box sx={rowSx}>
                                    <Typography sx={categorySx}>
                                        <TooltipText
                                            size="inherit"
                                            label={TRANSLATIONS.datasets}
                                            content="The name of the dataset(s) being accessed"
                                        />
                                    </Typography>
                                    {result.dataset?.dataset_title ? (
                                        <>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: theme.spacing(1),
                                                }}>
                                                <EllipsisCharacterLimit
                                                    text={
                                                        result.dataset
                                                            .dataset_title
                                                    }
                                                    isButton
                                                    characterLimit={
                                                        CHARACTER_LIMIT
                                                    }
                                                    href={`${FULL_GATEWAY_URL}/dataset/${result.dataset.dataset_id}`}
                                                    target="_blank"
                                                />
                                            </Box>
                                            {result.dataset.dataset_count >
                                                1 && (
                                                <Typography
                                                    sx={{
                                                        fontWeight: 500,
                                                        ml: 1,
                                                    }}>
                                                    (
                                                    {
                                                        result.dataset
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

                                <Box sx={rowSx}>
                                    <Typography sx={categorySx}>
                                        <TooltipText
                                            size="inherit"
                                            label={TRANSLATIONS.dataCustodian}
                                            content="The individual or organisation responsible for the safe custody, transport, storage of, and access to data"
                                        />
                                    </Typography>
                                    {result.team_name ? (
                                        <Link
                                            href={`${FULL_GATEWAY_URL}/${RouteName.DATA_CUSTODIANS_ITEM}/${result.team_id}`}
                                            target="_blank">
                                            {result.member_of &&
                                                `${result.member_of} > `}
                                            <EllipsisCharacterLimit
                                                text={result.team_name}
                                                characterLimit={CHARACTER_LIMIT}
                                            />
                                        </Link>
                                    ) : (
                                        TRANSLATIONS.noData
                                    )}
                                </Box>
                            </>
                        }
                    />
                </ListItem>
            ))}
        </List>
    );
}
