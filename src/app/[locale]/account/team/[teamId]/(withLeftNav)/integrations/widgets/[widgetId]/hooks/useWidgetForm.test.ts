import { act, waitFor } from "@testing-library/react";
import { renderHook } from "@/utils/testUtils";
import useWidgetForm from "./useWidgetForm";

describe("useWidgetForm — keep proportions", () => {
    const setup = () => renderHook(() => useWidgetForm("1", [], undefined, null));

    const enableLock = (form: ReturnType<typeof setup>["result"]["current"]["form"]) =>
        act(() => form.setValue("keep_proportions", true));

    it("defaults to 600 x 740 with keep_proportions off", () => {
        const { result } = setup();
        const { form } = result.current;
        expect(form.getValues("size_width")).toBe(600);
        expect(form.getValues("size_height")).toBe(740);
        expect(form.getValues("keep_proportions")).toBe(false);
    });

    it("does not link the dimensions when the lock is off", () => {
        const { result } = setup();
        act(() => result.current.form.setValue("size_width", 300));
        expect(result.current.form.getValues("size_height")).toBe(740);
    });

    it("updates height in proportion when width changes and the lock is on", async () => {
        const { result } = setup();
        enableLock(result.current.form);
        act(() => result.current.form.setValue("size_width", 300));
        // 740 * 300 / 600 = 370
        await waitFor(() =>
            expect(result.current.form.getValues("size_height")).toBe(370)
        );
    });

    it("updates width in proportion when height changes and the lock is on", async () => {
        const { result } = setup();
        enableLock(result.current.form);
        act(() => result.current.form.setValue("size_height", 370));
        // 600 * 370 / 740 = 300
        await waitFor(() =>
            expect(result.current.form.getValues("size_width")).toBe(300)
        );
    });

    it("rounds the derived dimension to a whole number", async () => {
        const { result } = setup();
        enableLock(result.current.form);
        act(() => result.current.form.setValue("size_width", 500));
        // 740 * 500 / 600 = 616.67 -> 617
        await waitFor(() =>
            expect(result.current.form.getValues("size_height")).toBe(617)
        );
    });

    it("re-bases the ratio when both dimensions change at once (size preset)", async () => {
        const { result } = setup();
        enableLock(result.current.form);

        // Both set together (as a preset button does) must not be overridden.
        act(() => {
            result.current.form.setValue("size_width", 400);
            result.current.form.setValue("size_height", 200);
        });
        await waitFor(() => {
            expect(result.current.form.getValues("size_width")).toBe(400);
            expect(result.current.form.getValues("size_height")).toBe(200);
        });

        // A later single-axis edit now follows the new 2:1 ratio.
        act(() => result.current.form.setValue("size_width", 500));
        await waitFor(() =>
            expect(result.current.form.getValues("size_height")).toBe(250)
        );
    });
});
