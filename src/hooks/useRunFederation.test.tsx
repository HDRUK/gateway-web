import useRunFederation from "@/hooks/useRunFederation";
import { server } from "@/mocks/server";
import { renderHook, waitFor } from "@/utils/testUtils";
import { teamV1 } from "@/mocks/data/team";
import { integrationV1 } from "@/mocks/data/integration";
import { useForm } from "react-hook-form";
import { postFederationsTestV1 } from "@/mocks/handlers/integration";

describe("useRunFederation", () => {
    const teamId = teamV1.id;

    it("should return the `NOT_RUN` status on first load when `tested` is false", async () => {
        const mockIntegration = { ...integrationV1, tested: false };
        const { result: formResult } = renderHook(() =>
            useForm({ defaultValues: mockIntegration })
        );
        const { result } = renderHook(() =>
            useRunFederation({
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
                handleRun: expect.any(Function),
                runResponse: undefined,
                runStatus: "NOT_RUN",
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
            useRunFederation({
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
                handleRun: expect.any(Function),
                runResponse: undefined,
                runStatus: "TESTED_IS_TRUE",
                setTestedConfig: expect.any(Function),
            });
        });
    });
    it("should return the `RUN_COMPLETE` following api call", async () => {
        const runResponse = {
            success: false,
            status: 404,
            title: "Test failed",
        };
        server.use(postFederationsTestV1({ data: runResponse }));

        const mockIntegration = { ...integrationV1, tested: true };

        const { result: formResult } = renderHook(() =>
            useForm({ defaultValues: mockIntegration })
        );
        const { result } = renderHook(() =>
            useRunFederation({
                teamId,
                integration: mockIntegration,
                control: formResult.current.control,
                reset: formResult.current.reset,
                getValues: formResult.current.getValues,
                setValue: formResult.current.setValue,
            })
        );

        result.current.handleRun();

        await waitFor(() => {
            expect(result.current).toEqual({
                handleRun: expect.any(Function),
                runResponse,
                runStatus: "RUN_COMPLETE",
                setTestedConfig: expect.any(Function),
            });
        });
    });
});
