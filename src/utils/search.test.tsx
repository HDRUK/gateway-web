import { faker } from "@faker-js/faker";
import { ReadonlyURLSearchParams } from "next/navigation";
import { generateDatasetMetadataV1 } from "@/mocks/data/dataset";
import { getAllParams, getDateRange, getPopulationSize } from "./search";

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
    describe("getPopulationSize", () => {
        const notReported = "Not reported";

        it("should return `notReported` label if undefined", () => {
            const response = getPopulationSize(undefined, notReported);
            expect(response).toBe(notReported);
        });
        it("should return `notReported` label if -1", () => {
            const { metadata } = generateDatasetMetadataV1();
            const response = getPopulationSize(
                {
                    ...metadata,
                    summary: { ...metadata.summary, populationSize: -1 },
                },
                notReported
            );
            expect(response).toBe(notReported);
        });
        it("should return `notReported` label if 0", () => {
            const { metadata } = generateDatasetMetadataV1();
            const response = getPopulationSize(
                {
                    ...metadata,
                    summary: { ...metadata.summary, populationSize: 0 },
                },
                notReported
            );
            expect(response).toBe(notReported);
        });
        it("should return `notReported` label if null", () => {
            const { metadata } = generateDatasetMetadataV1();
            const response = getPopulationSize(
                {
                    ...metadata,
                    summary: { ...metadata.summary, populationSize: null },
                },
                notReported
            );
            expect(response).toBe(notReported);
        });
        it("should return population size if number", () => {
            const { metadata } = generateDatasetMetadataV1();
            const response = getPopulationSize(
                {
                    ...metadata,
                    summary: { ...metadata.summary, populationSize: 22340 },
                },
                notReported
            );
            expect(response).toBe("22,340");
        });
    });
    describe("getAllParams", () => {
        it("should return the correct object", async () => {
            const searchTerm = faker.random.alpha();
            const params = new URLSearchParams();

            params.append("search_term", searchTerm);

            expect(getAllParams(params as ReadonlyURLSearchParams)).toEqual({
                search_term: searchTerm,
            });
        });
    });
});
