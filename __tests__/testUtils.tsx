import React, { ReactNode } from "react";
import {
    render,
    renderHook,
    RenderHookOptions,
    RenderOptions,
} from "@testing-library/react";
import { SWRConfig } from "swr";

const Wrapper = ({ children }: { children: ReactNode }) => {
    return (
        <SWRConfig
            value={{
                provider: () => new Map(),
            }}>
            {children}
        </SWRConfig>
    );
};

const WrapperWithTrans = Wrapper;

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
): unknown => render(ui, { wrapper: WrapperWithTrans, ...options });

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
): unknown => renderHook(ui, { wrapper: WrapperWithTrans, ...options });

export * from "@testing-library/react";

export { customRenderHook as renderHook };
export { customRender as render };
