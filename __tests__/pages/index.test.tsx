import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "@pages/index";

describe("HomePage", () => {
    it("should render the homepage and text contetnts", () => {
      const textToFind = "Gateway Mk 2"
  
      render(<Home />);
      const textContent = screen.getByText(textToFind);
  
      expect(textContent).toBeInTheDocument();
    });
  });