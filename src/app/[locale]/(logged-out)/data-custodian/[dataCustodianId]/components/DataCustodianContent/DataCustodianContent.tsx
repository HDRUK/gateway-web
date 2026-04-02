import { get } from "lodash";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { DataProvider } from "@/interfaces/DataProvider";
import { FieldType } from "@/interfaces/FieldType";
import { TeamSummary } from "@/interfaces/TeamSummary";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import DataCustodianLinks from "@/components/DataCustodianLinks";
import Link from "@/components/Link";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import TooltipIcon from "@/components/TooltipIcon";
import Typography from "@/components/Typography";
import apis from "@/config/apis";
import { StaticImages } from "@/config/images";
import { AspectRatioImage } from "@/consts/image";
import { formatDate } from "@/utils/date";
import { DataCustodianField, DataCustodianSection } from "../../config";

const TRANSLATION_PATH = "pages.dataCustodian";
const DATE_FORMAT = "DD/MM/YYYY";
const TOOLTIP_SUFFIX = "Tooltip";

async function DataCustodianContent({
    dataCustodianId,
    populatedSections,
    teamSummary,
}: {
    dataCustodianId: number;
    populatedSections: DataCustodianSection[];
    teamSummary: TeamSummary;
}): Promise<Element | null> {
    const resp = await fetch(
        `${apis.teamsV1UrlIP}/${dataCustodianId}/summary`,
        {
            next: {
                revalidate: 180,
                tags: ["all", `custodian_datasets-${dataCustodianId}`],
            },
            cache: "force-cache",
        }
    );
    if (!resp.ok) {
        throw new Error("Failed to fetch custodian data");
    }
    const { data } = await resp.json();

    const t = await getTranslations(TRANSLATION_PATH);

    const getValue = (data: DataProvider, field: DataCustodianField) => {
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

    if (populatedSections.length === 0) {
        return null;
    }

    return (
        populatedSections.length > 0 && (
            <BoxContainer
                sx={{
                    "&:not(:last-of-type)": {
                        borderBottom: 1,
                        borderColor: "greyCustom.light",
                    },
                    "&:last-child": {
                        pb: 0,
                    },
                }}>
                <Box
                    sx={{
                        p: 0,
                        display: "flex",
                        flexDirection: {
                            laptop: "row",
                            tablet: "column-reverse",
                            mobile: "column-reverse",
                        },
                        justifyContent: {
                            laptop: "flex-start",
                            tablet: "flex-end",
                            mobile: "flex-start",
                        },
                        alignItems: {
                            mobile: {
                                alignItems: "center",
                            },
                        },
                    }}>
                    {populatedSections.map((section, index) => (
                        <Box
                            key={`${section.sectionName}_wrap`}
                            id={`anchor${index + 1}`}>
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
                            justifyContent: "space-between",
                        }}>
                        <Image
                            width={400}
                            height={250}
                            alt={teamSummary.name}
                            src={
                                teamSummary?.team_logo ||
                                StaticImages.BASE.placeholder
                            }
                            style={AspectRatioImage}
                        />
                    </Box>
                    <DataCustodianLinks data={data} sx={{ mb: 2 }} />
                </Box>
            </BoxContainer>
        )
    );
}

export default DataCustodianContent;
