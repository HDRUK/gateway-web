"use client";

import { get } from "lodash";
import { useTranslations } from "next-intl";
import { Tool } from "@/interfaces/Tool";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Link from "@/components/Link";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import Paper from "@/components/Paper";
import TooltipIcon from "@/components/TooltipIcon";
import Typography from "@/components/Typography";
import { formatDate } from "@/utils/date";
import { ToolSection, FieldType } from "../../config";

const TRANSLATION_PATH = "pages.tool";
const DATE_FORMAT = "DD/MM/YYYY";
const TOOLTIP_SUFFIX = "Tooltip";

interface ToolFieldProps {
    type: FieldType;
    value: string;
}

const ToolField = ({ type, value }: ToolFieldProps) => {
    switch (type) {
        case FieldType.DATE:
            return <Typography>{formatDate(value, DATE_FORMAT)}</Typography>;
        case FieldType.LINK:
            return <Link href={value}>{value}</Link>;
        default:
            return <MarkDownSanitizedWithHtml content={value} />;
    }
};

const ToolContent = ({
    data,
    populatedSections,
}: {
    data: Tool;
    populatedSections: ToolSection[];
}) => {
    const t = useTranslations(TRANSLATION_PATH);

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
                <Paper sx={{ borderRadius: 2, p: 2 }}>
                    {populatedSections.map((section, index) => (
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
                                const { label } = field;

                                const value =
                                    get(data, field.path) || t("notAvailable");

                                if (!label) {
                                    return (
                                        <Box
                                            sx={{
                                                p: 0,
                                                pb: 2,
                                            }}
                                            key={value}>
                                            <ToolField
                                                type={field.type}
                                                value={value}
                                            />
                                        </Box>
                                    );
                                }

                                return (
                                    <BoxContainer
                                        sx={{
                                            gridTemplateColumns: {
                                                desktop: "repeat(3, 1fr)",
                                            },
                                            gap: 1,
                                            "&:not(:last-of-type)": {
                                                mb: 2,
                                            },
                                        }}
                                        key={field.path}>
                                        <Box
                                            sx={{
                                                gridColumn: {
                                                    desktop: "span 1",
                                                },
                                                p: 0,
                                            }}>
                                            {!field.hideTooltip ? (
                                                <TooltipIcon
                                                    content={t(
                                                        `${label}${TOOLTIP_SUFFIX}`
                                                    )}
                                                    label={t(label)}
                                                />
                                            ) : (
                                                t(label)
                                            )}
                                        </Box>
                                        <Box
                                            sx={{
                                                gridColumn: {
                                                    desktop: "span 2",
                                                },
                                                p: 0,
                                                display: "flex",
                                                alignItems: "center",
                                            }}>
                                            <ToolField
                                                type={field.type}
                                                value={value}
                                            />
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

export default ToolContent;
