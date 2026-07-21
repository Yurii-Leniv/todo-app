import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import TaskItem from "../TaskItem";
import { Task } from "@/lib/api";

const task: Task = {
  id: 1,
  title: "Buy milk",
  done: false,
  priority: 8,
  due_date: null,
  category: null,
  position: 0,
};

type Overrides = Partial<React.ComponentProps<typeof TaskItem>>;

function renderItem(overrides: Overrides = {}) {
  const props = {
    task,
    pending: false,
    removing: false,
    draggable: false,
    onToggleDone: jest.fn(),
    onDelete: jest.fn(),
    ...overrides,
  };
  // useSortable needs a DndContext/SortableContext around it.
  return render(
    <DndContext>
      <SortableContext items={[props.task.id]}>
        <ul>
          <TaskItem {...props} />
        </ul>
      </SortableContext>
    </DndContext>,
  );
}

describe("TaskItem", () => {
  test("renders the task title and a priority badge", () => {
    renderItem();

    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.getByText("P8")).toBeInTheDocument();
  });

  test("shows the title with a strikethrough when done", () => {
    renderItem({ task: { ...task, done: true } });

    expect(screen.getByText("Buy milk")).toHaveClass("line-through");
  });

  test("shows the due date and category when present", () => {
    renderItem({
      task: { ...task, due_date: "2030-01-15", category: "Finance" },
    });

    expect(screen.getByText(/Jan 15/)).toBeInTheDocument();
    expect(screen.getByText("Finance")).toBeInTheDocument();
  });

  test("calls onToggleDone with the task when the checkbox is clicked", async () => {
    const user = userEvent.setup();
    const onToggleDone = jest.fn();
    renderItem({ onToggleDone });

    await user.click(screen.getByRole("checkbox"));

    expect(onToggleDone).toHaveBeenCalledWith(task);
  });

  test("calls onDelete with the task when Delete is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();
    renderItem({ onDelete });

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(onDelete).toHaveBeenCalledWith(task);
  });

  test("disables the checkbox while an update is pending", () => {
    renderItem({ pending: true });

    expect(screen.getByRole("checkbox")).toBeDisabled();
    expect(screen.getByText("saving...")).toBeInTheDocument();
  });

  test("disables the Delete button while it is being removed", () => {
    renderItem({ removing: true });

    expect(screen.getByRole("button", { name: "Delete" })).toBeDisabled();
  });

  test("shows a drag handle only when draggable", () => {
    const { rerender } = renderItem({ draggable: false });
    expect(screen.queryByLabelText("Drag to reorder")).not.toBeInTheDocument();

    rerender(
      <DndContext>
        <SortableContext items={[task.id]}>
          <ul>
            <TaskItem
              task={task}
              pending={false}
              removing={false}
              draggable={true}
              onToggleDone={jest.fn()}
              onDelete={jest.fn()}
            />
          </ul>
        </SortableContext>
      </DndContext>,
    );
    expect(screen.getByLabelText("Drag to reorder")).toBeInTheDocument();
  });
});
