import { DarTemplate } from "@/interfaces/DataAccessRequest";
import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";
import { DataStatus } from "@/consts/application";
import TemplateList from "./TemplateList";

const template: DarTemplate = {
    id: 111,
    created_at: "2026-10-01T09:00:00Z",
    updated_at: "2026-10-02T09:00:00Z",
    deleted_at: null,
    team_id: 20,
    user_id: 1,
    published: false,
    locked: 0,
    questions: [],
    template_type: "FORM",
};

describe("TemplateList", () => {
    it("changes a template's status from the status menu", async () => {
        const onStatusChange = jest.fn();
        render(
            <TemplateList
                list={[template]}
                actions={[]}
                currentPage={1}
                setCurrentPage={jest.fn()}
                isLoading={false}
                onStatusChange={onStatusChange}
                statusOptions={[DataStatus.DRAFT, DataStatus.ACTIVE]}
            />
        );

        fireEvent.click(
            screen.getByRole("button", { name: "Status: Draft. Change status" })
        );
        fireEvent.click(screen.getByRole("menuitemradio", { name: "Active" }));

        await waitFor(() =>
            expect(onStatusChange).toHaveBeenCalledWith(111, DataStatus.ACTIVE)
        );
    });
});
