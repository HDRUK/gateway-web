import { DarTemplateType } from "@/consts/dataAccess";
import { createDarSidebarData } from ".";

type SelectedDatasets = {
    datasetId: number;
    name: string;
    teamId: number;
    teamName: string;
    darEnabled: boolean;
    darTemplatePublished: boolean;
    cohortEnabled: boolean;
    darTemplateType: string;
}[];

const makeDataset = (
    overrides: Partial<SelectedDatasets[number]> = {}
): SelectedDatasets[number] => ({
    datasetId: overrides.datasetId ?? 1,
    name: overrides.name ?? "Dataset",
    teamId: overrides.teamId ?? 10,
    teamName: overrides.teamName ?? "Team",
    darEnabled: overrides.darEnabled ?? true,
    darTemplatePublished: overrides.darTemplatePublished ?? true,
    cohortEnabled: overrides.cohortEnabled ?? false,
    darTemplateType: overrides.darTemplateType ?? DarTemplateType.DOCUMENT,
});

describe("createDarSidebarData", () => {
    it("returns null when no selected datasets passed", () => {
        expect(createDarSidebarData([])).toEqual({
            type: null,
            info: null,
            enabled: false,
        });
    });

    it("returns data for a single document dar", () => {
        const selected: SelectedDatasets = [
            makeDataset({ darTemplateType: DarTemplateType.DOCUMENT }),
        ];

        expect(createDarSidebarData(selected)).toEqual({
            type: "document",
            info: "documentSingle",
            enabled: true,
        });
    });

    it("returns data for multiple document dar with the same team", () => {
        const selected: SelectedDatasets = [
            makeDataset({
                datasetId: 1,
                teamId: 10,
                darTemplateType: DarTemplateType.DOCUMENT,
            }),
            makeDataset({
                datasetId: 2,
                teamId: 10,
                darTemplateType: DarTemplateType.DOCUMENT,
            }),
        ];

        expect(createDarSidebarData(selected)).toEqual({
            type: "document",
            info: "documentMultipleSameTeam",
            enabled: true,
        });
    });

    it("returns data for multiple document dar with different teams", () => {
        const selected: SelectedDatasets = [
            makeDataset({
                datasetId: 1,
                teamId: 10,
                darTemplateType: DarTemplateType.DOCUMENT,
            }),
            makeDataset({
                datasetId: 2,
                teamId: 11,
                darTemplateType: DarTemplateType.DOCUMENT,
            }),
        ];

        expect(createDarSidebarData(selected)).toEqual({
            type: "document",
            info: "documentMultiple",
            enabled: false,
        });
    });

    it("returns data for multiple FORM dar with the same team", () => {
        const selected: SelectedDatasets = [
            makeDataset({
                datasetId: 1,
                teamId: 10,
                darTemplateType: DarTemplateType.FORM,
            }),
            makeDataset({
                datasetId: 2,
                teamId: 10,
                darTemplateType: DarTemplateType.FORM,
            }),
        ];

        const result = createDarSidebarData(selected);

        expect(result.type).toBe("form");
        expect(result.enabled).toBe(true);

        expect(result.info).toBe("formMultiple");
    });

    it("returns data for multiple FORM dar with different teams", () => {
        const selected: SelectedDatasets = [
            makeDataset({
                datasetId: 1,
                teamId: 10,
                darTemplateType: DarTemplateType.FORM,
            }),
            makeDataset({
                datasetId: 2,
                teamId: 11,
                darTemplateType: DarTemplateType.FORM,
            }),
        ];

        expect(createDarSidebarData(selected)).toEqual({
            type: "form",
            info: "formMultiple",
            enabled: true,
        });
    });

    it("returns data for multiple mixed type dar", () => {
        const selected: SelectedDatasets = [
            makeDataset({
                datasetId: 1,
                teamId: 10,
                darTemplateType: DarTemplateType.DOCUMENT,
            }),
            makeDataset({
                datasetId: 2,
                teamId: 10,
                darTemplateType: DarTemplateType.FORM,
            }),
        ];

        expect(createDarSidebarData(selected)).toEqual({
            type: "mixed",
            info: "mixedMultiple",
            enabled: false,
        });
    });
});
