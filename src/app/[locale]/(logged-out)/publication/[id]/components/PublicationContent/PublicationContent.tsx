"use client";

import { get } from "lodash";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { FieldType } from "@/interfaces/FieldType";
import { Publication } from "@/interfaces/Publication";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import Paper from "@/components/Paper";
import TooltipText from "@/components/TooltipText";
import Typography from "@/components/Typography";
import { formatDate } from "@/utils/date";
import { convertToCamelCase } from "@/utils/general";
import { PublicationSection } from "../../config";

const TRANSLATION_PATH = "pages.publication";
const DATE_FORMAT = "DD/MM/YYYY";
const TOOLTIP_SUFFIX = "Tooltip";

const PublicationContent = ({
    data,
    populatedSections,
}: {
    data: Publication;
    populatedSections: PublicationSection[];
}) => {
    const t = useTranslations(TRANSLATION_PATH);

    const renderPublicationField = (type: FieldType, value: string) => {
        const val = value as string;

        switch (type) {
            case FieldType.DATE: {
                return <Typography>{formatDate(val, DATE_FORMAT)}</Typography>;
            }
            case FieldType.LINK: {
                return (
                    <Link href={val} target="_blank">
                        {val}
                    </Link>
                );
            }
            default:
                return <MarkDownSanitizedWithHtml content={val} />;
        }
    };

    return (
        <BoxContainer
            sx={{
                gridTemplateColumns: {
                    tablet: "repeat(5, 1fr)",
                },
                gap: {
                    mobile: 1,
                    tablet: 2,
                },
                p: 0,
            }}>
            <Box
                sx={{
                    gridColumn: { tablet: "span 5", laptop: "span 5" },
                    p: 0,
                }}>
                <Paper sx={{ p: 2 }}>
                    {populatedSections
                        .filter(section => section.sectionName !== "general")
                        .map((section, index) => (
                            <Box
                                key={`${section.sectionName}_wrap`}
                                id={`anchor${index + 1}`}
                                sx={{
                                    "&:not(:last-of-type)": {
                                        borderBottom: 1,
                                        borderColor: "greyCustom.light",
                                    },
                                    pl: 0,
                                    pr: 0,
                                }}>
                                <Typography variant="h2">
                                    {t(section.sectionName)}
                                </Typography>

                                {section.fields.map(field => {
                                    const value = get(data, field.path);

                                    const label = convertToCamelCase(
                                        field.path
                                    );

                                    return (
                                        <BoxContainer
                                            sx={{
                                                gridTemplateColumns: {
                                                    tablet: !field.hideLabel
                                                        ? "repeat(4, 1fr)"
                                                        : "inherit",
                                                },
                                                gap: 1,
                                                "&:not(:last-of-type)": {
                                                    mb: 2,
                                                },
                                            }}
                                            key={field.path}>
                                            {!field.hideLabel && (
                                                <Box
                                                    sx={{
                                                        gridColumn: {
                                                            tablet: "span 1",
                                                        },
                                                        p: 0,
                                                    }}>
                                                    {!field.hideTooltip ? (
                                                        <TooltipText
                                                            content={t(
                                                                `${label}${TOOLTIP_SUFFIX}`
                                                            )}
                                                            label={t(label)}
                                                        />
                                                    ) : (
                                                        t(label)
                                                    )}
                                                </Box>
                                            )}
                                            <Box
                                                sx={{
                                                    gridColumn: {
                                                        tablet: "span 2",
                                                    },
                                                    p: 0,
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}>
                                                {renderPublicationField(
                                                    field.type,
                                                    value
                                                )}
                                            </Box>
                                        </BoxContainer>
                                    );
                                })}
                            </Box>
                        ))}
                </Paper>
            </Box>
        </BoxContainer>
    );
};

export default PublicationContent;
