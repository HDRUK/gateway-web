interface ErrorItem {
	reason: string;
	message: string;
	metadata: {
		prop: string;
		value: string;
	};
}

interface Error {
	code: number;
	status: string;
	message: string;
	errors: ErrorItem[];
}

export type { Error, ErrorItem };
