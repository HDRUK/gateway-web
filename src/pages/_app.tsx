import * as React from "react";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "@/config/createEmotionCache";
import { SWRConfig } from "swr";
import { SnackbarProvider } from "notistack";
import { ErrorBoundary } from "react-error-boundary";
import theme from "@/config/theme";
import PageLayout from "@/components/PageLayout";
import "@/styles/global.css";
import { ApiError } from "@/components/CustomNotifications/ApiError";
import { ApiSuccess } from "@/components/CustomNotifications/ApiSuccess";
import { ApiWarning } from "@/components/CustomNotifications/ApiWarning";
import { ApiInfo } from "@/components/CustomNotifications/ApiInfo";
import DialogProvider from "@/providers/DialogProvider";
import ActionBarProvider from "@/providers/ActionBarProvider";
import NavigationEvents from "@/components/NavigationEvents";
import { NextIntlClientProvider } from "next-intl";
import { withRouter } from "next/router";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface Props extends AppProps {
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
    router,
}: Props) => {
    return (
        <NextIntlClientProvider
            locale={(router.query?.locale as string) ?? "en"}
            timeZone="Europe/London"
            messages={pageProps.messages}>
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
                        <DialogProvider>
                            <ActionBarProvider>
                                <PageLayout>
                                    <ErrorBoundary
                                        fallback={
                                            <div>Something went wrong</div>
                                        }
                                        onError={logError}>
                                        <SnackbarProvider
                                            Components={{
                                                apiError: ApiError,
                                                apiSuccess: ApiSuccess,
                                                apiWarning: ApiWarning,
                                                apiInfo: ApiInfo,
                                            }}
                                        />
                                        <Component {...pageProps} />
                                    </ErrorBoundary>
                                    <NavigationEvents />
                                </PageLayout>
                            </ActionBarProvider>
                        </DialogProvider>
                    </ThemeProvider>
                </CacheProvider>
            </SWRConfig>
        </NextIntlClientProvider>
    );
};
export default withRouter(App);
