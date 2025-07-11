import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconTrash } from "@tabler/icons-react";

function TaskCard({ task, deleteTask, updateTask }) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(true);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl border-2 border-green-500 bg-mainBackgroundColor p-3 text-left opacity-30"
      />
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl bg-mainBackgroundColor p-2.5 text-left hover:ring-2 hover:ring-inset hover:ring-green-500"
      >
        <input
          type="checkbox"
          className="rounded-full border-2 border-green-500 w-5 h-5 accent-green-500 mr-2"
          onChange={() => deleteTask(task.id)}
          title="Mark as complete"
        />
        <textarea
          className="h-[90%] w-full resize-none rounded border-none bg-transparent text-white focus:outline-none"
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              toggleEditMode();
            }
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        />
        {task.dueDate && (
          <div className="absolute bottom-2 right-4 text-xs text-gray-400">
            Due: {new Date(task.dueDate).toLocaleString()}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className="task relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl bg-[#13131a] p-2.5 text-left hover:ring-2 hover:ring-inset hover:ring-green-500"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <input
        type="checkbox"
        className="rounded-full border-2 border-green-500 w-5 h-5 accent-green-500 mr-2"
        onChange={(e) => {
          e.stopPropagation();
          deleteTask(task.id);
        }}
        title="Mark as complete"
      />
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>
      {task.dueDate && (
        <div className="absolute bottom-2 right-4 text-xs text-gray-400">
          Due: {new Date(task.dueDate).toLocaleString()}
        </div>
      )}
      {mouseIsOver && (
        <button
          onClick={() => {
            deleteTask(task.id);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded bg-columnBackgroundColor stroke-white p-2 opacity-60 hover:opacity-100"
        >
          <IconTrash />
        </button>
      )}
    </div>
  );
}

export default TaskCard;
