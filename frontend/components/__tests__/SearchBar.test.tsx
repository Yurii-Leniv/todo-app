import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../SearchBar";

describe("SearchBar", () => {
  test("does not call onSearch immediately while typing", async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByPlaceholderText("Search tasks..."), "milk");

    // The debounce timer (300ms) hasn't fired yet, so no call should have
    // gone out — this is the whole point of debouncing the search input.
    expect(onSearch).not.toHaveBeenCalled();
  });

  test("calls onSearch with the final value after the debounce delay", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByPlaceholderText("Search tasks..."), "milk");
    jest.advanceTimersByTime(300);

    expect(onSearch).toHaveBeenCalledWith("milk");
    expect(onSearch).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });
});
