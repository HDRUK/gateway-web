import { generateDatasetMetadataV1 } from "@/mocks/data/dataset";
import { getDateRange } from "./search";

describe("Search utils", () => {
    describe("getDateRange", () => {
        const { metadata } = generateDatasetMetadataV1();

        it("should return both dates", async () => {
            expect(
                getDateRange({
                    ...metadata,
                    provenance: {
                        ...metadata.provenance,
                        temporal: {
                            ...metadata.provenance.temporal,
                            startDate: "2023-03-12",
                            endDate: "2024-03-12",
                        },
                    },
                })
            ).toEqual("2023-2024");
        });
        it("should return missing date if no end date", async () => {
            expect(
                getDateRange({
                    ...metadata,
                    provenance: {
                        ...metadata.provenance,
                        temporal: {
                            ...metadata.provenance.temporal,
                            startDate: "2023-03-12",
                            endDate: undefined,
                        },
                    },
                })
            ).toEqual("2023-");
        });
        it("should return missing date if no start date", async () => {
            expect(
                getDateRange({
                    ...metadata,
                    provenance: {
                        ...metadata.provenance,
                        temporal: {
                            ...metadata.provenance.temporal,
                            startDate: undefined,
                            endDate: "2023-03-12",
                        },
                    },
                })
            ).toEqual("-2023");
        });
        it("should return n/a if no dates", async () => {
            expect(
                getDateRange({
                    ...metadata,
                    provenance: {
                        ...metadata.provenance,
                        temporal: {
                            ...metadata.provenance.temporal,
                            startDate: undefined,
                            endDate: undefined,
                        },
                    },
                })
            ).toEqual("n/a");
        });
    });
});
