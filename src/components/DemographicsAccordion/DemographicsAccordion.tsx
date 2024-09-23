"use client";

import { List, ListItem } from "@mui/material";
import { useTranslations } from "next-intl";
import {
    DemographicDisease,
    DemographicGeneric,
    Demographics,
} from "@/interfaces/Dataset";
import { toTitleCase } from "@/utils/string";
import Accordion from "../Accordion";
import Box from "../Box";
import Typography from "../Typography";

const TRANSLATION_PATH = "components.DemographicsAccordion";
const DEMOGRAPHIC_ORDER: Array<keyof Demographics> = [
    "age",
    "ethnicity",
    "disease",
];
const AGE_ORDER = [
    "0-6 days",
    "7-27 days",
    "1-11 months",
    "1-4 years",
    "5-9 years",
    "10-14 years",
    "15-19 years",
    "20-24 years",
    "25-29 years",
    "30-34 years",
    "35-39 years",
    "40-44 years",
    "45-49 years",
    "50-54 years",
    "55-59 years",
    "60-64 years",
    "65-69 years",
    "70-74 years",
    "75-79 years",
    "80-84 years",
    "85-89 years",
    "90-94 years",
    "95-99 years",
    "100+ years",
];

const sortedAgeGroups = (age: DemographicGeneric[]) => {
    if (!age) return null;
    return age.sort((a, b) => {
        const indexA = AGE_ORDER.indexOf(a.bin);
        const indexB = AGE_ORDER.indexOf(b.bin);
        return indexA - indexB;
    });
};

const DemographicsAccordion = ({ data }: { data: Demographics }) => {
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <>
            {DEMOGRAPHIC_ORDER.map(key => {
                let items = data[key];

                if (key === "age" && items) {
                    items = sortedAgeGroups(items as DemographicGeneric[]);
                }

                return (
                    <Accordion
                        key={key}
                        heading={
                            <Box
                                sx={{
                                    p: 0,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "100%",
                                }}>
                                <Typography variant="h4" sx={{ m: 0 }}>
                                    {toTitleCase(key)}
                                </Typography>
                            </Box>
                        }
                        contents={
                            <List sx={{ p: 0 }}>
                                {items && items.length > 0 ? (
                                    items.map(item => (
                                        <ListItem
                                            key={`${key}-${item}`}
                                            sx={{
                                                display: "flex",
                                                pl: 0,
                                                pr: 0,
                                            }}>
                                            {key === "disease" ? (
                                                <>
                                                    <Typography
                                                        sx={{ flex: 1 }}>
                                                        {
                                                            (
                                                                item as DemographicDisease
                                                            ).diseaseCode
                                                        }
                                                    </Typography>
                                                    {(
                                                        item as DemographicDisease
                                                    ).diseaseCodeVocabulary && (
                                                        <Typography
                                                            sx={{ flex: 1 }}>
                                                            {
                                                                (
                                                                    item as DemographicDisease
                                                                )
                                                                    .diseaseCodeVocabulary
                                                            }
                                                        </Typography>
                                                    )}
                                                    <Typography
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "flex-end",
                                                        }}>
                                                        {item.count}
                                                    </Typography>
                                                </>
                                            ) : (
                                                <>
                                                    <Typography
                                                        sx={{ flex: 1 }}>
                                                        {
                                                            (
                                                                item as DemographicGeneric
                                                            ).bin
                                                        }
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "flex-end",
                                                        }}>
                                                        {item.count}
                                                    </Typography>
                                                </>
                                            )}
                                        </ListItem>
                                    ))
                                ) : (
                                    <ListItem sx={{ pl: 0, pr: 0 }}>
                                        <Typography>{t("noData")}</Typography>
                                    </ListItem>
                                )}
                            </List>
                        }
                    />
                );
            })}
        </>
    );
};

export default DemographicsAccordion;
