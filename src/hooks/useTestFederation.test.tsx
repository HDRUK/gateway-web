import { useForm } from "react-hook-form";
import { FederationTestStatus } from "@/interfaces/Federation";
import useTestFederation from "@/hooks/useTestFederation";
import { act, renderHook, waitFor } from "@/utils/testUtils";
import { integrationV1 } from "@/mocks/data/integration";
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
});
