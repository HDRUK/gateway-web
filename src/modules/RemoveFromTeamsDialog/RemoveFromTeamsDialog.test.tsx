import usePost from "@/hooks/usePost";
import { render, screen, fireEvent, waitFor } from "@/utils/testUtils";
import RemoveFromTeamsDialog from "./RemoveFromTeamsDialog";

jest.mock("@/hooks/usePost");
jest.mock("@/services/notification");

const teams = [
    { id: 1, name: "Team Alpha" },
    { id: 2, name: "Team Beta" },
];

describe("RemoveFromTeamsDialog", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("disables confirm until at least one team is selected, then submits the selection", async () => {
        const removeFromTeams = jest.fn().mockResolvedValue({});
        (usePost as jest.Mock).mockReturnValue(removeFromTeams);

        const onRemoved = jest.fn();

        render(
            <RemoveFromTeamsDialog
                userId={1}
                userName="Jane Doe"
                teams={teams}
                onRemoved={onRemoved}
            />
        );

        const confirmButton = screen.getByRole("button", {
            name: /remove from selected teams/i,
        });
        expect(confirmButton).toBeDisabled();

        fireEvent.click(screen.getByLabelText("Team Alpha"));
        expect(confirmButton).toBeEnabled();

        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(removeFromTeams).toHaveBeenCalledWith({ team_ids: [1] });
        });
        expect(onRemoved).toHaveBeenCalledWith([1]);
    });

    it("shows a message when the user has no teams to remove", () => {
        (usePost as jest.Mock).mockReturnValue(jest.fn());

        render(
            <RemoveFromTeamsDialog
                userId={1}
                userName="Jane Doe"
                teams={[]}
                onRemoved={jest.fn()}
            />
        );

        expect(
            screen.getByText(/not currently a member of any teams/i)
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /remove from selected teams/i })
        ).toBeDisabled();
    });
});
