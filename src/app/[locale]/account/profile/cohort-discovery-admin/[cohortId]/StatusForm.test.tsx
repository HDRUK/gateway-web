import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";
import { generateCohortRequestV1 } from "@/mocks/data/cohortRequest";
import ActionBar from "@/components/ActionBar";
import StatusForm from "./StatusForm";

jest.mock("@/hooks/useGet", () => ({
    __esModule: true,
    default: () => ({ data: [], isLoading: false }),
}));

jest.mock("@/hooks/useUnsavedChanges", () => ({
    __esModule: true,
    useUnsavedChanges: () => undefined,
}));

const updateCohort = jest.fn();
jest.mock("@/hooks/usePut", () => ({
    __esModule: true,
    default: () => updateCohort,
}));

describe("StatusForm", () => {
    beforeEach(() => {
        updateCohort.mockClear();
    });

    it("shows the current status of a renewing request", () => {
        const cohortRequest = generateCohortRequestV1({
            request_status: "RENEWING",
        });

        render(<StatusForm cohortRequest={cohortRequest} />);

        expect(
            screen.getByRole("combobox", { name: "Cohort Status" })
        ).toHaveTextContent("Renewing");
    });

    it("approves a renewal the same way any other request is approved", async () => {
        const cohortRequest = generateCohortRequestV1({
            request_status: "RENEWING",
        });

        render(
            <>
                <StatusForm cohortRequest={cohortRequest} />
                <ActionBar />
            </>
        );

        fireEvent.mouseDown(
            screen.getByRole("combobox", { name: "Cohort Status" })
        );
        fireEvent.click(screen.getByRole("option", { name: "Approved" }));

        const detailsField = await screen.findByLabelText(
            "Why did you make this action?"
        );
        fireEvent.change(detailsField, {
            target: { value: "Renewal reviewed and approved for another year." },
        });

        fireEvent.click(await screen.findByRole("button", { name: "Save" }));

        await waitFor(() => {
            expect(updateCohort).toHaveBeenCalledWith(
                cohortRequest.id,
                expect.objectContaining({ request_status: "APPROVED" })
            );
        });
    });
});
