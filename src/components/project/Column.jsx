/* eslint-disable react/prop-types */
import { CustomSVG } from "./_CustomSVG";
import { useState } from "react";
import { ColumnHeader, ColumnHeaderEdit } from "./ColumnHeader";
import { DynamicTaskEditor } from "./TaskEdit";

export const ProjectColumn = ({
  projectId,
  id,
  title,
  color = "#000000",
  count = 0,
  children,
  role,
  index,
  coworkers=[],
  clearTasks,
  status = "basic",
  onDelete,
  handleTaskUpsert,
  setIsNewColumnAdded,
  onAddColumn,
}) => {
  const initialData =
    status == "new"
      ? { title: title, color: color, count: count, role:5 }
      : { title: title, color: color, count: count, role:role };
  const [column, setColumn] = useState(initialData);
  const [isNewTaskAdded, setIsNewTaskAdded] = useState(false);
  const [mode, setMode] = useState(status);

  const handleIsAddTask = () => {
    if (!isNewTaskAdded) {
      setIsNewTaskAdded(true);
    }
  };

  return (
    <section className="flex flex-col w-64 min-w-[240px]">
      {/* Column Header */}
      {mode === "basic" ? (
        <ColumnHeader
          column={column}
          setMode={setMode}
          clearTasks={clearTasks}
          onDelete={onDelete}
        />
      ) : (
        <ColumnHeaderEdit
          columnIndex={index}
          projectId={projectId}
          column={column}
          setColumn={setColumn}
          setMode={setMode}
          onClose={()=>{setColumn(null);setIsNewColumnAdded(false)
            setMode("basic");}}
          mode={mode}
          onAddColumn={onAddColumn}
        />
      )}

      {/* Column Content */}
      <div
        className="flex flex-col mt-3 w-full overflow-y-auto max-h-[600px] scrollbar-none"
        id={`column-${index}`}
      >
        {children}
      </div>

      {/* Add New Task */}
      {isNewTaskAdded ? (
        <DynamicTaskEditor
          projectId={projectId}
          setIsAdded={setIsNewTaskAdded}
          columnIndex={index}
          columnId={id}
          onSave={handleTaskUpsert}
          coworkers={coworkers}
          mode="create"
        />
      ) : (
        <button
          onClick={handleIsAddTask}
          className="flex gap-2 items-center px-3 py-2 mt-3 w-full text-center text-black text-opacity-50"
        >
          <CustomSVG id="add" />
          <div className="self-stretch my-auto text-sm leading-none">
            새 목표
          </div>
        </button>
      )}
    </section>
  );
};
