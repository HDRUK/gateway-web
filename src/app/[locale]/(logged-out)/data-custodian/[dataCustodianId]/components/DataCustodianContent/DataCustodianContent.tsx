"use client";

import { InView } from "react-intersection-observer";
import DOMPurify from "dompurify";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { DataProvider } from "@/interfaces/DataProvider";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Link from "@/components/Link";
import Paper from "@/components/Paper";
import ShowMore from "@/components/ShowMore";
import TooltipIcon from "@/components/TooltipIcon";
import Typography from "@/components/Typography";
import { WysiwygOut } from "@/components/Wysiwyg";
import { formatDate } from "@/utils/date";
import { parseEncodedJSON, slateJsonToHtml } from "@/utils/json";
import {
    DataCustodianField,
    DataCustodianSection,
    FieldType,
} from "../../config";

const TRANSLATION_PATH = "pages.dataCustodian";
const DATE_FORMAT = "DD/MM/YYYY";
const TOOLTIP_SUFFIX = "Tooltip";

const DataCustodianContent = ({
    data,
    populatedSections,
}: {
    data: DataProvider;
    populatedSections: DataCustodianSection[];
}) => {
    const t = useTranslations(TRANSLATION_PATH);
    const router = useRouter();
    const path = usePathname();

    const getValue = (data: DataProvider, field: DataCustodianField) => {
        const value = get(data, field.path);

        return value || t("notAvailable");
    };

    const renderDataCustodianField = (
        type: FieldType,
        value: string | string[]
    ) => {
        const val = value as string;

        console.log(type === FieldType.WYSIWYG);

        switch (type) {
            case FieldType.WYSIWYG:
                return <WysiwygOut value={value as string} />;
            case FieldType.DATE:
                return <Typography>{formatDate(val, DATE_FORMAT)}</Typography>;
            case FieldType.LINK:
                return <Link href={val}>{val}</Link>;
            default:
                return (
                    <Typography component="span">
                        <ShowMore maxHeight={18}>{val}</ShowMore>
                    </Typography>
                );
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
                <Paper sx={{ borderRadius: 2, p: 2 }}>
                    {populatedSections.map((section, index) => (
                        <InView
                            key={`${section.sectionName}_inview`}
                            id={`anchor${index + 1}`}
                            threshold={1}
                            as="div"
                            onChange={inView => {
                                if (inView && path) {
                                    router.replace(
                                        `${path}?section=${index + 1}`,
                                        { scroll: false }
                                    );
                                }
                            }}>
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
                        </InView>
                    ))}
                </Paper>
            </Box>
        </BoxContainer>
    );
};

export default DataCustodianContent;
