import React from "react";
import {
	render,
	renderHook,
	RenderHookOptions,
	RenderOptions,
} from "@testing-library/react";
import { SWRConfig } from "swr";

const Wrapper = ({ children }: { children: any }) => {
	return (
		<SWRConfig
			value={{
				provider: () => new Map(),
			}}
		>
			{children}
		</SWRConfig>
	);
};

const customRender = (
	ui: React.ReactElement<any, string | React.JSXElementConstructor<any>>,
	options?: RenderOptions<
		typeof import("@testing-library/dom/types/queries"),
		HTMLElement,
		HTMLElement
	>
): any => render(ui, { wrapper: Wrapper, ...options });

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
): any => renderHook(ui, { wrapper: Wrapper, ...options });

export * from "@testing-library/react";

export { customRenderHook as renderHook };
export { customRender as render };
