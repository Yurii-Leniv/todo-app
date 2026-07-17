import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskForm from "../TaskForm";

describe("TaskForm", () => {
  test("submits the entered title and priority", async () => {
    const user = userEvent.setup();
    const onCreate = jest.fn().mockResolvedValue(undefined);
    render(<TaskForm onCreate={onCreate} />);

    await user.type(screen.getByPlaceholderText("New task..."), "Buy milk");
    await user.clear(screen.getByTitle("Priority (1-10)"));
    await user.type(screen.getByTitle("Priority (1-10)"), "8");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(onCreate).toHaveBeenCalledWith("Buy milk", 8);
  });

  test("clears the form after a successful submit", async () => {
    const user = userEvent.setup();
    const onCreate = jest.fn().mockResolvedValue(undefined);
    render(<TaskForm onCreate={onCreate} />);

    const titleInput = screen.getByPlaceholderText(
      "New task...",
    ) as HTMLInputElement;
    await user.type(titleInput, "Buy milk");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(titleInput.value).toBe("");
  });

  test("does not submit when the title is empty", async () => {
    const user = userEvent.setup();
    const onCreate = jest.fn();
    render(<TaskForm onCreate={onCreate} />);

    // The title input is `required`, so clicking Add with it empty must not
    // call onCreate — the browser's own HTML5 validation blocks the submit.
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(onCreate).not.toHaveBeenCalled();
  });

  test('shows "Adding..." while the submit is in flight', async () => {
    const user = userEvent.setup();
    let resolveCreate!: () => void;
    const onCreate = jest.fn(
      () => new Promise<void>((resolve) => (resolveCreate = resolve)),
    );
    render(<TaskForm onCreate={onCreate} />);

    await user.type(screen.getByPlaceholderText("New task..."), "Buy milk");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.getByRole("button", { name: "Adding..." })).toBeDisabled();

    resolveCreate();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Add" })).toBeEnabled(),
    );
  });
});
