import { render, screen, waitFor } from "@/utils/testUtils";
import { getTeamToolV2 } from "@/mocks/handlers/teams/v2";
import { server } from "@/mocks/server";
import CreateTool from "./CreateTool";

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

jest.mock("@/hooks/useDialog", () => () => ({
    showDialog: jest.fn(),
}));

const TEAM_ID = 1;

const mockTool = { id: 99, name: "Test Tool" };

describe("CreateTool", () => {
    it("renders create tool form UI", async () => {
        render(<CreateTool userId={1} />);

        expect(
            screen.getByRole("heading", {
                name: /Manage or create analysis script, tool or software/i,
            })
        ).toBeInTheDocument();
    });

    it("loads and populates form with existing tool when editing", async () => {
        server.use(getTeamToolV2(mockTool));

        render(
            <CreateTool
                userId={1}
                teamId={TEAM_ID.toString()}
                toolId={mockTool.id.toString()}
            />
        );

        await waitFor(() => {
            expect(screen.getByLabelText(/name/i)).toBeInTheDocument();

            const nameInput = screen.getByLabelText(/name/i);
            expect(nameInput).toHaveValue(mockTool.name);
        });
    });

    it("doesn't show data if team id doesn't match", async () => {
        server.use(getTeamToolV2(mockTool));

        render(
            <CreateTool userId={1} teamId="2" toolId={mockTool.id.toString()} />
        );

        await waitFor(() => {
            const nameInput = screen.getByLabelText(/name/i);
            expect(nameInput).toHaveValue("");
        });
    });

    it("handles failed fetch without crashing", async () => {
        server.use(getTeamToolV2(mockTool, 500));

        render(
            <CreateTool
                userId={1}
                teamId={TEAM_ID.toString()}
                toolId={mockTool.id.toString()}
            />
        );

        await waitFor(() => {
            const nameInput = screen.getByLabelText(/name/i);
            expect(nameInput).toHaveValue("");
        });
    });
});
