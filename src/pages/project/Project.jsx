import "@/pages/project/Project.scss";
import ShareMember from "@/components/ShareMember";
import ProjectAside from "@/components/project/ProjectAside";
import { CustomSVG } from "@/components/project/_CustomSVG";
import { AddProjectModal } from "@/components/project/_Modal";
import { ProjectColumn } from "@/components/project/Column";
import  DynamicTask  from "@/components/project/Task";
import { useEffect, useRef, useState } from "react";
import Sortable from "sortablejs";
import axiosInstance from "@/services/axios.jsx";
import useProjectStore from "../../util/useProjectData";
import useUserStore from "../../store/useUserStore";


export default function Project() {
 // Tailwind CSS 클래스 묶음
  const addBoardClass ="flex gap-2 items-center px-3 py-2 w-full text-sm rounded-lg bg-zinc-200 bg-opacity-30";

  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태 관리
  const [isNewColumnAdded, setIsNewColumnAdded] = useState(false);
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [projectId, setProjectId] = useState(1);
  const {project, sendWebSocketMessage} = useProjectStore(projectId);
  const columnsRef = useRef(null); 
  const loginUser = useUserStore((state) => state.user)

  
  const handleEditTitle = () => {
  setIsEditTitle(!isEditTitle);
  };
  const onCoworkerSelect = value => {
  setData((prev) => ({
    ...prev,
    coworkers: value,
  }));
  }
  const handleChange = (e) => {
  const { name, value } = e.target;
  setData((prev) => ({
    ...prev,
    [name]: value,
  }));
  };
  const updateColumnTasks = (columns, columnIndex, taskId, updatedTask) => {
    const updatedColumns = [...columns];
    const column = updatedColumns[columnIndex];
    column.tasks = column.tasks.map((task) =>
      task.id === taskId ? updatedTask : task
    );
    return updatedColumns;
  };
  const updateColumnOrderInDatabase = async(columns) => {
    await axiosInstance.put("/api/projects/update-column-order",columns);
  };
  useEffect(() => {
    if (columnsRef.current) {
      new Sortable(columnsRef.current, {
        group: "columns",
        animation: 300,
        handle: ".handle",
        onEnd(evt) {
          const { oldIndex, newIndex } = evt;
  
          // 컬럼 순서 변경
          setData((prevData) => {
            const updatedColumns = [...prevData.columns];
            const [movedColumn] = updatedColumns.splice(oldIndex, 1);
            updatedColumns.splice(newIndex, 0, movedColumn);
  
            updatedColumns.forEach((column, index) => column.position = index);
  
            // 서버로 순서 업데이트 요청
            updateColumnOrderInDatabase(updatedColumns);
  
            return { ...prevData, columns: updatedColumns };
          });
        },
      });
    }
  }, []);
  useEffect(() => {
    if (project) {
      console.log('Updated Board Data:', [project]); // 상태 업데이트 후 데이터를 출력
      setData(project||[])
    }
  }, [projectId,project]); 
  const handleTaskMove = (sourceIndex, destinationIndex, taskId) => {
    setData((prevData) => {
      const sourceColumn = { ...prevData.columns[sourceIndex] };
      const destinationColumn = { ...prevData.columns[destinationIndex] };
  
      // 이동 대상 태스크 제거 및 추가
      const movingTask = sourceColumn.tasks.find((task) => task.id === taskId);
      sourceColumn.tasks = sourceColumn.tasks.filter((task) => task.id !== taskId);
      destinationColumn.tasks = [...destinationColumn.tasks, movingTask];
  
      // 상태 업데이트
      const updatedColumns = prevData.columns.map((col, idx) => {
        if (idx === sourceIndex) return sourceColumn;
        if (idx === destinationIndex) return destinationColumn;
        return col;
      });
  
      return { ...prevData, columns: updatedColumns };
    });
  };
  const clearTasks = (columnId) => {
    setData((prevData) => ({
      ...prevData,
      columns: prevData.columns.map((col) =>
        col.id === columnId ? { ...col, tasks: [] } : col
      ),
    }));
  };
  const handleAddColumn = () => {
    if (!isNewColumnAdded) {
      setIsNewColumnAdded(true);
    }
  };
  
  const handleDeleteColumn = (column) => {
    sendWebSocketMessage(column,`/app/project/${projectId}/column/deleted`);
  };

  const handleAddComment = (comment, taskId) => {
    console.log(comment);
    const updatedComment = { ...comment, taskId: taskId, user: loginUser, user_id: loginUser.uid };
    sendWebSocketMessage(updatedComment,`/app/project/${projectId}/comment/added`);
  };
  const handleDeleteComment = (comment, taskId) =>{
    console.log(comment);
    const updatedComment = { ...comment, taskId: taskId, user: loginUser, user_id: loginUser.uid };
    sendWebSocketMessage(updatedComment,`/app/project/${projectId}/comment/deleted`);
  }

  const handleTaskUpsert = (task) => {
    const msg = task.id>0 ? 'updated' : 'added';
    const updatedTask = { ...task, projectId: projectId };
    sendWebSocketMessage(updatedTask ,`/app/project/${projectId}/task/${msg}`);
  };


  const handleDeleteTask = (task, columnId) => {
    const updatedTask = { ...task, projectId: projectId,columnId: columnId };
    sendWebSocketMessage(updatedTask,`/app/project/${projectId}/task/deleted`);
  };

  const handleAddSubTask = (columnId, taskId, newSubTask) => {
    const subTask = {
      isChecked : false,
      name : newSubTask,
      taskId: taskId,
      columnId: columnId,
      projectId: projectId,
    }
    sendWebSocketMessage(subTask,`/app/project/${projectId}/sub/added`);
  };
  // 체크박스 상태 업데이트 함수
  const handleClickCheckbox = (subTask) => {
    sendWebSocketMessage(subTask, `/app/project/${projectId}/sub/updated`);
  };

  return (
    <div id="project-container" className="flex min-h-full">
      {/* 사이드바 */}
      <div className="w-[270px]">
        <ProjectAside setProjectId={setProjectId}/>
      </div>

      {/* 메인 섹션 */}
      <section className="flex-grow py-6 pl-6 min-w-max bg-white rounded-3xl">
        {/* 헤더 */}
        <div className="flex pb-2.5 w-full mb-4">
          <div className="w-[30%]"></div>

          <header className="flex w-[40%] overflow-hidden relative justify-between items-center px-5 py-1 rounded-xl bg-zinc-100">
            <div></div>

            {isEditTitle ? (
              <input
                type="text"
                className="text-lg text-center text-gray-400 w-fit overflow-visible bg-transparent"
                value={data.title}
                name="title"
                onChange={handleChange}
                autoFocus
              />
            ) : (
              <span className="text-lg text-center text-black">
                {data.title}
              </span>
            )}

            <button onClick={handleEditTitle}>
              {isEditTitle ? (
                <CustomSVG id="check" />
              ) : (
                <CustomSVG id="rename" />
              )}
            </button>
          </header>

          {/* 네비게이션 */}
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
              />
            </ShareMember>
          </div>
        </div>

        {/* 프로젝트 컬럼 */}
        <div className="flex gap-5 max-md:flex-col">
          {data?.columns?.map((column, index) => (
            <ProjectColumn
            key={column.id}
            {...column}
            index={index}
            coworkers={data.coworkers}
            clearTasks={() => clearTasks(column.id)}
            onDelete={() => handleDeleteColumn(column)}
            handleTaskUpsert={handleTaskUpsert}
          >
            {column.tasks.map((task) =>
                <DynamicTask
                  key={task.id}
                  {...task}
                  projectId={data.id}
                  columnIndex={index}
                  columnId={column.id}
                  onAddSubTask={(newSubTask) =>handleAddSubTask(column.id, task.id, newSubTask)}
                  onClickSubTask={handleClickCheckbox}
                  onAddComment={handleAddComment}
                  onDeleteComment={handleDeleteComment}
                  onSaveTask={handleTaskUpsert}
                  onDeleteTask={() => handleDeleteTask(task, column.id)}
                  coworkers={data.coworkers}
                />
              
            )}
          </ProjectColumn>
          ))}
          {/* 새 보드 추가 */}
          {isNewColumnAdded ? (
            <ProjectColumn
            projectId={data.id}
            index={data.columns.length}
            status="new"
          />
          ) : (
            <div className="flex flex-col w-64 text-center min-w-[240px] text-black text-opacity-50">
              <button className={addBoardClass} onClick={handleAddColumn}>
                <CustomSVG id="add" /> <span>새 보드</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
