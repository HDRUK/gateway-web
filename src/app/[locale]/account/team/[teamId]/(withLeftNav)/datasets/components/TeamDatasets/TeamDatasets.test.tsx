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

const getActivationHandlers = (
    dataset: ReturnType<typeof generateDatasetForTeamV1>,
    validation: object[],
    onHydration = jest.fn()
) => [
    rest.get(`${apis.teamsV2Url}/1/datasets/:id`, (req, res, ctx) =>
        res(ctx.json({ data: dataset }))
    ),
    rest.get(`${apis.teamsV1Url}/:pid/id`, (req, res, ctx) =>
        res(ctx.json({ data: "1" }))
    ),
    rest.get(apis.formHydrationV1Url, (req, res, ctx) => {
        onHydration();
        return res(
            ctx.json({
                data: { schema_fields: [], validation, defaultValues: {} },
            })
        );
    }),
];

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

    it("should make a draft dataset active from the status menu", async () => {
        const mockDatasets = [
            generateDatasetForTeamV1("1.0", {
                create_origin: "MANUAL",
                status: "DRAFT",
            }),
        ];
        const onPatch = jest.fn();
        server.use(
            getTeamDatasetsV2(mockDatasets),
            ...getActivationHandlers(mockDatasets[0], []),
            rest.patch(
                `${apis.teamsV2Url}/1/datasets/:id`,
                async (req, res, ctx) => {
                    onPatch(req.params.id, await req.json());
                    return res(ctx.json({ message: "success" }));
                }
            )
        );
        render(
            <TeamDatasets
                permissions={{ "datasets.update": true }}
                teamId="1"
                isSuperAdmin={false}
            />
        );

        const card = await screen.findByTestId("dataset-card");
        fireEvent.click(
            within(card).getByRole("button", {
                name: "Status: Draft. Change status",
            })
        );
        fireEvent.click(
            await screen.findByRole("menuitemradio", { name: "Active" })
        );

        await waitFor(() => {
            expect(onPatch).toHaveBeenCalledWith(`${mockDatasets[0].id}`, {
                status: "ACTIVE",
            });
        });
    });

    it("should not make a dataset active when it fails validation", async () => {
        const mockDatasets = [
            generateDatasetForTeamV1("1.0", {
                create_origin: "MANUAL",
                status: "DRAFT",
            }),
        ];
        const onHydration = jest.fn();
        const onPatch = jest.fn();
        server.use(
            getTeamDatasetsV2(mockDatasets),
            ...getActivationHandlers(
                mockDatasets[0],
                [{ title: "Missing field", type: "string", required: true }],
                onHydration
            ),
            rest.patch(`${apis.teamsV2Url}/1/datasets/:id`, (req, res, ctx) => {
                onPatch();
                return res(ctx.json({ message: "success" }));
            })
        );
        render(
            <TeamDatasets
                permissions={{ "datasets.update": true }}
                teamId="1"
                isSuperAdmin={false}
            />
        );

        const card = await screen.findByTestId("dataset-card");
        fireEvent.click(
            within(card).getByRole("button", {
                name: "Status: Draft. Change status",
            })
        );
        fireEvent.click(
            await screen.findByRole("menuitemradio", { name: "Active" })
        );

        await waitFor(() => {
            expect(onHydration).toHaveBeenCalled();
        });
        await waitFor(() => {
            expect(
                within(card).getByRole("button", {
                    name: "Status: Draft. Change status",
                })
            ).not.toHaveAttribute("aria-busy", "true");
        });
        expect(onPatch).not.toHaveBeenCalled();
    });

    it("should only allow archiving with delete permission", async () => {
        const mockDatasets = [
            generateDatasetForTeamV1("1.0", {
                create_origin: "MANUAL",
                status: "ACTIVE",
            }),
        ];
        server.use(getTeamDatasetsV2(mockDatasets));
        render(
            <TeamDatasets
                permissions={{ "datasets.update": true }}
                teamId="1"
                isSuperAdmin={false}
            />
        );

        const card = await screen.findByTestId("dataset-card");
        fireEvent.click(
            within(card).getByRole("button", {
                name: "Status: Active. Change status",
            })
        );

        expect(
            await screen.findByRole("menuitemradio", { name: "Archived" })
        ).toHaveAttribute("aria-disabled", "true");
    });

    it("should allow archiving but not other status changes with only delete permission", async () => {
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
        fireEvent.click(
            within(card).getByRole("button", {
                name: "Status: Active. Change status",
            })
        );

        expect(
            await screen.findByRole("menuitemradio", { name: "Archived" })
        ).not.toHaveAttribute("aria-disabled");
        expect(
            screen.getByRole("menuitemradio", { name: "Draft" })
        ).toHaveAttribute("aria-disabled", "true");
    });
});
