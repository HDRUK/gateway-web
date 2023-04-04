import React from "react";
import { render, screen, waitFor } from "../testUtils";
import Home from "@/pages";
import { userV1 } from "@/mocks/data";

describe("HomePage", () => {
	it("should render the homepage and text contents", async () => {
		const textToFind = `Welcome ${userV1.firstname} ${userV1.lastname}`;

		render(<Home />);

		await waitFor(() => {
			const textContent = screen.getByText(textToFind);

			expect(textContent).toBeInTheDocument();
		});
	});
});
