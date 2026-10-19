"use client";

import { Button } from "@hdruk/ui";
import { Demographics, StructuralMetadata } from "@/interfaces/Dataset";
import Box from "@/components/Box";
import DemographicsAccordion from "@/components/DemographicsAccordion";
import StructuralMetadataAccordion from "@/components/StructuralMetadataAccordion";
import useModal from "@/hooks/useModal";

export type OpenTableProps =
    | { kind: "demographics"; data: Demographics }
    | { kind: "structuralMetadata"; data: StructuralMetadata[] };

/**
 * Production's "Open table" button for Demographics and Structural Metadata,
 * opening the same accordion in the same modal. GWDM's demographicFrequency
 * and structuralMetadata already have the shapes those accordions take.
 */
const OpenTableButton = (props: OpenTableProps) => {
    const { showModal } = useModal();

    const open = () =>
        props.kind === "demographics"
            ? showModal({
                  title: "Demographics",
                  content: <DemographicsAccordion data={props.data} />,
                  showConfirm: false,
                  showCancel: false,
              })
            : showModal({
                  title: "Structural Metadata",
                  content: (
                      <StructuralMetadataAccordion metadata={props.data} />
                  ),
                  showConfirm: false,
                  showCancel: false,
                  styleProps: { maxWidth: "md" },
              });

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 0,
            }}>
            <Button onClick={open}>Open table</Button>
        </Box>
    );
};

export default OpenTableButton;
