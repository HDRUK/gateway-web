import { rest } from "msw";
import apis from "@/config/apis";
import { render, screen, waitFor } from "@/utils/testUtils";
import { generateTool } from "@/mocks/data/tool";
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

const mockTool = generateTool({
    name: "Test Tool",
    info: "TEST",
    url: "www.google",
});

const mockToolHandler = (tool = mockTool) =>
    rest.get(`${apis.teamsV2Url}/${TEAM_ID}/tools/${tool.id}`, (_, res, ctx) =>
        res(ctx.status(200), ctx.json({ data: tool }))
    );

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
        server.use(mockToolHandler());

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
        server.use(mockToolHandler());

        render(
            <CreateTool userId={1} teamId="2" toolId={mockTool.id.toString()} />
        );

        await waitFor(() => {
            const nameInput = screen.getByLabelText(/name/i);
            expect(nameInput).toHaveValue("");
        });
    });

    it("handles failed fetch without crashing", async () => {
        server.use(
            rest.get(
                `${apis.teamsV2Url}/${TEAM_ID}/tools/${mockTool.id}`,
                (req, res, ctx) => res(ctx.status(500))
            )
        );

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
