import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../SearchBar";

describe("SearchBar", () => {
  test("does not call onSearch immediately while typing", async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByPlaceholderText("Search tasks..."), "milk");

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
