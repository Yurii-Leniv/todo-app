import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskItem from "../TaskItem";
import { Task } from "@/lib/api";

const task: Task = { id: 1, title: "Buy milk", done: false, priority: 8 };

describe("TaskItem", () => {
  test("renders the task title and a priority badge", () => {
    render(
      <TaskItem
        task={task}
        pending={false}
        removing={false}
        onToggleDone={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.getByText("P8")).toBeInTheDocument();
  });

  test("shows the title with a strikethrough when done", () => {
    render(
      <TaskItem
        task={{ ...task, done: true }}
        pending={false}
        removing={false}
        onToggleDone={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    expect(screen.getByText("Buy milk")).toHaveClass("line-through");
  });

  test("calls onToggleDone with the task when the checkbox is clicked", async () => {
    const user = userEvent.setup();
    const onToggleDone = jest.fn();
    render(
      <TaskItem
        task={task}
        pending={false}
        removing={false}
        onToggleDone={onToggleDone}
        onDelete={jest.fn()}
      />,
    );

    await user.click(screen.getByRole("checkbox"));

    expect(onToggleDone).toHaveBeenCalledWith(task);
  });

  test("calls onDelete with the task when Delete is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();
    render(
      <TaskItem
        task={task}
        pending={false}
        removing={false}
        onToggleDone={jest.fn()}
        onDelete={onDelete}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(onDelete).toHaveBeenCalledWith(task);
  });

  test("disables the checkbox while an update is pending", () => {
    render(
      <TaskItem
        task={task}
        pending={true}
        removing={false}
        onToggleDone={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    expect(screen.getByRole("checkbox")).toBeDisabled();
    expect(screen.getByText("saving...")).toBeInTheDocument();
  });

  test("disables the Delete button while it is being removed", () => {
    render(
      <TaskItem
        task={task}
        pending={false}
        removing={true}
        onToggleDone={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Delete" })).toBeDisabled();
  });
});
