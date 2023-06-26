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
import AuthProvider from "@/providers/Auth";
import { userV1 } from "@/mocks/data";
import { User } from "@/interfaces/User";
import ActionBarProvider from "@/providers/ActionBar";
import DialogProvider from "../src/providers/Dialog";
import theme from "../src/config/theme";
import createEmotionCache from "../src/config/createEmotionCache";

const clientSideEmotionCache = createEmotionCache();

const Wrapper = ({ children, user }: { user?: User; children: ReactNode }) => {
    return (
        <SWRConfig
            value={{
                provider: () => new Map(),
            }}>
            <CacheProvider value={clientSideEmotionCache}>
                <ThemeProvider theme={theme}>
                    <AuthProvider user={user}>
                        <ActionBarProvider>
                            <DialogProvider>{children}</DialogProvider>
                        </ActionBarProvider>
                    </AuthProvider>
                </ThemeProvider>
            </CacheProvider>
        </SWRConfig>
    );
};

Wrapper.defaultProps = {
    user: userV1,
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

const customRenderHook = (
    ui: (initialProps: unknown) => unknown,
    options?: OptionHookProps
): RenderHookResult<unknown, unknown> => {
    const { wrapperProps, ...rest } = options || {};
    return renderHook(ui, {
        wrapper: props => <Wrapper {...props} {...wrapperProps} />,
        ...rest,
    });
};

export * from "@testing-library/react";

export { customRenderHook as renderHook };
export { customRender as render };
