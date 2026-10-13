import { rest } from "msw";
import mockRouter from "next-router-mock";
import apis from "@/config/apis";
import { fireEvent, render, screen, waitFor, within } from "@/utils/testUtils";
import { generateDatasetForTeamV1 } from "@/mocks/data/dataset";
import { getTeamDatasetsV2 } from "@/mocks/handlers/teams/v2";
import { server } from "@/mocks/server";
import TeamDatasets from "./TeamDatasets";

jest.mock("notistack", () => ({
    ...jest.requireActual("notistack"),
    enqueueSnackbar: jest.fn(),
    __esModule: true,
}));

mockRouter.query = { teamId: "1", tab: "ACTIVE" };
window.scrollTo = jest.fn();

const renderTeamDatasets = () =>
    render(<TeamDatasets permissions={{}} teamId="1" isSuperAdmin={false} />);

describe("TeamDatasets", () => {
    it("should render all datasets (filtered on BE)", async () => {
        const mockDatasets = [
            generateDatasetForTeamV1("1.0", {
                create_origin: "MANUAL",
                status: "ARCHIVED",
            }),
            generateDatasetForTeamV1("1.1", {
                create_origin: "API",
                status: "ACTIVE",
            }),
            generateDatasetForTeamV1("1.0", {
                create_origin: "GMI",
                status: "DRAFT",
            }),
        ];
        server.use(getTeamDatasetsV2(mockDatasets));
        renderTeamDatasets();

        await waitFor(() => {
            const datasetCards = screen.getAllByTestId("dataset-card");
            expect(datasetCards).toHaveLength(3);

            expect(
                within(datasetCards[0]).getByText(
                    `${mockDatasets[0].latest_metadata.summary.title}`
                )
            ).toBeInTheDocument();
            expect(
                within(datasetCards[0]).getByText(
                    `${mockDatasets[0].latest_metadata.summary.publisher.publisherName}`
                )
            ).toBeInTheDocument();
            expect(
                within(datasetCards[0]).getByText(
                    `${mockDatasets[0].latest_metadata.required.version}`
                )
            ).toBeInTheDocument();

            expect(
                within(datasetCards[0]).getByText("Manually")
            ).toBeInTheDocument();
            expect(
                within(datasetCards[1]).getByText("API")
            ).toBeInTheDocument();
            expect(
                within(datasetCards[2]).getByText("Predefined Integration")
            ).toBeInTheDocument();
        });
    });
    it("should render message if no active datasets", async () => {
        server.use(getTeamDatasetsV2([]));
        renderTeamDatasets();

        await waitFor(() => {
            expect(
                screen.getByText(
                    "No active datasets found on the Gateway for your team."
                )
            ).toBeInTheDocument();
        });
    });

    it("should render all datasets (with different GWDM versions)", async () => {
        const mockDatasets = [
            generateDatasetForTeamV1("1.0", {
                create_origin: "API",
                status: "ACTIVE",
            }),
            generateDatasetForTeamV1("1.0", {
                create_origin: "API",
                status: "ACTIVE",
            }),
            generateDatasetForTeamV1("1.1", {
                create_origin: "API",
                status: "ACTIVE",
            }),
        ];
        server.use(getTeamDatasetsV2(mockDatasets));
        renderTeamDatasets();

        await waitFor(() => {
            const datasetCards = screen.getAllByTestId("dataset-card");
            expect(datasetCards).toHaveLength(3);

            expect(
                within(datasetCards[0]).getByText(
                    `${mockDatasets[0].latest_metadata.summary.publisher.publisherName}`
                )
            ).toBeInTheDocument();

            expect(
                within(datasetCards[1]).getByText(
                    `${mockDatasets[1].latest_metadata.summary.publisher.publisherName}`
                )
            ).toBeInTheDocument();

            expect(
                within(datasetCards[2]).getByText(
                    `${mockDatasets[2].latest_metadata.summary.publisher.name}`
                )
            ).toBeInTheDocument();
        });
    });

    it("should carry the draft status and duplicate flag through to the duplicate action's link", async () => {
        const mockDatasets = [
            generateDatasetForTeamV1("1.0", {
                create_origin: "MANUAL",
                status: "DRAFT",
            }),
        ];
        server.use(getTeamDatasetsV2(mockDatasets));
        render(
            <TeamDatasets
                permissions={{
                    "datasets.update": true,
                    "datasets.create": true,
                }}
                teamId="1"
                isSuperAdmin={false}
            />
        );

        await waitFor(() => {
            const duplicateLink = screen.getByRole("link", {
                name: "Duplicate dataset metadata",
            });
            expect(duplicateLink).toHaveAttribute(
                "href",
                expect.stringContaining("duplicate=true")
            );
            expect(duplicateLink).toHaveAttribute(
                "href",
                expect.stringContaining("status=DRAFT")
            );
        });
    });

    it.each([
        [true, "Included", "Exclude from Cohort Discovery"],
        [false, "Excluded", "Include in Cohort Discovery"],
    ])(
        "should show the cohort discovery state and toggle for superadmins (is_cohort_discovery: %s)",
        async (isCohortDiscovery, rowValue, menuLabel) => {
            const mockDatasets = [
                generateDatasetForTeamV1("1.0", {
                    create_origin: "MANUAL",
                    status: "ACTIVE",
                    is_cohort_discovery: isCohortDiscovery,
                }),
            ];
            const onPut = jest.fn();
            server.use(
                getTeamDatasetsV2(mockDatasets),
                rest.put(
                    `${apis.datasetsV2Url}/:id/cohort-discovery`,
                    async (req, res, ctx) => {
                        onPut(req.params.id, await req.json());
                        return res(ctx.json({ message: "success" }));
                    }
                )
            );
            render(<TeamDatasets permissions={{}} teamId="1" isSuperAdmin />);

            const card = await screen.findByTestId("dataset-card");
            expect(within(card).getByText(rowValue)).toBeInTheDocument();

            fireEvent.click(
                within(card).getByRole("button", { name: "More actions" })
            );
            fireEvent.click(
                await screen.findByRole("menuitem", { name: menuLabel })
            );

            await waitFor(() => {
                expect(onPut).toHaveBeenCalledWith(`${mockDatasets[0].id}`, {
                    is_cohort_discovery: !isCohortDiscovery,
                });
            });
        }
    );

    it("should show archive as an icon, and no menu, for non-superadmins", async () => {
        const mockDatasets = [
            generateDatasetForTeamV1("1.0", {
                create_origin: "MANUAL",
                status: "ACTIVE",
            }),
        ];
        server.use(getTeamDatasetsV2(mockDatasets));
        render(
            <TeamDatasets
                permissions={{ "datasets.delete": true }}
                teamId="1"
                isSuperAdmin={false}
            />
        );

        const card = await screen.findByTestId("dataset-card");
        expect(
            within(card).getByRole("button", {
                name: "Archive dataset metadata so it is no longer live on the Gateway",
            })
        ).toBeInTheDocument();
        expect(
            within(card).queryByRole("button", { name: "More actions" })
        ).not.toBeInTheDocument();
    });

    it("should show archive in the menu for superadmins", async () => {
        const mockDatasets = [
            generateDatasetForTeamV1("1.0", {
                create_origin: "MANUAL",
                status: "ACTIVE",
            }),
        ];
        server.use(getTeamDatasetsV2(mockDatasets));
        render(
            <TeamDatasets
                permissions={{ "datasets.delete": true }}
                teamId="1"
                isSuperAdmin
            />
        );

        const card = await screen.findByTestId("dataset-card");
        expect(
            within(card).queryByRole("button", {
                name: "Archive dataset metadata so it is no longer live on the Gateway",
            })
        ).not.toBeInTheDocument();

        fireEvent.click(
            within(card).getByRole("button", { name: "More actions" })
        );

        expect(
            await screen.findByRole("menuitem", { name: "Archive" })
        ).toBeInTheDocument();
    });
});
