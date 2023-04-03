import React from "react";
import { render, screen, waitFor } from "../../testUtils";
import { userV1 } from "@/mocks/data";
import { Welcome } from "@/modules";

describe("Welcome", () => {
	it("should render the welcome message", async () => {
		const textToFind = `Welcome ${userV1.firstname} ${userV1.lastname}`;

		render(<Welcome />);

		await waitFor(() => {
			const textContent = screen.getByText(textToFind);

			expect(textContent).toBeInTheDocument();
		});
	});
});
