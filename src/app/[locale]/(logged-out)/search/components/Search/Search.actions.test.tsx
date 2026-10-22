import Cookies from "js-cookie";
import { rest } from "msw";
import { SearchCategory } from "@/interfaces/Search";
import ProvidersDialog from "@/modules/ProvidersDialog";
import apis from "@/config/apis";
import config from "@/config/config";
import messages from "@/config/messages/en.json";
import { PostLoginActions } from "@/consts/postLoginActions";
import { downloadFile } from "@/utils/download";
import { fireEvent, screen, waitFor, within } from "@/utils/testUtils";
import { generateSearchV2Response } from "@/mocks/data/search";
import { getAuthInternal } from "@/mocks/handlers/auth";
import { postSavedSearchV1, RecordedRequest } from "@/mocks/handlers/search";
import { server } from "@/mocks/server";
import { mockSearch, renderSearch, resetSearchTestState } from "./testUtils";

const mockShowDARApplicationModal = jest.fn();

jest.mock("notistack", () => ({
    ...jest.requireActual("notistack"),
    enqueueSnackbar: jest.fn(),
    __esModule: true,
}));

jest.mock("@/providers/FeatureProvider", () => ({
    useFeatures: jest.fn(),
}));

jest.mock("@/hooks/useCohortStatus", () => ({
    useCohortStatus: () => ({ requestStatus: null, hasAccess: false }),
}));

jest.mock("@/utils/download", () => ({
    downloadFile: jest.fn(),
}));

jest.mock("@/hooks/useDataAccessRequest", () => ({
    __esModule: true,
    default: () => ({
        showDARApplicationModal: mockShowDARApplicationModal,
    }),
}));

jest.mock("@/modules/FeasibilityEnquiryDialog", () => ({
    __esModule: true,
    default: () => <div data-testid="feasibility-enquiry-dialog" />,
}));

jest.mock("@/modules/GeneralEnquirySidebar", () => ({
    __esModule: true,
    default: () => <div data-testid="general-enquiry-sidebar" />,
}));

const t = messages.pages.search;
const tSave = messages.modules.dialogs.SaveSearch;

const mockDownload = (requests: RecordedRequest[]) =>
    server.use(
        rest.post(`${apis.searchV1Url}/datasets`, async (req, res, ctx) => {
            const body = await req.json();
            requests.push({
                path: req.url.pathname,
                searchParams: Object.fromEntries(req.url.searchParams),
                body,
            });
            return res(
                ctx.status(200),
                ctx.set("Content-Type", "text/csv"),
                ctx.body("id,title")
            );
        })
    );

const setPostLoginAction = (action: PostLoginActions, data = {}) =>
    Cookies.set(
        config.POST_LOGIN_ACTION_COOKIE,
        JSON.stringify({ action, ...data }),
        { path: "/" }
    );

describe("Search actions", () => {
    beforeEach(() => {
        resetSearchTestState();
        jest.clearAllMocks();
    });

    describe("download", () => {
        it("downloads the current search as csv", async () => {
            const requests: RecordedRequest[] = [];
            mockDownload(requests);
            mockSearch(SearchCategory.DATASETS);
            renderSearch("/search?type=datasets&query=asthma&page=2");
            await screen.findByRole("table");

            fireEvent.click(
                screen.getByRole("button", { name: t.downloadResults })
            );

            await waitFor(() => expect(downloadFile).toHaveBeenCalled());
            expect(requests[0].searchParams).toEqual({
                per_page: "25",
                page: "2",
                sort: "score:desc",
            });
            expect(requests[0].body).toEqual({
                query: "asthma",
                download: true,
                download_type: "table",
            });
            expect(downloadFile).toHaveBeenCalledWith({
                content: "id,title",
                type: "text/csv",
                filename: "datasets.csv",
            });
        });

        it("disables download when there are no results", async () => {
            mockSearch(
                SearchCategory.TOOLS,
                generateSearchV2Response(SearchCategory.TOOLS, {}, { hits: [] })
            );

            renderSearch("/search?type=tools");

            await screen.findByText(t.noResults);
            expect(
                screen.getByRole("button", { name: t.downloadResults })
            ).toBeDisabled();
        });

        it.each([
            SearchCategory.PUBLICATIONS,
            SearchCategory.DATA_CUSTODIANS,
            SearchCategory.COLLECTIONS,
        ])("hides download for %s", async type => {
            mockSearch(type);

            renderSearch(`/search?type=${type}`);

            await screen.findByRole("button", { name: t.saveSearch });
            expect(
                screen.queryByRole("button", { name: t.downloadResults })
            ).not.toBeInTheDocument();
        });
    });

    describe("save search", () => {
        it("saves the search with its filters when logged in", async () => {
            const saveRequests: RecordedRequest[] = [];
            server.use(postSavedSearchV1(saveRequests));
            mockSearch(SearchCategory.DATASETS);
            renderSearch(
                "/search?type=datasets&query=asthma&sort=title:asc&containsBioSamples=containsBioSamples"
            );
            await screen.findByRole("table");

            fireEvent.click(screen.getByRole("button", { name: t.saveSearch }));
            const dialog = await screen.findByRole("dialog");
            fireEvent.change(within(dialog).getByRole("textbox"), {
                target: { value: "My search" },
            });
            fireEvent.click(
                within(dialog).getByRole("button", {
                    name: tSave.saveQueryButton,
                })
            );

            await waitFor(() => expect(saveRequests).toHaveLength(1));
            expect(saveRequests[0].body).toEqual({
                search_term: "asthma",
                sort_order: "title:asc",
                name: "My search",
                search_endpoint: "datasets",
                filters: [{ id: 1, terms: ["containsBioSamples"] }],
                enabled: true,
            });
            await waitFor(() =>
                expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
            );
        });

        it("asks a logged out user to sign in and remembers the action", async () => {
            server.use(getAuthInternal(null));
            mockSearch(SearchCategory.DATASETS);
            renderSearch(
                "/search?type=datasets&query=asthma",
                <ProvidersDialog />
            );
            await screen.findByRole("table");

            fireEvent.click(screen.getByRole("button", { name: t.saveSearch }));

            expect(
                await screen.findByText(
                    messages.modules.dialogs.ProvidersDialog.title
                )
            ).toBeInTheDocument();
            expect(
                JSON.parse(Cookies.get(config.POST_LOGIN_ACTION_COOKIE) || "")
            ).toEqual({ action: PostLoginActions.SAVE_SEARCH });
        });
    });

    describe("post login actions", () => {
        const expectCookieCleared = () =>
            waitFor(() =>
                expect(
                    Cookies.get(config.POST_LOGIN_ACTION_COOKIE)
                ).toBeUndefined()
            );

        beforeEach(() => {
            mockSearch(SearchCategory.DATASETS);
        });

        it("reopens the save search dialog", async () => {
            setPostLoginAction(PostLoginActions.SAVE_SEARCH);

            renderSearch("/search?type=datasets&query=asthma");

            expect(await screen.findByText(tSave.name)).toBeInTheDocument();
            await expectCookieCleared();
        });

        it("opens the add to library modal", async () => {
            setPostLoginAction(PostLoginActions.ADD_LIBRARY, { datasetId: 5 });

            renderSearch("/search?type=datasets");

            expect(
                await screen.findByText(t.hooks.useAddLibraryModal.title)
            ).toBeInTheDocument();
            await expectCookieCleared();
        });

        it("refreshes the results table libraries after adding to a library", async () => {
            const libraryRequests: string[] = [];
            const addedLibraries: Record<string, unknown>[] = [];
            server.use(
                rest.get(apis.librariesV1Url, (req, res, ctx) => {
                    libraryRequests.push(req.url.search);
                    return res(ctx.status(200), ctx.json({ data: [] }));
                }),
                rest.post(apis.librariesV1Url, async (req, res, ctx) => {
                    addedLibraries.push(await req.json());
                    return res(ctx.status(200), ctx.json({ data: 1 }));
                })
            );
            setPostLoginAction(PostLoginActions.ADD_LIBRARY, { datasetId: 5 });
            renderSearch("/search?type=datasets");
            await screen.findByRole("table");
            await waitFor(() =>
                expect(libraryRequests.length).toBeGreaterThan(0)
            );
            const requestsBeforeAdding = libraryRequests.length;

            fireEvent.click(
                await screen.findByRole("button", {
                    name: t.hooks.useAddLibraryModal.buttonContinueText,
                })
            );

            await waitFor(() =>
                expect(addedLibraries[0]).toMatchObject({ dataset_id: 5 })
            );
            await waitFor(() =>
                expect(libraryRequests.length).toBeGreaterThan(
                    requestsBeforeAdding
                )
            );
        });

        it("opens the general enquiry sidebar", async () => {
            setPostLoginAction(PostLoginActions.OPEN_GENERAL_ENQUIRY, {
                dataset: { datasetId: 5 },
            });

            renderSearch("/search?type=datasets");

            expect(
                await screen.findByTestId("general-enquiry-sidebar")
            ).toBeInTheDocument();
            await expectCookieCleared();
        });

        it("opens the feasibility enquiry dialog", async () => {
            setPostLoginAction(PostLoginActions.OPEN_FEASIBILITY_ENQUIRY, {
                dataset: { datasetId: 5 },
            });

            renderSearch("/search?type=datasets");

            expect(
                await screen.findByTestId("feasibility-enquiry-dialog")
            ).toBeInTheDocument();
            await expectCookieCleared();
        });

        it("starts a data access request", async () => {
            setPostLoginAction(PostLoginActions.START_DAR_REQUEST, {
                datasetIds: [5],
            });

            renderSearch("/search?type=datasets");

            await waitFor(() =>
                expect(mockShowDARApplicationModal).toHaveBeenCalledWith({
                    datasetIds: [5],
                })
            );
            await expectCookieCleared();
        });
    });
});
