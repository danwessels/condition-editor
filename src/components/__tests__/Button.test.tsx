import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "../Button";

describe("Button Component", () => {
  it("renders with correct label", () => {
    render(<Button label="Test Button" onClick={() => {}} />);

    expect(
      screen.getByRole("button", { name: "Test Button" }),
    ).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const mockOnClick = jest.fn();

    render(<Button label="Click Me" onClick={mockOnClick} />);

    await user.click(screen.getByRole("button", { name: "Click Me" }));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("renders as disabled when disabled prop is true", () => {
    render(
      <Button label="Disabled Button" onClick={() => {}} disabled={true} />,
    );

    const button = screen.getByRole("button", { name: "Disabled Button" });
    expect(button).toBeDisabled();
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const mockOnClick = jest.fn();

    render(
      <Button label="Disabled Button" onClick={mockOnClick} disabled={true} />,
    );

    await user.click(screen.getByRole("button", { name: "Disabled Button" }));

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("has proper accessibility attributes", () => {
    render(<Button label="Accessible Button" onClick={() => {}} />);

    const button = screen.getByRole("button", { name: "Accessible Button" });
    expect(button).toHaveAttribute("type", "button");
  });
});
