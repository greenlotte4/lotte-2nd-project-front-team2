import "@/pages/project/Project.scss";
import ShareMember from "@/components/ShareMember";
import ProjectAside from "@/components/project/ProjectAside";
import { CustomSVG } from "@/components/project/_CustomSVG";
import { AddProjectModal } from "@/components/project/_Modal";
import { ProjectColumn } from "@/components/project/Column";
import DynamicTask from "@/components/project/Task";
import { useCallback, useEffect, useRef, useState } from "react";
import Sortable from "sortablejs";
import useProjectStore from "../../util/useProjectData";
import useUserStore from "../../store/useUserStore";

export default function Project() {
  const addBoardClass =
    "flex gap-2 items-center px-3 py-2 w-full text-sm rounded-lg bg-zinc-200 bg-opacity-30";

  const [data, setData] = useState({ title: "", columns: [], coworkers: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewColumnAdded, setIsNewColumnAdded] = useState(false);
  const [projectId, setProjectId] = useState(1);
  const { project, sendWebSocketMessage } = useProjectStore(projectId);
  const columnsRef = useRef([]);
  const loginUser = useUserStore((state) => state.user);

  const onCoworkerSelect = (value) => {
    setData((prev) => ({
      ...prev,
      coworkers: value,
    }));
  };

  const handleTaskUpsert = useCallback(
    async (task) => {
      const msg = task.id > 0 ? "updated" : "added";
      const updatedTask = { ...task, projectId };
      try {
        await sendWebSocketMessage(
          updatedTask,
          `/app/project/${projectId}/task/${msg}`
        );
      } catch (error) {
        console.error("Failed to update task:", error);
        alert("태스크 업데이트에 실패했습니다. 다시 시도해주세요.");
      }
    },
    [projectId, sendWebSocketMessage]
  );

  useEffect(() => {
    if (project) {
      setData(project || []);
    }
  }, [projectId, project]);

  useEffect(() => {
    const sortables = data.columns.map((column, columnIndex) => {
      const columnEl = columnsRef.current[columnIndex];
      if (!columnEl) return null;

      return new Sortable(columnEl, {
        group: "shared",
        animation: 150,
        ghostClass: "sortable-ghost",
        dragClass: "sortable-drag",
        onEnd: async (evt) => {
          const { item, from, to } = evt;
          const fromColumnId = parseInt(from.getAttribute("data-column-id"));
          const toColumnId = parseInt(to.getAttribute("data-column-id"));
          const taskId = parseInt(item.getAttribute("data-task-id"));

          const task = data.columns
            .find((col) => col.id === fromColumnId)
            ?.tasks.find((t) => t.id === taskId);

          if (!task) return;

          const newIndex = evt.newIndex;
          const toColumn = data.columns.find((col) => col.id === toColumnId);
          let newPosition;

          if (toColumn.tasks.length === 0) {
            newPosition = 1000;
          } else if (newIndex === 0) {
            newPosition = toColumn.tasks[0].position / 2;
          } else if (newIndex === toColumn.tasks.length) {
            newPosition = toColumn.tasks[toColumn.tasks.length - 1].position + 1000;
          } else {
            const prevPosition = toColumn.tasks[newIndex - 1].position;
            const nextPosition = toColumn.tasks[newIndex].position;
            newPosition = (prevPosition + nextPosition) / 2;
          }

          const updatedTask = {
            ...task,
            position: newPosition,
            columnId: toColumnId,
          };

          try {
            await handleTaskUpsert(updatedTask);
          } catch (error) {
            console.error("Task update failed:", error);
          }
        },
      });
    });

    return () => {
      sortables.forEach((sortable) => sortable?.destroy());
    };
  }, [data.columns, handleTaskUpsert]);

  const sortedColumns = data.columns.map((column) => ({
    ...column,
    tasks: column.tasks.sort((a, b) => a.position - b.position),
  }));

  return (
    <div id="project-container" className="flex min-h-full overflow-hidden">
      <div className="w-[270px]">
        <ProjectAside
          setProjectId={setProjectId}
          onOpennedChange={(e) =>
            setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
          }
        />
      </div>

      <section className="flex-grow py-6 pl-6 w-full bg-white rounded-3xl">
        <div className="flex pb-2.5 w-full mb-4">
          <div className="w-[30%]"></div>
          <header className="flex w-[40%] justify-between items-center px-5 py-1 rounded-xl bg-zinc-100">
            <span className="text-lg text-center w-full text-black">{data.title}</span>
          </header>
          <div className="w-[30%] flex justify-end">
            <ShareMember
              listName="작업자"
              isShareOpen={isModalOpen}
              setIsShareOpen={setIsModalOpen}
              members={data.coworkers}
            >
              <AddProjectModal
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
                text="작업자 추가"
                selectedUsers={data.coworkers}
                setSelectedUsers={onCoworkerSelect}
                projectId={data.id}
                type={data.type}
              />
            </ShareMember>
          </div>
        </div>
        <div className="flex h-full overflow-x-auto">
          {sortedColumns.map((column, index) => (
            <div key={column.id} className="flex flex-col w-64 min-w-[240px] mr-6">
              <ProjectColumn
                {...column}
                projectId={data.id}
                index={index}
                coworkers={data.coworkers}
                clearTasks={() => setData((prev) => ({
                  ...prev,
                  columns: prev.columns.map((col) =>
                    col.id === column.id ? { ...col, tasks: [] } : col
                  ),
                }))}
                onDelete={() =>
                  sendWebSocketMessage(column, `/app/project/${projectId}/column/deleted`)
                }
                handleTaskUpsert={handleTaskUpsert}
              >
                <div
                  ref={(el) => (columnsRef.current[index] = el)}
                  data-column-id={column.id}
                  className="flex flex-col gap-2"
                >
                  {column.tasks.map((task) => (
                    <div key={task.id} data-task-id={task.id}>
                      <DynamicTask
                        {...task}
                        projectId={data.id}
                        columnIndex={index}
                        columnId={column.id}
                        onAddSubTask={(newSubTask) =>
                          sendWebSocketMessage(
                            { isChecked: false, name: newSubTask, taskId: task.id },
                            `/app/project/${projectId}/sub/added`
                          )
                        }
                        onClickSubTask={(subTask) =>
                          sendWebSocketMessage(subTask, `/app/project/${projectId}/sub/updated`)
                        }
                        onDeleteSubTask={(subTask) =>
                          sendWebSocketMessage(subTask, `/app/project/${projectId}/sub/deleted`)
                        }
                        onAddComment={(comment) =>
                          sendWebSocketMessage(
                            { ...comment, taskId: task.id, user: loginUser },
                            `/app/project/${projectId}/comment/added`
                          )
                        }
                        onDeleteComment={(comment) =>
                          sendWebSocketMessage(
                            { ...comment, taskId: task.id, user: loginUser },
                            `/app/project/${projectId}/comment/deleted`
                          )
                        }
                        onSaveTask={handleTaskUpsert}
                        onDeleteTask={() =>
                          sendWebSocketMessage(
                            { ...task, columnId: column.id },
                            `/app/project/${projectId}/task/deleted`
                          )
                        }
                        coworkers={data.coworkers}
                      />
                    </div>
                  ))}
                </div>
              </ProjectColumn>
            </div>
          ))}
          {isNewColumnAdded ? (
            <ProjectColumn
              projectId={data.id}
              index={data.columns.length}
              onAddColumn={(column) =>
                sendWebSocketMessage(column, `/app/project/${projectId}/column/added`)
              }
              status="new"
              setIsNewColumnAdded={setIsNewColumnAdded}
            />
          ) : (
            <div className="flex flex-col w-64 text-center min-w-[240px] text-black text-opacity-50">
              <button className={addBoardClass} onClick={() => setIsNewColumnAdded(true)}>
                <CustomSVG id="add" /> <span>새 보드</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
