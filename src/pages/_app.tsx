import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<SWRConfig
			value={{
				onError: (error, key) => {
					// Here can log the error and show a notification UI
					console.log({ error, key });
				},
			}}
		>
			<Component {...pageProps} />
		</SWRConfig>
	);
}
