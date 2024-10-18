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

type FormattedDemographics = {
    [key: string]: DemographicDisease[] | DemographicGeneric[] | null;
};

const TRANSLATION_PATH = "components.DemographicsAccordion";
const DEMOGRAPHIC_ORDER: Array<keyof Demographics> = ["age", "ethnicity"];
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

const sortedAgeGroups = (age: DemographicGeneric[]) =>
    age.sort((a, b) => {
        const indexA = AGE_ORDER.indexOf(a.bin);
        const indexB = AGE_ORDER.indexOf(b.bin);
        return indexA - indexB;
    });

const sortedByCount = (data: DemographicGeneric[] | DemographicDisease[]) =>
    data.sort((a, b) => b.count - a.count);

const formatDiseaseKey = (code: string) => `Disease (${code})`;

const generateDiseaseKeys = (diseases: DemographicDisease[] | null) => {
    const diseaseVocabularies = new Set();
    diseases?.forEach(disease => {
        diseaseVocabularies.add(
            formatDiseaseKey(disease.diseaseCodeVocabulary || "")
        );
    });
    return Array.from(diseaseVocabularies);
};

const DemographicsAccordion = ({ data }: { data: Demographics }) => {
    const t = useTranslations(TRANSLATION_PATH);

    const diseaseKeys = generateDiseaseKeys(data.disease);

    const FINAL_DEMOGRAPHIC_ORDER: string[] = [
        ...(DEMOGRAPHIC_ORDER as string[]),
        ...(diseaseKeys as string[]),
    ];

    const formatData = ({
        disease,
        ethnicity,
        age,
    }: Demographics): FormattedDemographics => ({
        ...disease?.reduce((acc, { diseaseCodeVocabulary, ...rest }) => {
            const key = formatDiseaseKey(diseaseCodeVocabulary || "");
            acc[key] = acc[key] || [];
            (acc[key] as DemographicDisease[]).push({
                diseaseCodeVocabulary,
                ...rest,
            });
            return acc;
        }, {} as Record<string, DemographicDisease[]>),
        ethnicity,
        age,
    });

    const formattedData = formatData(data);

    return (
        <>
            {FINAL_DEMOGRAPHIC_ORDER.map(key => {
                let items = formattedData[key];

                if (!items) {
                    return null;
                }

                if (key === "age") {
                    items = sortedAgeGroups(items as DemographicGeneric[]);
                } else {
                    items = sortedByCount(items);
                }

                return (
                    <Accordion
                        key={`${key}_accordion`}
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
                                    {key.startsWith("Disease")
                                        ? key
                                        : toTitleCase(key)}
                                </Typography>
                            </Box>
                        }
                        contents={
                            <List sx={{ p: 0 }}>
                                {items && items.length > 0 ? (
                                    items.map(item => (
                                        <ListItem
                                            key={`${key}-${
                                                item?.count || item?.bin
                                            }`}
                                            sx={{
                                                display: "flex",
                                                pl: 0,
                                                pr: 0,
                                            }}>
                                            {key.startsWith("Disease") ? (
                                                <>
                                                    <Typography
                                                        sx={{ flex: 1 }}>
                                                        {
                                                            (
                                                                item as DemographicDisease
                                                            ).diseaseCode
                                                        }
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "flex-end",
                                                        }}>
                                                        {item.count.toLocaleString()}
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
                                                        {item.count.toLocaleString()}
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
