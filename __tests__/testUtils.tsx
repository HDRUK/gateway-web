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
import { CacheProvider, ThemeProvider } from "@emotion/react";
import DialogProvider from "../src/providers/Dialog";
import theme from "../src/config/theme";
import createEmotionCache from "../src/config/createEmotionCache";

const clientSideEmotionCache = createEmotionCache();

const Wrapper = ({ children }: { children: ReactNode }) => {
    return (
        <SWRConfig
            value={{
                provider: () => new Map(),
            }}>
            <CacheProvider value={clientSideEmotionCache}>
                <ThemeProvider theme={theme}>
                    <DialogProvider>{children}</DialogProvider>
                </ThemeProvider>
            </CacheProvider>
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
