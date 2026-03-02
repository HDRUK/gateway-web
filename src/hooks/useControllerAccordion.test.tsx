import { renderHook, act } from "@testing-library/react";
import { useControlledAccordion } from "./useControllerAccordion";

describe("useControlledAccordion", () => {
    it("initialises as expanded when true is passed", () => {
        const { result } = renderHook(() => useControlledAccordion(true));
        expect(result.current.expanded).toBe(true);
    });

    it("initialises as collapsed when false is passed", () => {
        const { result } = renderHook(() => useControlledAccordion(false));
        expect(result.current.expanded).toBe(false);
    });

    it("toggles expanded state when onChange is called", () => {
        const { result } = renderHook(() => useControlledAccordion(false));

        act(() => {
            result.current.onChange({} as React.SyntheticEvent, true);
        });

        expect(result.current.expanded).toBe(true);
    });

    it("does not change initial state when re-rendered with different value", () => {
        const { result, rerender } = renderHook(
            ({ initial }) => useControlledAccordion(initial),
            { initialProps: { initial: true } }
        );

        rerender({ initial: false });

        expect(result.current.expanded).toBe(true);
    });
});