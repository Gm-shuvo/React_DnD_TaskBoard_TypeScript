import PlusIcon from "../icons/PlusIcon";
import { useEffect, useMemo, useState } from "react";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { useTheme } from "../contexts/ThemeContext";
import TaskCard from "./TaskCard";
import AddTaskModal from "./AddTaskModal";
import toast from "react-hot-toast";

function KanbanBoard() {
  const { theme } = useTheme();
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addColumnId, setAddColumnId] = useState<Id | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  useEffect(() => {
    // Fetch columns and tasks from the JSON server
    fetchData();
  }, []);

  // useEffect(() => {
  //   localStorage.setItem("columns", JSON.stringify(columns));
  //   localStorage.setItem("tasks", JSON.stringify(tasks));
  // }, [columns, tasks]);

  // const fetchData = async () => {
  //   try {
  //     await fetch("http://localhost:3010/columns")
  //       .then((response) => response.json())
  //       .then((data: Column[]) => setColumns(data));

  //     await fetch("http://localhost:3010/tasks")
  //       .then((response) => response.json())
  //       .then((data: Task[]) => setTasks(data));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  async function fetchData() {
    try {
      const columnsResponse = await fetch("http://localhost:3010/columns");
      const columnsData = await columnsResponse.json();

      const tasksResponse = await fetch("http://localhost:3010/tasks");
      const tasksData = await tasksResponse.json();

      console.log("COLUMNS", columnsData);
      console.log("TASKS", tasksData);

      const storedColumns = localStorage.getItem("columns");
      const storedTasks = localStorage.getItem("tasks");

      if (storedColumns?.length) {
        setColumns(JSON.parse(storedColumns));
      } else {
        setColumns(columnsData);
      }

      if (storedTasks?.length) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks(tasksData);
      }
    } catch (error) {
      console.error(error);
    }
  }

  console.log("COLUMNS", columns);
  console.log("TASKS", tasks);

  //get the columns id
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  return (
    <div
      className="
        m-auto
        flex
        min-h-screen
        w-full
        items-center
        overflow-x-auto
        overflow-y-hidden
        px-[40px]
    "
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="mx-auto flex justify-center items-center gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                  setIsModalOpen={setIsModalOpen}
                  setAddColumnId={setAddColumnId}
                  onRemoveTag={OnRemoveTag}
                  toggleTaskActivity={toggleTaskActivity}
                />
              ))}
            </SortableContext>
          </div>
          {columns.length < 3 && (
            <button
              onClick={() => {
                createNewColumn();
              }}
              className={`
            h-[60px]
            w-[350px]
            min-w-[350px]
            cursor-pointer
            rounded-lg
            border-2
            border-columnBackgroundColor
            p-4
            ring-rose-500
            hover:ring-2
            flex
            gap-2

            ${
              theme === "dark"
                ? "bg-mainDarkBackgroundColor "
                : "bg-mainLightBackgroundColor"
            }
            `}
            >
              <PlusIcon />
              Add Column
            </button>
          )}
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
                setIsModalOpen={setIsModalOpen}
                setAddColumnId={setAddColumnId}
                onRemoveTag={OnRemoveTag}
                toggleTaskActivity={toggleTaskActivity}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                OnRemoveTag={OnRemoveTag}
                toggleTaskActivity={toggleTaskActivity}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
      {isModalOpen && (
        <AddTaskModal
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
          addNewTask={addNewTask}
          AddColumnId={addColumnId}
        />
      )}
    </div>
  );

  async function addNewTask(task: Task) {
    try {
      const response = await fetch("http://localhost:3010/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) throw new Error("Something went wrong");

      const data = await response.json();
      console.log("DATA", data);
      setTasks([...tasks, task]);
    } catch (error) {
      console.log(error);
    }
  }

  async function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
      tags: [],
      active: false,
      activityLog: [],
      lastStatusChange: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    try {
      const response = await fetch("http://localhost:3010/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) throw new Error("Something went wrong");

      const data = await response.json();
      console.log("DATA", data);
      setTasks([...tasks, newTask]);
      toast.success("Task created successfully");
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteTask(id: Id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    try {
      const response = await fetch(`http://localhost:3010/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Something went wrong");

      setTasks(newTasks);
      toast.success("Task deleted successfully");
    } catch (error) {
      console.log(error);
    }
  }

  async function updateTask(id: Id, content: string) {
    try {
      const response = await fetch(`http://localhost:3010/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error("Something went wrong");
      const newTasks = tasks.map((task) => {
        if (task.id !== id) return task;
        return { ...task, content };
      });

      setTasks(newTasks);
      toast.success("Task updated successfully");
    } catch (error) {
      console.log(error);
    }
  }

  async function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    try {
      const response = await fetch("http://localhost:3010/columns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(columnToAdd),
      });

      if (!response.ok) throw new Error("Something went wrong");

      const data = await response.json();
      console.log("DATA", data);
      setColumns([...columns, columnToAdd]);
      toast.success("Column created successfully");
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteColumn(id: Id) {
    try {
      const res = Promise.all([
        await fetch(`http://localhost:3010/columns/${id}`, {
          method: "DELETE",
        }),
        await fetch(`http://localhost:3010/tasks?columnId=${id}`, {
          method: "DELETE",
        }),
      ]);

      if (!res) throw new Error("Something went wrong");
      const filteredColumns = columns.filter((col) => col.id !== id);
      const filteredTasks = tasks.filter((t) => t.columnId !== id);

      setColumns(filteredColumns);
      setTasks(filteredTasks);
      toast.success("Column deleted successfully");
    } catch (error) {
      console.log(error);
    }
  }

  async function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    try {
      const response = await fetch(`http://localhost:3010/columns/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) throw new Error("Something went wrong");

      setColumns(newColumns);
      toast.success("Column updated successfully");
    } catch (error) {
      console.log(error);
    }
  }

  async function OnRemoveTag(id: Id, tag: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      const newTags = task.tags.filter((t) => t !== tag);
      return { ...task, tags: newTags };
    });

    try {
      const response = await fetch(`http://localhost:3010/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tags: newTasks.find((task) => task.id === id)?.tags,
        }),
      });

      if (!response.ok) throw new Error("Something went wrong");
      toast.success("Tag removed successfully");
      setTasks(newTasks);
    } catch (error) {
      console.log(error);
    }
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event?.active?.data?.current?.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  async function toggleTaskActivity(id: Id) {
    console.log("TOGGLE TASK ACTIVITY", id);
    const activeTask = tasks.find((task) => task.id === id);
    if (!activeTask) return;
    const isActive = activeTask.active;
    const activityLog = activeTask.activityLog;
    const lastStatusChange = activeTask?.lastStatusChange;
    let updatedTask = {};

    if (isActive) {
      updatedTask = {
        ...activeTask,
        active: false,
        activityLog: [
          ...activityLog,
          {
            startTimestamp: lastStatusChange,
            endTimestamp: Date.now(),
          },
        ],
      };
    } else {
      updatedTask = {
        ...activeTask,
        active: true,
        lastStatusChange: Date.now(),
      };
    }

    const response = await fetch(`http://localhost:3010/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });

    if (!response.ok) throw new Error("Something went wrong");

    setTasks((tasks) =>
      tasks.map((task) => {
        if (task.id !== id) return task;
        return updatedTask as Task;
      })
    );

    console.log("UPDATED TASK", updatedTask);
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    const isActiveATask = active.data.current?.type === "Task";

    if (!isActiveAColumn && !isActiveATask) return;

    if (isActiveAColumn) {
      setColumns((prevColumns) => {
        const activeColumnIndex = prevColumns.findIndex(
          (col) => col.id === activeId
        );
        const overColumnIndex = prevColumns.findIndex(
          (col) => col.id === overId
        );

        const updatedColumns = arrayMove(
          prevColumns,
          activeColumnIndex,
          overColumnIndex
        );

        // updateColumnOrder(updatedColumns);

        return updatedColumns;
      });
    }

    if (isActiveATask) {
      setTasks((prevTasks) => {
        const activeIndex = prevTasks.findIndex((task) => task.id === activeId);
        const overIndex = prevTasks.findIndex((task) => task.id === overId);

        const updatedTasks = arrayMove(prevTasks, activeIndex, overIndex);

        // updateTaskOrder(updatedTasks);

        return updatedTasks;
      });
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setTasks((prevTasks) => {
        const activeIndex = prevTasks.findIndex((task) => task.id === activeId);
        const overIndex = prevTasks.findIndex((task) => task.id === overId);

        const updatedTasks = arrayMove(prevTasks, activeIndex, overIndex);

        // updateTaskOrder(updatedTasks);

        return updatedTasks;
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverAColumn) {
      setTasks((prevTasks) => {
        const activeIndex = prevTasks.findIndex((task) => task.id === activeId);
        const updatedTasks = [...prevTasks];

        updatedTasks[activeIndex].columnId = overId;

        // updateTaskOrder(updatedTasks);

        return updatedTasks;
      });
    }
  }

  // async function updateColumnOrder(updatedColumns: Column[]) {
  //   try {
  //     await fetch("http://localhost:3010/columns", {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(updatedColumns),
  //     });
  //     console.log("UPDATED COLUMNS", updatedColumns);
  //   } catch (error) {
  //     console.error("Failed to update column order:", error);
  //   }
  // }

  // async function updateTaskOrder(updatedTasks: Task[]) {
  //   try {
  //     await fetch("http://localhost:3010/tasks", {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(updatedTasks),
  //     });
  //     console.log("UPDATED TASKS", updatedTasks);
  //   } catch (error) {
  //     console.error("Failed to update task order:", error);
  //   }
  // }

  function generateId() {
    /* Generate a random number between 0 and 10000 */
    return Math.floor(Math.random() * 10001);
  }
}

export default KanbanBoard;
