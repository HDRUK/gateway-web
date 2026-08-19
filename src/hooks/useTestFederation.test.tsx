import { rest } from "msw";
import { useForm } from "react-hook-form";
import { FederationTestStatus } from "@/interfaces/Federation";
import { Integration } from "@/interfaces/Integration";
import useTestFederation from "@/hooks/useTestFederation";
import { act, renderHook, waitFor } from "@/utils/testUtils";
import apis from "@/config/apis";
import { federationTestResponseV1, integrationV1 } from "@/mocks/data/integration";
import { teamV1 } from "@/mocks/data/team";
import { postFederationsTestV1 } from "@/mocks/handlers/integration";
import { server } from "@/mocks/server";

describe("useTestFederation", () => {
    const teamId = teamV1.id.toString();

    it("should return the `NOT_RUN` status on first load when `tested` is false", async () => {
        const mockIntegration = { ...integrationV1, tested: false };
        const { result: formResult } = renderHook(() =>
            useForm({ defaultValues: mockIntegration })
        );
        const { result } = renderHook(() =>
            useTestFederation({
                teamId,
                integration: mockIntegration,
                control: formResult.current.control,
                reset: formResult.current.reset,
                getValues: formResult.current.getValues,
                setValue: formResult.current.setValue,
            })
        );
        await waitFor(() => {
            expect(result.current).toEqual({
                handleTest: expect.any(Function),
                testResponse: undefined,
                testStatus: FederationTestStatus.NOT_RUN,
                setTestedConfig: expect.any(Function),
            });
        });
    });

    it("should return the `TESTED_IS_TRUE` status on first load when `tested` is true", async () => {
        const mockIntegration = { ...integrationV1, tested: true };
        const { result: formResult } = renderHook(() =>
            useForm({ defaultValues: mockIntegration })
        );
        const { result } = renderHook(() =>
            useTestFederation({
                teamId,
                integration: mockIntegration,
                control: formResult.current.control,
                reset: formResult.current.reset,
                getValues: formResult.current.getValues,
                setValue: formResult.current.setValue,
            })
        );
        await waitFor(() => {
            expect(result.current).toEqual({
                handleTest: expect.any(Function),
                testResponse: undefined,
                testStatus: FederationTestStatus.TESTED_IS_TRUE,
                setTestedConfig: expect.any(Function),
            });
        });
    });
    it("should return the `RUN_COMPLETE` following api call", async () => {
        const testResponse = {
            success: false,
            status: 404,
            title: "Test failed",
        };
        server.use(postFederationsTestV1({ data: testResponse }));

        const mockIntegration = { ...integrationV1, tested: true };

        const { result: formResult } = renderHook(() =>
            useForm({ defaultValues: mockIntegration })
        );
        const { result } = renderHook(() =>
            useTestFederation({
                teamId,
                integration: mockIntegration,
                control: formResult.current.control,
                reset: formResult.current.reset,
                getValues: formResult.current.getValues,
                setValue: formResult.current.setValue,
            })
        );

        act(() => {
            result.current.handleTest();
        });

        await waitFor(() => {
            expect(result.current).toEqual({
                handleTest: expect.any(Function),
                testResponse,
                testStatus: FederationTestStatus.RUN_COMPLETE,
                setTestedConfig: expect.any(Function),
            });
        });
    });

    it("should include the federation id in the test payload for an already-saved integration", async () => {
        let capturedBody: unknown;
        server.use(
            rest.post(
                `${apis.teamsV1Url}/${teamId}/federations/test`,
                async (req, res, ctx) => {
                    capturedBody = await req.json();
                    return res(
                        ctx.status(200),
                        ctx.json({ data: federationTestResponseV1 })
                    );
                }
            )
        );

        const mockIntegration = { ...integrationV1, tested: true };
        const { result: formResult } = renderHook(() =>
            useForm({ defaultValues: mockIntegration })
        );
        const { result } = renderHook(() =>
            useTestFederation({
                teamId,
                integration: mockIntegration,
                control: formResult.current.control,
                reset: formResult.current.reset,
                getValues: formResult.current.getValues,
                setValue: formResult.current.setValue,
            })
        );

        await act(async () => {
            await result.current.handleTest();
        });

        expect(capturedBody).toMatchObject({ id: mockIntegration.id });
    });

    it("should omit the federation id when testing an integration that has not been saved yet", async () => {
        let capturedBody: unknown;
        server.use(
            rest.post(
                `${apis.teamsV1Url}/${teamId}/federations/test`,
                async (req, res, ctx) => {
                    capturedBody = await req.json();
                    return res(
                        ctx.status(200),
                        ctx.json({ data: federationTestResponseV1 })
                    );
                }
            )
        );

        const { id, ...unsavedIntegration } = { ...integrationV1, tested: true };
        const { result: formResult } = renderHook(() =>
            useForm({ defaultValues: unsavedIntegration })
        );
        const { result } = renderHook(() =>
            useTestFederation({
                teamId,
                integration: unsavedIntegration as unknown as Integration,
                control: formResult.current.control,
                reset: formResult.current.reset,
                getValues: formResult.current.getValues,
                setValue: formResult.current.setValue,
            })
        );

        await act(async () => {
            await result.current.handleTest();
        });

        expect(capturedBody).not.toHaveProperty("id");
    });
});
