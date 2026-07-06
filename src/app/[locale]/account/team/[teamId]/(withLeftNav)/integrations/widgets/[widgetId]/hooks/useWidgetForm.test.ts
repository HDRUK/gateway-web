import { act, waitFor } from "@testing-library/react";
import { Widget } from "@/interfaces/Widget";
import { renderHook } from "@/utils/testUtils";
import { BRANDING_DEFAULTS } from "../const";
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

    it("applies a preset that shares a dimension without overriding it", async () => {
        const { result } = setup();
        enableLock(result.current.form);

        // Width edit re-bases height to keep the ratio: 740 * 400 / 600 = 493.
        act(() => result.current.form.setValue("size_width", 400));
        await waitFor(() =>
            expect(result.current.form.getValues("size_height")).toBe(493)
        );

        // Preset shares the width (400) — must still apply 400 x 592 exactly.
        act(() => result.current.applyPreset(400, 592));
        await waitFor(() => {
            expect(result.current.form.getValues("size_width")).toBe(400);
            expect(result.current.form.getValues("size_height")).toBe(592);
        });

        // Subsequent single-axis edit follows the preset's new ratio.
        act(() => result.current.form.setValue("size_width", 800));
        await waitFor(() =>
            expect(result.current.form.getValues("size_height")).toBe(1184)
        );
    });

    it("does not let intermediate keystrokes corrupt the locked ratio", async () => {
        const { result } = setup();
        act(() => result.current.applyPreset(600, 740));
        enableLock(result.current.form);

        // Typing "1000" passes through 1; height collapses with it...
        act(() => result.current.form.setValue("size_width", 1));
        await waitFor(() =>
            expect(result.current.form.getValues("size_height")).toBe(1)
        );

        // ...but the locked 600:740 ratio still applies to the final value.
        act(() => result.current.form.setValue("size_width", 1000));
        // 740 * 1000 / 600 = 1233.33 -> 1233 (not 1000)
        await waitFor(() =>
            expect(result.current.form.getValues("size_height")).toBe(1233)
        );
    });
});

describe("useWidgetForm — branding defaults", () => {
    it("defaults the branding colours for a new widget", () => {
        const { result } = renderHook(() =>
            useWidgetForm("1", [], undefined, null)
        );
        expect(result.current.form.getValues("branding_primary")).toBe(
            BRANDING_DEFAULTS.branding_primary
        );
        expect(result.current.form.getValues("branding_secondary")).toBe(
            BRANDING_DEFAULTS.branding_secondary
        );
        expect(result.current.form.getValues("branding_neutral")).toBe(
            BRANDING_DEFAULTS.branding_neutral
        );
    });

    it("falls back to default colours when a saved widget has none", () => {
        const widget = {
            id: 1,
            widget_name: "Test",
            branding_primary: null,
            branding_secondary: undefined,
            branding_neutral: "",
        } as unknown as Widget;
        const { result } = renderHook(() =>
            useWidgetForm("1", [], widget, null)
        );
        expect(result.current.form.getValues("branding_primary")).toBe(
            BRANDING_DEFAULTS.branding_primary
        );
        expect(result.current.form.getValues("branding_secondary")).toBe(
            BRANDING_DEFAULTS.branding_secondary
        );
        expect(result.current.form.getValues("branding_neutral")).toBe(
            BRANDING_DEFAULTS.branding_neutral
        );
    });

    it("keeps a saved widget's own branding colours", () => {
        const widget = {
            id: 1,
            widget_name: "Test",
            branding_primary: "#111111",
            branding_secondary: "#222222",
            branding_neutral: "#333333",
        } as unknown as Widget;
        const { result } = renderHook(() =>
            useWidgetForm("1", [], widget, null)
        );
        expect(result.current.form.getValues("branding_primary")).toBe(
            "#111111"
        );
        expect(result.current.form.getValues("branding_secondary")).toBe(
            "#222222"
        );
        expect(result.current.form.getValues("branding_neutral")).toBe(
            "#333333"
        );
    });
});
