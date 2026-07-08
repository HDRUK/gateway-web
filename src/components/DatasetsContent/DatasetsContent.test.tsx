import { NetworkDataset } from "@/interfaces/DataCustodianNetwork";
import { render, screen } from "@/utils/testUtils";
import DatasetsContent from "./DatasetsContent";

const makeDataset = (id: number, teamId: string): NetworkDataset => ({
    id,
    user_id: 1,
    team_id: teamId,
    title: `Dataset ${id}`,
    populationSize: 1000,
    datasetType: "Registry",
    team: { id: Number(teamId), name: `Team ${teamId}` },
});

describe("DatasetsContent", () => {
    it("renders the classic section when associatedDatasets is undefined", () => {
        render(
            <DatasetsContent
                datasets={[makeDataset(1, "10"), makeDataset(2, "20")]}
                anchorIndex={2}
                translationPath="pages.dataCustodian"
                selectedTeamIds={new Set()}
            />
        );

        expect(screen.getByText(/^Datasets \(/)).toBeInTheDocument();
        expect(
            screen.queryByText("Associated datasets")
        ).not.toBeInTheDocument();
        expect(screen.getByText("Dataset 1")).toBeInTheDocument();
        expect(screen.getByText("Dataset 2")).toBeInTheDocument();
    });

    it("renders owned and associated panes with counts when associatedDatasets provided", () => {
        render(
            <DatasetsContent
                datasets={[makeDataset(1, "10"), makeDataset(2, "20")]}
                associatedDatasets={[makeDataset(3, "30")]}
                anchorIndex={2}
                translationPath="pages.dataCustodian"
                selectedTeamIds={new Set()}
            />
        );

        // outer accordion title + owned pane title
        expect(screen.getAllByText("Datasets")).toHaveLength(2);
        expect(screen.getByText("(2)")).toBeInTheDocument();
        expect(screen.getByText("Associated datasets")).toBeInTheDocument();
        expect(screen.getByText("(1)")).toBeInTheDocument();
        expect(screen.getByText("Dataset 3")).toBeInTheDocument();
        expect(screen.getByText("Team 30")).toBeInTheDocument();
    });

    it("filters owned datasets by selectedTeamIds but not associated ones", () => {
        render(
            <DatasetsContent
                datasets={[makeDataset(1, "10"), makeDataset(2, "20")]}
                associatedDatasets={[makeDataset(3, "30")]}
                anchorIndex={2}
                translationPath="pages.dataCustodian"
                selectedTeamIds={new Set(["10"])}
            />
        );

        expect(screen.getByText("Dataset 1")).toBeInTheDocument();
        expect(screen.queryByText("Dataset 2")).not.toBeInTheDocument();
        expect(screen.getByText("Dataset 3")).toBeInTheDocument();
        expect(screen.getAllByText("(1)")).toHaveLength(2);
    });
});
