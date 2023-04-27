import * as React from "react";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "@/config/theme";
import createEmotionCache from "@/config/createEmotionCache";
import Auth from "@/components/Auth";
import Layout from "@/components/Layout";
import { SWRConfig } from "swr";
import { appWithTranslation } from "next-i18next";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

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
                        <Auth isProtected={isProtected}>
                            <Component {...pageProps} />
                        </Auth>
                    </Layout>
                </ThemeProvider>
            </CacheProvider>
        </SWRConfig>
    );
};
export default appWithTranslation(App);
