import Auth from "@/components/Auth";
import Layout from "@/components/Layout";
import Head from "next/head";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { appWithTranslation } from "next-i18next";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/config/Theme";
import createEmotionCache from "@/config/createEmotionCache";
import { CacheProvider, EmotionCache } from "@emotion/react";

const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

const App = ({
    Component,
    pageProps,
    emotionCache = clientSideEmotionCache,
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
                <Head>
                    <meta
                        name="viewport"
                        content="initial-scale=1, width=device-width"
                    />
                </Head>
                <ThemeProvider theme={theme}>
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
