import * as React from "react";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "@/config/createEmotionCache";
import { SWRConfig } from "swr";
import { appWithTranslation } from "next-i18next";
import { SnackbarProvider } from "notistack";
import { ErrorBoundary } from "react-error-boundary";
import theme from "@/config/theme";
import Auth from "@/components/Auth";
import Layout from "@/components/Layout";
import "@/styles/global.css";
import { ApiError } from "@/components/CustomNotifications";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
    emotionCache: EmotionCache;
}

const logError = (error: Error, info: { componentStack: string }) => {
    // todo: log to an external API?
    console.log({ error, info });
};

const App = ({
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
}: MyAppProps) => {
    const { isProtected } = pageProps;
    return (
        <SWRConfig
            value={{
                onError: (error, key) => {
                    // Here we can log the error and show a notification UI
                    console.log({ error, key });
                },
            }}>
            <CacheProvider value={emotionCache}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Layout>
                        <ErrorBoundary
                            fallback={<div>Something went wrong</div>}
                            onError={logError}>
                            <SnackbarProvider
                                Components={{
                                    apiError: ApiError,
                                }}
                            />
                            <Auth isProtected={isProtected}>
                                <Component {...pageProps} />
                            </Auth>
                        </ErrorBoundary>
                    </Layout>
                </ThemeProvider>
            </CacheProvider>
        </SWRConfig>
    );
};
export default appWithTranslation(App);
