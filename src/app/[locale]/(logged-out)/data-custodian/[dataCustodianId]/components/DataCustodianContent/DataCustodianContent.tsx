import { ReactElement } from "react";
import { get } from "lodash";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { FieldType } from "@/interfaces/FieldType";
import { TeamSummary } from "@/interfaces/TeamSummary";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import DataCustodianLinks from "@/components/DataCustodianLinks";
import Link from "@/components/Link";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import Paper from "@/components/Paper";
import TooltipIcon from "@/components/TooltipIcon";
import Typography from "@/components/Typography";
import { StaticImages } from "@/config/images";
import { formatDate } from "@/utils/date";
import { DataCustodianField, DataCustodianSection } from "../../config";

const TRANSLATION_PATH = "pages.dataCustodian";
const DATE_FORMAT = "DD/MM/YYYY";
const TOOLTIP_SUFFIX = "Tooltip";

async function DataCustodianContent({
    summaryPromise,
    populatedSections,
    teamSummary,
}: {
    summaryPromise: Promise<TeamSummary>;
    populatedSections: DataCustodianSection[];
    teamSummary: TeamSummary;
}): Promise<ReactElement> {
    const data = await summaryPromise;

    const t = await getTranslations(TRANSLATION_PATH);

    const getValue = (data: TeamSummary, field: DataCustodianField) => {
        const value = get(data, field.path);

        return value || t("notAvailable");
    };

    const renderDataCustodianField = (
        type: FieldType,
        value: string | string[]
    ) => {
        const val = value as string;

        switch (type) {
            case FieldType.WYSIWYG:
                return <MarkDownSanitizedWithHtml content={val} />;
            case FieldType.DATE:
                return <Typography>{formatDate(val, DATE_FORMAT)}</Typography>;
            case FieldType.LINK:
                return <Link href={val}>{val}</Link>;
            default:
                return <Typography component="span">{val}</Typography>;
        }
    };

    if (!populatedSections.length) {
        return null;
    }

    return (
        populatedSections.length && (
            <BoxContainer
                sx={{
                    gridTemplateColumns: {
                        sm: "repeat(5, 1fr)",
                    },
                    gap: {
                        xs: 1,
                        sm: 2,
                    },
                    p: 0,
                }}>
                <Box
                    sx={{
                        gridColumn: { sm: "span 5", md: "span 5" },
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
                                    "&:last-child": {
                                        pb: 0,
                                    },
                                    pl: 0,
                                    pr: 0,
                                }}>
                                <Typography variant="h2">
                                    {t(section.sectionName)}
                                </Typography>

                                {section.fields.map(field => {
                                    const { label } = field;

                                    const value = getValue(data, field);

                                    if (!label) {
                                        return (
                                            <Box
                                                sx={{
                                                    p: 0,
                                                    pb: 2,
                                                }}
                                                key={value}>
                                                {renderDataCustodianField(
                                                    field.type,
                                                    value
                                                )}
                                            </Box>
                                        );
                                    }

                                    return (
                                        <BoxContainer
                                            sx={{
                                                gridTemplateColumns: {
                                                    lg: "repeat(3, 1fr)",
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
                                                        lg: "span 1",
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
                                                        lg: "span 2",
                                                    },
                                                    p: 0,
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}>
                                                {renderDataCustodianField(
                                                    field.type,
                                                    value
                                                )}
                                            </Box>
                                        </BoxContainer>
                                    );
                                })}
                            </Box>
                        ))}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                            <Image
                                width={400}
                                height={400}
                                alt={teamSummary.name}
                                src={
                                    teamSummary?.team_logo ||
                                    StaticImages.BASE.placeholder
                                }
                                sizes="(max-width: 768px) 100vw, 400px"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    maxWidth: 400,
                                    maxHeight: 400,
                                    objectFit: "contain",
                                }}
                            />
                        </Box>
                        <DataCustodianLinks data={data} sx={{ mb: 2 }} />
                    </Paper>
                </Box>
            </BoxContainer>
        )
    );
}

export default DataCustodianContent;
