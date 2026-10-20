import { ReactNode } from "react";
import { FieldType } from "@/interfaces/FieldType";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Link from "@/components/Link";
import TooltipText from "@/components/TooltipText";
import Typography from "@/components/Typography";
import { RendererProps } from "@/modules/MetadataView";
import { getSectionAnchorId } from "@/utils/dataset";
import { DuoCodeDetails } from "@/app/[locale]/(logged-out)/dataset/[datasetId]/_gwdm/lib/duoCodeDetails";
import DuoCodeChips from "@/app/[locale]/(logged-out)/dataset/[datasetId]/components/DatasetContent/DuoCodeChips";
import SearchTags from "../gateway/SearchTags";
import {
    GatewayDate,
    GatewayList,
    GatewayText,
    toList,
} from "../gateway/gatewayComponents";
import { GATEWAY_SECTIONS } from "../gateway/gatewaySections";
import { buildProductionSections, ProductionField } from "./productionLayout";

export interface ProductionSectionsProps {
    /** The dataset's native GWDM metadata. */
    data: Record<string, unknown>;
    duoCodeDetails?: Record<string, DuoCodeDetails>;
}

// The Gateway renderers read only value and path.
const valueProps = (field: ProductionField) =>
    ({ value: field.value, path: field.gwdmPath } as RendererProps);

/** Renders a value as production's DatasetContent renders its field type. */
const renderValue = (
    field: ProductionField,
    duoCodeDetails: Record<string, DuoCodeDetails>
): ReactNode => {
    switch (field.type) {
        case FieldType.DATE:
            return <GatewayDate {...valueProps(field)} />;
        case FieldType.LIST_TAG:
            return <SearchTags tags={toList(field.value)} />;
        case FieldType.LIST_TEXT:
        case FieldType.LIST_DATASETTYPE:
            return <GatewayList {...valueProps(field)} />;
        case FieldType.LIST_TEXT_LABELLED:
            return (
                <DuoCodeChips
                    codes={toList(field.value)}
                    details={duoCodeDetails}
                />
            );
        case FieldType.LIST_LINK:
            return (
                // DatasetContent's ListContainer, as sx: its styled() is
                // client-only and this is a server component.
                <Box
                    sx={{
                        p: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}>
                    {toList(field.value).map(item => (
                        <Link key={item} href={item} target="_blank">
                            {item}
                        </Link>
                    ))}
                </Box>
            );
        default:
            return <GatewayText {...valueProps(field)} />;
    }
};

/**
 * The production dataset page's sections, populated from native GWDM, with
 * production's markup: a positional #anchor{n} wrapper (the section nav and
 * ?section= links target it) around a named anchor-{Section} block (the stats
 * and mind map target it), its heading, then label/value rows.
 */
const ProductionSections = ({
    data,
    duoCodeDetails = {},
}: ProductionSectionsProps) => {
    const sections = buildProductionSections(data);

    if (!sections.length) return null;

    return (
        <>
            {sections.map((section, index) => (
                <div key={section.title} id={`anchor${index + 1}`}>
                    <Box
                        id={getSectionAnchorId(section.title)}
                        sx={{
                            "&:not(:last-of-type)": {
                                borderBottom: 1,
                                borderColor: "greyCustom.light",
                            },
                            pl: 0,
                            pr: 0,
                        }}>
                        <Typography
                            variant="articleLead"
                            component="h2"
                            sx={{ mb: 2 }}
                            aria-live="polite"
                            tabIndex={-1}>
                            {section.title}
                        </Typography>

                        {section.special
                            ? GATEWAY_SECTIONS[section.special]?.(section.value)
                            : section.fields.map(field =>
                                  field.label ? (
                                      <BoxContainer
                                          key={field.label}
                                          sx={{
                                              gridTemplateColumns: {
                                                  lg: "repeat(3, 1fr)",
                                              },
                                              gap: 1,
                                              "&:not(:last-of-type)": { mb: 2 },
                                          }}>
                                          <Box
                                              sx={{
                                                  gridColumn: { lg: "span 1" },
                                                  p: 0,
                                              }}>
                                              {field.tooltip ? (
                                                  <TooltipText
                                                      content={field.tooltip}
                                                      label={field.label}
                                                  />
                                              ) : (
                                                  field.label
                                              )}
                                          </Box>
                                          <Box
                                              sx={{
                                                  gridColumn: { lg: "span 2" },
                                                  p: 0,
                                                  wordWrap: "break-word",
                                              }}>
                                              {renderValue(
                                                  field,
                                                  duoCodeDetails
                                              )}
                                          </Box>
                                      </BoxContainer>
                                  ) : (
                                      <Box
                                          key={field.gwdmPath}
                                          sx={{ p: 0, pb: 2 }}>
                                          {renderValue(field, duoCodeDetails)}
                                      </Box>
                                  )
                              )}
                    </Box>
                </div>
            ))}
        </>
    );
};

export default ProductionSections;
