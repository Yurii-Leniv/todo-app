import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SortButtons from "../SortButtons";

describe("SortButtons", () => {
  test("calls onChange with 'asc' when Ascending is clicked", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<SortButtons value={null} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Ascending" }));

    expect(onChange).toHaveBeenCalledWith("asc");
  });

  test("clicking the already-active option clears the sort", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<SortButtons value="asc" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Ascending" }));

    expect(onChange).toHaveBeenCalledWith(null);
  });

  test("switching from Ascending to Descending passes 'desc'", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<SortButtons value="asc" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Descending" }));

    expect(onChange).toHaveBeenCalledWith("desc");
  });
});
