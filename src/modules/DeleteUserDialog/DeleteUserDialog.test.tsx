import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import { UserDeletionCheck, UserPickerOption } from "@/interfaces/AdminUser";
import { render, screen, fireEvent, waitFor } from "@/utils/testUtils";
import DeleteUserDialog from "./DeleteUserDialog";

jest.mock("@/hooks/useGet");
jest.mock("@/hooks/usePost");
jest.mock("@/services/notification");

const emptyDeletionCheck: UserDeletionCheck = {
    datasets: [],
    tools: [],
    applications: [],
    reviews: [],
    cohort_requests: [],
    enquiry_threads: [],
    collections: [],
};

const mockUsers: UserPickerOption[] = [
    {
        id: 2,
        firstname: "Jane",
        lastname: "Smith",
        name: "Jane Smith",
        teams: [{ id: 1, name: "Team Alpha" }],
    },
    {
        id: 3,
        firstname: "John",
        lastname: "Doe",
        name: "John Doe",
        teams: [],
    },
];

describe("DeleteUserDialog", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("offers a simple confirmation when the user has no linked data", async () => {
        (useGet as jest.Mock).mockImplementation((url: string) =>
            url.includes("deletion-check")
                ? { data: emptyDeletionCheck, isLoading: false }
                : { data: mockUsers, isLoading: false }
        );

        const transferAndDelete = jest.fn().mockResolvedValue(undefined);
        (usePost as jest.Mock).mockReturnValue(transferAndDelete);

        const onDeleted = jest.fn();

        render(
            <DeleteUserDialog
                userId={1}
                userName="Jane Doe"
                onDeleted={onDeleted}
            />
        );

        expect(
            screen.getByText(/has no linked data/i)
        ).toBeInTheDocument();

        const confirmButton = screen.getByRole("button", {
            name: /delete permanently/i,
        });
        expect(confirmButton).toBeEnabled();

        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(transferAndDelete).toHaveBeenCalledWith({
                reassignments: [],
            });
        });
        expect(onDeleted).toHaveBeenCalledWith(1);
    });

    it("disables the confirm button until every linked item is resolved", async () => {
        const deletionCheck: UserDeletionCheck = {
            ...emptyDeletionCheck,
            tools: [{ id: 10, name: "Some Tool" }],
            reviews: [{ id: 20, review_text: "A review" }],
        };

        (useGet as jest.Mock).mockImplementation((url: string) =>
            url.includes("deletion-check")
                ? { data: deletionCheck, isLoading: false }
                : { data: mockUsers, isLoading: false }
        );

        const transferAndDelete = jest.fn().mockResolvedValue(undefined);
        (usePost as jest.Mock).mockReturnValue(transferAndDelete);

        render(
            <DeleteUserDialog
                userId={1}
                userName="Jane Doe"
                onDeleted={jest.fn()}
            />
        );

        expect(
            screen.getByText(/Analysis Scripts & Software \(1\)/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/Reviews \(1\)/i)).toBeInTheDocument();

        // Each entity-type section is an independently collapsible
        // accordion, expanded by default.
        const toolsToggle = screen.getByRole("button", {
            name: /Analysis Scripts & Software \(1\)/i,
        });
        expect(toolsToggle).toHaveAttribute("aria-expanded", "true");

        fireEvent.click(toolsToggle);
        expect(toolsToggle).toHaveAttribute("aria-expanded", "false");

        fireEvent.click(toolsToggle);
        expect(toolsToggle).toHaveAttribute("aria-expanded", "true");

        const confirmButton = screen.getByRole("button", {
            name: /delete permanently/i,
        });
        expect(confirmButton).toBeDisabled();

        const deleteRadios = screen.getAllByRole("radio", {
            name: /delete this item/i,
        });
        expect(deleteRadios).toHaveLength(2);

        fireEvent.click(deleteRadios[0]);
        expect(confirmButton).toBeDisabled();

        fireEvent.click(deleteRadios[1]);
        expect(confirmButton).toBeEnabled();

        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(transferAndDelete).toHaveBeenCalledWith({
                reassignments: expect.arrayContaining([
                    {
                        entity_type: "tool",
                        entity_id: 10,
                        delete: true,
                    },
                    {
                        entity_type: "review",
                        entity_id: 20,
                        delete: true,
                    },
                ]),
            });
        });
    });

    it("does not offer a delete option for a linked dataset - it must be reassigned", async () => {
        const deletionCheck: UserDeletionCheck = {
            ...emptyDeletionCheck,
            datasets: [{ id: 10, title: "Some Dataset" }],
        };

        (useGet as jest.Mock).mockImplementation((url: string) =>
            url.includes("deletion-check")
                ? { data: deletionCheck, isLoading: false }
                : { data: mockUsers, isLoading: false }
        );

        const transferAndDelete = jest.fn().mockResolvedValue(undefined);
        (usePost as jest.Mock).mockReturnValue(transferAndDelete);

        render(
            <DeleteUserDialog
                userId={1}
                userName="Jane Doe"
                onDeleted={jest.fn()}
            />
        );

        expect(
            screen.queryByRole("radio", { name: /delete this item/i })
        ).not.toBeInTheDocument();

        const confirmButton = screen.getByRole("button", {
            name: /delete permanently/i,
        });
        expect(confirmButton).toBeDisabled();

        fireEvent.click(screen.getByRole("radio", { name: /reassign to/i }));
        fireEvent.mouseDown(screen.getByLabelText("New owner"));
        fireEvent.click(await screen.findByText(/jane smith/i));

        expect(confirmButton).toBeEnabled();

        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(transferAndDelete).toHaveBeenCalledWith({
                reassignments: [
                    { entity_type: "dataset", entity_id: 10, new_user_id: 2 },
                ],
            });
        });
    });

    it("does not offer a reassign option for a linked cohort request - it must be deleted", async () => {
        const deletionCheck: UserDeletionCheck = {
            ...emptyDeletionCheck,
            cohort_requests: [{ id: 30 }],
        };

        (useGet as jest.Mock).mockImplementation((url: string) =>
            url.includes("deletion-check")
                ? { data: deletionCheck, isLoading: false }
                : { data: mockUsers, isLoading: false }
        );

        const transferAndDelete = jest.fn().mockResolvedValue(undefined);
        (usePost as jest.Mock).mockReturnValue(transferAndDelete);

        render(
            <DeleteUserDialog
                userId={1}
                userName="Jane Doe"
                onDeleted={jest.fn()}
            />
        );

        expect(
            screen.queryByRole("radio", { name: /reassign to/i })
        ).not.toBeInTheDocument();

        const confirmButton = screen.getByRole("button", {
            name: /delete permanently/i,
        });
        expect(confirmButton).toBeDisabled();

        fireEvent.click(
            screen.getByRole("radio", { name: /delete this item/i })
        );
        expect(confirmButton).toBeEnabled();

        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(transferAndDelete).toHaveBeenCalledWith({
                reassignments: [
                    { entity_type: "cohort_request", entity_id: 30, delete: true },
                ],
            });
        });
    });
});
