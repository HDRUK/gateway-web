import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import WidgetDisplay from "./WidgetDisplay";
import useResultsByType from "./hooks/useResultsByType";
import {
  WidgetEntityData,
  DatasetItem,
  CollectionItem,
  ScriptItem,
  DataUseItem,
} from "@/interfaces/Widget";

jest.mock("./hooks/useResultsByType");

const mockHook = useResultsByType as jest.Mock;

const datasets: DatasetItem[] = [
  {
    id: 1,
    team_id: 1,
    dataset_version_id: 1,
    short_title: "Dataset 1", 
    title: 'A Really Big Dataset Title'
  },
];

const collections: CollectionItem[] = [
  {
    id: 2,
    team_id: 1,
    name: "Collection 1",
  },
];

const scripts: ScriptItem[] = [
  {
    id: 3,
    team_id: 1,
    name: "Script 1",
  },
];

const dataUses: DataUseItem[] = [
  {
    id: 4,
    name: "Data Use 1",
  },
];

const mockData: WidgetEntityData = {
  datasets,
  collections,
  scripts,
  data_uses: dataUses,
  widget: {
    widget_name: "Test Widget",
    size_width: 800,
    size_height: 600,
    unit: "px",
    include_search_bar: 1,
    include_cohort_link: 1,
    keep_proportions: 0,
    branding_primary: undefined,
    branding_secondary: undefined,
    branding_neutral: undefined,
  },
};

describe("WidgetDisplay", () => {
  beforeEach(() => {
    mockHook.mockReturnValue({
      datasets,
      collections,
      scripts,
      data_uses: dataUses,
    });
  });

  it("renders dataset by default", () => {
    render(<WidgetDisplay data={mockData} />);

    expect(screen.getByText("Dataset 1")).toBeInTheDocument();
  });

  it("switches to collections", () => {
    render(<WidgetDisplay data={mockData} />);

    fireEvent.mouseDown(
        screen.getByRole("button", {
        name: /open to show search type options/i,
        })
    );

    fireEvent.click(screen.getByText(/collections/i));

    expect(screen.getByText("Collection 1")).toBeInTheDocument();
    });

  it("defaults to the first non-empty category when datasets are empty", () => {
    const noDatasets: WidgetEntityData = {
      ...mockData,
      datasets: [],
    };

    mockHook.mockReturnValue({
      datasets: [],
      collections,
      scripts,
      data_uses: dataUses,
    });

    render(<WidgetDisplay data={noDatasets} />);

    expect(
      screen.getByRole("button", {
        name: /open to show search type options/i,
      })
    ).toHaveTextContent("Data Uses / Research Projects");
    expect(
      screen.queryByText("Datasets & Biosamples")
    ).not.toBeInTheDocument();
    expect(screen.getByText("Data Use 1")).toBeInTheDocument();
  });

  it("shows a no-data message and no nav when all categories are empty", () => {
    const empty: WidgetEntityData = {
      ...mockData,
      datasets: [],
      collections: [],
      scripts: [],
      data_uses: [],
    };

    mockHook.mockReturnValue({
      datasets: [],
      collections: [],
      scripts: [],
      data_uses: [],
    });

    render(<WidgetDisplay data={empty} />);

    expect(
      screen.getByText(/No data was selected for this widget/i)
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: /open to show search type options/i,
      })
    ).not.toBeInTheDocument();
  });

  it("updates search input", () => {
    render(<WidgetDisplay data={mockData} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });

    expect(input).toHaveValue("test");
  });

  it("shows footer when enabled", () => {
    render(<WidgetDisplay data={mockData} />);

    expect(screen.getByText(/Want to dig deeper/i)).toBeInTheDocument();
  });

  it("hides footer when disabled", () => {
    const noFooter = {
      ...mockData,
      widget: { ...mockData.widget, include_cohort_link: 0 },
    };

    render(<WidgetDisplay data={noFooter} />);

    expect(
      screen.queryByText(/Want to dig deeper/i)
    ).not.toBeInTheDocument();
  });

  /**
   * WIDGET EMBED CONTRACT
   *
   * The hosted /widgets/[slug] page passes the API payload straight into
   * WidgetDisplay, so the component must keep rendering from this exact data
   * shape. If this fails, deployed widgets embedded in third-party sites
   * would break.
   */
  it("renders end-to-end from the widget data payload shape", () => {
    mockHook.mockImplementation(
      jest.requireActual("./hooks/useResultsByType").default
    );

    render(<WidgetDisplay data={mockData} isIframe />);

    expect(screen.getByTestId("widget-display")).toBeInTheDocument();
    expect(screen.getByText("Dataset 1")).toBeInTheDocument();
  });
});