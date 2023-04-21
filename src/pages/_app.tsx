import Auth from "@/components/Auth";
import Layout from "@/components/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { appWithTranslation } from "next-i18next";

const App = ({ Component, pageProps }: AppProps) => {
    const { isProtected } = pageProps;
    return (
        <SWRConfig
            value={{
                onError: (error, key) => {
                    // Here we can log the error and show a notification UI
                    console.log({ error, key });
                },
            }}>
            <Layout>
                <Auth isProtected={isProtected}>
                    <Component {...pageProps} />
                </Auth>
            </Layout>
        </SWRConfig>
    );
};

export default appWithTranslation(App);
