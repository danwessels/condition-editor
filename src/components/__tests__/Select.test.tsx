import { render, screen } from "@testing-library/react";
import Select from "../Select";

describe("Select Component", () => {
  const mockOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  describe("Single Select", () => {
    it("renders with placeholder text", () => {
      const mockOnChange = jest.fn();
      render(
        <Select
          options={mockOptions}
          placeholder="Select an option"
          onChange={mockOnChange}
          value={null}
        />,
      );

      expect(screen.getByText("Select an option")).toBeInTheDocument();
    });

    it("displays selected value", () => {
      const mockOnChange = jest.fn();
      const selectedValue = { value: "option1", label: "Option 1" };

      render(
        <Select
          options={mockOptions}
          onChange={mockOnChange}
          value={selectedValue}
        />,
      );

      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    it("renders combobox input for interaction", () => {
      const mockOnChange = jest.fn();
      render(
        <Select
          options={mockOptions}
          placeholder="Select an option"
          onChange={mockOnChange}
          value={null}
        />,
      );

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });

  describe("Multi Select", () => {
    it("renders with multi-select placeholder", () => {
      const mockOnChange = jest.fn();

      render(
        <Select
          options={mockOptions}
          placeholder="Select options"
          onChange={mockOnChange}
          value={[]}
          isMulti={true}
        />,
      );

      expect(screen.getByText("Select options")).toBeInTheDocument();
    });

    it("displays multiple selected values", () => {
      const mockOnChange = jest.fn();
      const selectedValues = [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
      ];

      render(
        <Select
          options={mockOptions}
          onChange={mockOnChange}
          value={selectedValues}
          isMulti={true}
        />,
      );

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });
  });

  describe("Creatable Select", () => {
    it("renders creatable select with input", () => {
      const mockOnChange = jest.fn();

      render(
        <Select
          options={mockOptions}
          placeholder="Select or create"
          onChange={mockOnChange}
          value={null}
          isCreatable={true}
        />,
      );

      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(screen.getByText("Select or create")).toBeInTheDocument();
    });

    it("handles creatable multi-select", () => {
      const mockOnChange = jest.fn();
      const selectedValues = [{ value: "custom", label: "Custom Value" }];

      render(
        <Select
          options={mockOptions}
          placeholder="Select or create"
          onChange={mockOnChange}
          value={selectedValues}
          isMulti={true}
          isCreatable={true}
        />,
      );

      expect(screen.getByText("Custom Value")).toBeInTheDocument();
    });
  });
});
