import React, { ReactNode } from "react";
import { CacheProvider, ThemeProvider } from "@emotion/react";
import {
    render,
    renderHook,
    RenderHookOptions,
    RenderOptions,
    RenderResult,
    RenderHookResult,
} from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { SWRConfig } from "swr";
import createEmotionCache from "@/config/createEmotionCache";
import messages from "@/config/messages/en.json";
import theme from "@/config/theme";
import ActionBarProvider from "@/providers/ActionBarProvider";
import DialogProvider from "@/providers/DialogProvider";

const clientSideEmotionCache = createEmotionCache();

const Wrapper = ({ children }: { children: ReactNode }) => {
    return (
        <NextIntlClientProvider locale="en" messages={messages}>
            <SWRConfig
                value={{
                    provider: () => new Map(),
                }}>
                <CacheProvider value={clientSideEmotionCache}>
                    <ThemeProvider theme={theme}>
                        <ActionBarProvider>
                            <DialogProvider>{children}</DialogProvider>
                        </ActionBarProvider>
                    </ThemeProvider>
                </CacheProvider>
            </SWRConfig>
        </NextIntlClientProvider>
    );
};

interface OptionProps
    extends RenderOptions<
        typeof import("@testing-library/dom/types/queries"),
        HTMLElement,
        HTMLElement
    > {
    wrapperProps: Record<string, unknown>;
}

const customRender = (
    ui: React.ReactElement<
        unknown,
        string | React.JSXElementConstructor<unknown>
    >,
    options?: OptionProps
): RenderResult => {
    const { wrapperProps, ...rest } = options || {};

    return render(ui, {
        wrapper: props => <Wrapper {...props} {...wrapperProps} />,
        ...rest,
    });
};

interface OptionHookProps
    extends RenderHookOptions<
        unknown,
        typeof import("@testing-library/dom/types/queries"),
        HTMLElement,
        HTMLElement
    > {
    wrapperProps: Record<string, unknown>;
}

const customRenderHook = <T,>(
    ui: (initialProps: unknown) => T,
    options?: OptionHookProps
): RenderHookResult<T, unknown> => {
    const { wrapperProps, ...rest } = options || {};
    return renderHook(ui, {
        wrapper: props => <Wrapper {...props} {...wrapperProps} />,
        ...rest,
    });
};

export * from "@testing-library/react";

export { customRenderHook as renderHook };
export { customRender as render };
