import { Dataset } from "@/interfaces/Dataset";
import { generatePageDataSetV1 } from "../v1";
import {
    crocodGwdm23Metadata,
    crukGwdm21Metadata,
    hdrukGwdm20Metadata,
    prukGwdm23Metadata,
} from "./gwdmMetadata.data";

interface GwdmDatasetOptions {
    partner: string;
    gwdmVersion: string;
    metadata: Record<string, unknown>;
    /** The schema it was submitted in, as the API records it. */
    sourceSchema?: { model: string; version: string | null } | null;
}

/**
 * A dataset as the v2 API returns it on a plain request: native GWDM, with
 * `schema` and `partner_context` describing what that metadata is.
 */
export const generateGwdmDataset = ({
    partner,
    gwdmVersion,
    metadata,
    sourceSchema = null,
}: GwdmDatasetOptions): Dataset => {
    const base = generatePageDataSetV1();

    return {
        ...base,
        status: "ACTIVE",
        partner_context: partner,
        schema: { model: "GWDM", version: gwdmVersion },
        source_schema: sourceSchema,
        versions: [
            {
                ...base.versions[0],
                gwdm_version: gwdmVersion,
                metadata: {
                    gwdmVersion,
                    // Native GWDM is not the HDRUK `Metadata` shape the legacy
                    // interface describes.
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    metadata: metadata as any,
                },
            },
        ],
    };
};

export const generateHdrukGwdmDataset = (): Dataset =>
    generateGwdmDataset({
        partner: "HDRUK",
        gwdmVersion: "2.0",
        metadata: hdrukGwdm20Metadata,
        sourceSchema: { model: "HDRUK", version: "4.1.0" },
    });

export const generateCrukGwdmDataset = (): Dataset =>
    generateGwdmDataset({
        partner: "CRUK",
        gwdmVersion: "2.1",
        metadata: crukGwdm21Metadata,
        sourceSchema: { model: "CRUK", version: "1.0.0" },
    });

export const generatePrukGwdmDataset = (): Dataset =>
    generateGwdmDataset({
        partner: "PRUK",
        gwdmVersion: "2.3",
        metadata: prukGwdm23Metadata,
        sourceSchema: { model: "PRUK", version: "1.0.0" },
    });

/** A clinical trial case study: `required.recordType` "caseStudy". */
export const generateCrocodGwdmDataset = (): Dataset =>
    generateGwdmDataset({
        partner: "CROCOD",
        gwdmVersion: "2.3",
        metadata: crocodGwdm23Metadata,
        sourceSchema: { model: "CROCOD", version: "1.0.0" },
    });
