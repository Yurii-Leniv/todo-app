import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterButtons from "../FilterButtons";

describe("FilterButtons", () => {
  test("renders all three filter options", () => {
    render(<FilterButtons value="all" onChange={jest.fn()} />);

    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Done" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Undone" })).toBeInTheDocument();
  });

  test("calls onChange with 'done' when Done is clicked", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<FilterButtons value="all" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Done" }));

    expect(onChange).toHaveBeenCalledWith("done");
  });

  test("highlights the currently active option", () => {
    render(<FilterButtons value="undone" onChange={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Undone" })).toHaveClass(
      "bg-indigo-600",
    );
    expect(screen.getByRole("button", { name: "All" })).not.toHaveClass(
      "bg-indigo-600",
    );
  });
});
