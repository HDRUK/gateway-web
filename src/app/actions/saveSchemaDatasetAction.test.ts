import { DataStatus } from "@/consts/application";
import { saveTeamDataset } from "@/utils/api";
import { isSchemaOnboardingFormSelectorEnabled } from "@/flags";
import { saveSchemaDatasetAction } from "./saveSchemaDatasetAction";

jest.mock("@/utils/api", () => ({
    saveTeamDataset: jest.fn(),
}));

jest.mock("@/flags", () => ({
    isSchemaOnboardingFormSelectorEnabled: jest.fn(),
}));

const save = (model: string, datasetId?: string) =>
    saveSchemaDatasetAction({
        teamId: "1",
        datasetId,
        model,
        version: "1.0.0",
        status: DataStatus.ACTIVE,
        metadata: {},
    });

const partnerContextSent = () =>
    (saveTeamDataset as jest.Mock).mock.calls[0][4];

describe("saveSchemaDatasetAction", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (saveTeamDataset as jest.Mock).mockResolvedValue({
            ok: true,
            status: 201,
            body: { data: 10 },
        });
        jest.mocked(isSchemaOnboardingFormSelectorEnabled).mockResolvedValue(
            true
        );
    });

    it("creates a partner-schema dataset in that partner's context", async () => {
        await save("PRUK");

        expect(partnerContextSent()).toBe("PRUK");
    });

    it("creates an HDRUK-schema dataset without a partner context", async () => {
        await save("HDRUK");

        expect(partnerContextSent()).toBeUndefined();
    });

    it("updates a partner-schema dataset in that partner's context", async () => {
        await save("PRUK", "5");

        expect(partnerContextSent()).toBe("PRUK");
    });

    it("sends no partner context while the schema selector flag is off", async () => {
        jest.mocked(isSchemaOnboardingFormSelectorEnabled).mockResolvedValue(
            false
        );

        await save("PRUK");

        expect(partnerContextSent()).toBeUndefined();
    });
});
