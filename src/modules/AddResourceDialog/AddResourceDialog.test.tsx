import { ResourceType } from "@/interfaces/AddResource";
import { fireEvent, render, waitFor, screen } from "@/utils/testUtils";
import { generateDataUse } from "@/mocks/data";
import { getDataUses } from "@/mocks/handlers/dataUses";
import { server } from "@/mocks/server";
import AddDatasetDialog from "./AddResourceDialog";

describe("AddResourcesDialog", () => {
    it("renders data uses after loading data", async () => {
        const mockData = [generateDataUse(), generateDataUse()];
        server.use(getDataUses(mockData));

        render(
            <AddDatasetDialog
                defaultResources={{ [ResourceType.DATA_USE]: [] }}
                setResources={jest.fn()}
            />
        );

        expect(screen.getByText(/Loading/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(/results shown/i)).toBeInTheDocument();
        });

        // Should render project titles
        mockData.forEach(item => {
            expect(screen.getByText(item.project_title)).toBeInTheDocument();
        });
    });

    it("selects a data use resouce", async () => {
        const mockData = [generateDataUse()];
        const mockSetResources = jest.fn();

        server.use(getDataUses(mockData));

        render(
            <AddDatasetDialog
                defaultResources={{ [ResourceType.DATA_USE]: [] }}
                setResources={mockSetResources}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/results shown/i)).toBeInTheDocument();
        });

        // Select first checkbox
        const checkbox = screen.getByRole("checkbox");
        fireEvent.click(checkbox);

        // Submit selection
        fireEvent.click(screen.getByText(/add resources/i));

        expect(mockSetResources).toHaveBeenCalledWith(
            expect.objectContaining({
                [ResourceType.DATA_USE]: expect.arrayContaining([
                    expect.objectContaining({
                        id: mockData[0].id,
                    }),
                ]),
            })
        );
    });

    it("shows 'no results' if empty", async () => {
        server.use(getDataUses([]));

        render(
            <AddDatasetDialog
                defaultResources={{ [ResourceType.DATA_USE]: [] }}
                setResources={jest.fn()}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/no results/i)).toBeInTheDocument();
        });
    });

    it("displays correct chip labels", async () => {
        server.use(getDataUses());

        render(
            <AddDatasetDialog
                defaultResources={{ [ResourceType.DATA_USE]: [] }}
                setResources={jest.fn()}
            />
        );

        await waitFor(() => {
            expect(screen.getByLabelText(/data use/i)).toBeInTheDocument();
        });
    });

    it("displays fallback or empty state when API call fails", async () => {
        server.use(getDataUses([], 500));

        render(
            <AddDatasetDialog
                defaultResources={{ [ResourceType.DATA_USE]: [] }}
                setResources={jest.fn()}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/no results/i)).toBeInTheDocument();
        });
    });

    it("adds resource from list when selected", async () => {
        const mockData = [generateDataUse()];
        server.use(getDataUses(mockData));

        render(
            <AddDatasetDialog
                defaultResources={{ [ResourceType.DATA_USE]: [] }}
                setResources={jest.fn()}
            />
        );

        await waitFor(() => {
            expect(
                screen.getByText(mockData[0].project_title)
            ).toBeInTheDocument();
        });

        expect(screen.getByText(/^0 selected$/i)).toBeInTheDocument();
        const checkbox = screen.getByRole("checkbox");
        fireEvent.click(checkbox);
        expect(screen.getByText(/^1 selected$/i)).toBeInTheDocument();
    });

    it("does not call setResources if nothing is selected", async () => {
        const mockSetResources = jest.fn();
        server.use(getDataUses([]));

        render(
            <AddDatasetDialog
                defaultResources={{ [ResourceType.DATA_USE]: [] }}
                setResources={mockSetResources}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/no results/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/add resources/i));
        expect(mockSetResources).toHaveBeenCalledWith(
            expect.objectContaining({
                [ResourceType.DATA_USE]: [],
            })
        );
    });
});
