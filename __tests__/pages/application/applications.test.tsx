import React from "react";
import Application from "@/pages/account/application";
import { render, screen, waitFor } from "../../testUtils";


jest.mock('next/router', () => ({
    useRouter() {
      return ({
        route: '/',
        pathname: '',
        query: '',
        asPath: '',
      });
    },
  }));

describe("Applications", () => {
    it("should render contents", async () => {
        render(
            <Application />
        );
        await waitFor(() => {
            expect(screen.getByText("Application Management")).toBeInTheDocument();
            expect(screen.queryByText("Placeholder for Auth Tab")).not.toBeInTheDocument();
            expect(screen.queryByText("Placeholder for Scopes/Permissions Tab")).not.toBeInTheDocument();
        });
    });
});