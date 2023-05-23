import React, { ReactNode } from "react";
import {
    render,
    renderHook,
    RenderHookOptions,
    RenderOptions,
    RenderResult,
    RenderHookResult,
} from "@testing-library/react";
import { SWRConfig } from "swr";
import DialogProvider from "@/providers/Dialog";

const Wrapper = ({ children }: { children: ReactNode }) => {
    return (
        <SWRConfig
            value={{
                provider: () => new Map(),
            }}>
            <DialogProvider>{children}</DialogProvider>
        </SWRConfig>
    );
};

const customRender = (
    ui: React.ReactElement<
        unknown,
        string | React.JSXElementConstructor<unknown>
    >,
    options?: RenderOptions<
        typeof import("@testing-library/dom/types/queries"),
        HTMLElement,
        HTMLElement
    >
): RenderResult => render(ui, { wrapper: Wrapper, ...options });

const customRenderHook = (
    ui: (initialProps: unknown) => unknown,
    options?:
        | RenderHookOptions<
              unknown,
              typeof import("@testing-library/dom/types/queries"),
              HTMLElement,
              HTMLElement
          >
        | undefined
): RenderHookResult<unknown, unknown> =>
    renderHook(ui, { wrapper: Wrapper, ...options });

export * from "@testing-library/react";

export { customRenderHook as renderHook };
export { customRender as render };
