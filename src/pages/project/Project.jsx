import "@/pages/project/Project.scss";
import ShareMember from "@/components/ShareMember";
import ProjectAside from "@/components/project/ProjectAside";
import { CustomSVG } from "@/components/project/_CustomSVG";
import { AddProjectModal } from "@/components/project/_Modal";
import { ProjectColumn } from "@/components/project/Column";
import  DynamicTask  from "@/components/project/Task";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Sortable from "sortablejs";
import axiosInstance from "@/services/axios.jsx";

const initialData = {
  id: 0,
  title: "새 프로젝트 (1)",
  coworkers: [
    {
      id: 14,
      name: "김주경",
      email: "ppsdd123@gmail.com",
      img: "/images/document-folder-profile.png",
    },
    {
      id: 10,
      name: "박서홍",
      email: "ppsdd123@gmail.com",
      img: "/images/document-folder-profile.png",
    },
    {
      id: 9,
      name: "박연화",
      email: "ppsdd123@gmail.com",
      img: "/images/document-folder-profile.png",
    },
    {
      id: 17,
      name: "신승우",
      email: "ppsdd123@gmail.com",
      img: "/images/document-folder-profile.png",
    },
    {
      id: 1,
      name: "이상훈",
      email: "ppsdd123@gmail.com",
      img: "/images/document-folder-profile.png",
    },
    {
      id: 2,
      name: "전규찬",
      email: "ppsdd123@gmail.com",
      img: "/images/document-folder-profile.png",
    },
    {
      id: 7,
      name: "하진희",
      email: "ppsdd123@gmail.com",
      img: "/images/document-folder-profile.png",
    },
  ],
  columns: [
    {
      id: 3243465,
      title: "시작하기",
      color: "#F5234B",
      tasks: [
        {
          id: 0,
          title: "👋 Welcome to your board 👉",
          status: "active",
          content: "Here you'll submit and manage all of your design requests.",
          priority: 4,
          subTasks: [],
          tags: [],
          commentsList: [],
        },
      ],
    },
    {
      id: 7245234436,
      title: "🛠️ In Progress",
      color: "#0070F5",
      tasks: [
        {
          id: 1,
          title: "화면구현 설계",
          content: "figma 디자인 및 구현 상태 확인",
          status: "completed",
          priority: 2,
          subTasks: [],
          tags: [],
          commentsList: [],
        },
        {
          id: 2,
          title: "화면 구현",
          content:
            "Html로 React 실행 화면 되도록이면 구현하기. 불가능할시 다음주에 더 열심히 하기",
          status: "active",
          priority: 0,
          subTasks: [
            { id: 1, isChecked: false, name: "화면 구현하기" },
            { id: 2, isChecked: true, name: "DB 설계하기" },
          ],
          tags: ["Web app", "HTML", "React"],
          duedate: "2024-11-22",
          commentsList: [
            {
              id: 1,
              user: "chhak0503",
              rdate: "24-11-21 17:05",
              content: "나 철학인데 이거 이번주까지 아니다 정신 차려라",
            },
            {
              id: 2,
              user: "chhak0503",
              rdate: "24-11-25 09:01",
              content: "나 철학인데 이거 이번주까지다 정신 차려라",
            },
          ],
        },
      ],
    },
    {
      id: 525683921,
      title: "✅ Approved",
      color: "#1EC337",
      tasks: [
        {
          id: 3,
          title: "Search history for Backlinks and Keywords tool",
          priority: 1,
          status: "completed",
          subTasks: [],
          tags: [],
          commentsList: [],
        },
      ],
    },
  ],
};

export default function Project() {
  // Tailwind CSS 클래스 묶음
  const addBoardClass =
    "flex gap-2 items-center px-3 py-2 w-full text-sm rounded-lg bg-zinc-200 bg-opacity-30";
  const [data, setData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태 관리
  const [isNewColumnAdded, setIsNewColumnAdded] = useState(false);

  const columnsRef = useRef(null); // 컬럼을 감싸는 DOM 요소 참조
  const handleAddColumn = () => {
    if (!isNewColumnAdded) {
      setIsNewColumnAdded(true);
    }
  };
  const [isEditTitle, setIsEditTitle] = useState(false);

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
  
  const handleSaveProject = (updatedTask, columnIndex) => {
    setData((prevData) => ({
      ...prevData,
      columns: updateColumnTasks(prevData.columns, columnIndex, updatedTask.id, updatedTask),
    }));
  };
  
  const handleTaskMove = (sourceIndex, destinationIndex, taskId) => {
    setData((prevData) => {
      const sourceColumn = { ...prevData.columns[sourceIndex] };
      const destinationColumn = { ...prevData.columns[destinationIndex] };
  
      const movingTask = sourceColumn.tasks.find((task) => task.id === taskId);
      sourceColumn.tasks = sourceColumn.tasks.filter((task) => task.id !== taskId);
      destinationColumn.tasks = [...destinationColumn.tasks, movingTask];
    
      return {
        ...prevData,
        columns: updateColumnTasks(prevData.columns, sourceIndex, taskId, movingTask),
      };
    });
  };
  useEffect(() => {
    if (columnsRef.current) {
      new Sortable(columnsRef.current, {
        group: "columns", // 같은 그룹에 속하는 요소들끼리 드래그 가능
        animation: 300,
        handle: ".handle", // .handle 클래스를 가진 요소만 드래그 가능
        onStart(evt) {
          console.log("Drag started");
        },
        onEnd(evt) {
          console.log("Drag ended");
        },
      });
    }
  }, []);
  const clearTasks = (columnId) => {
    setData((prevData) => ({
      ...prevData,
      columns: prevData.columns.map((col) =>
        col.id === columnId ? { ...col, tasks: [] } : col
      ),
    }));
  };
  const handleTaskUpsert = async (task, columnIndex) => {
    try { // task.id가 존재하면 PUT 요청, 그렇지 않으면 POST 요청
      const method = task.id ? 'put' : 'post';
      
      const res = await axiosInstance({ method, url:'/api/project/task', data: task });
      
      setData((prevData) => {
        console.log(res.data);
        const updatedColumns = prevData.columns.map((col, idx) => {
          if (idx !== columnIndex) return col;
  
          if (task.id) {
            // 수정된 태스크 업데이트 (PUT)
            const updatedTasks = col.tasks.map((existingTask) => {
              if (existingTask.id === task.id) {
                return { ...existingTask, ...res.data }; // 서버에서 받은 수정된 데이터로 교체
              }
              return existingTask;
            });
            return { ...col, tasks: updatedTasks };
          } else {
            // 새로운 태스크 추가 (POST)
            return { ...col, tasks: [...col.tasks, res.data] };
          }
        });
  
        return { ...prevData, columns: updatedColumns };
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCol = (colId) => {
    setData((prevData) => {
      const updatedColumns = prevData.columns.filter((col) => col.id !== colId);
      return { ...prevData, columns: updatedColumns };
    });
  };

  const handleDeleteTask = (taskId, columnIndex) => {
    setData((prevData) => {
      const updatedColumns = prevData.columns.map((col, idx) => {
        if (idx !== columnIndex) return col;
  
        return {
          ...col,
          tasks: col.tasks.filter((task) => task.id !== taskId),
        };
      });
  
      return { ...prevData, columns: updatedColumns };
    });
  };

  const handleAddSubTask = (columnIndex, taskId, newSubTask) => {
    if (!newSubTask.trim()) return; // 빈 입력 방지
  
    setData((prevData) => {
      const updatedColumns = prevData.columns.map((col, idx) => {
        if (idx !== columnIndex) return col;
  
        return {
          ...col,
          tasks: col.tasks.map((task) => {
            if (task.id !== taskId) return task;
  
            return {
              ...task,
              subTasks: [
                ...(task.subTasks||[]),
                { id: uuidv4(), isChecked: false, name: newSubTask },
              ],
            };
          }),
        };
      });
  
      return { ...prevData, columns: updatedColumns };
    });
  };
  

  return (
    <div id="project-container" className="flex min-h-full">
      {/* 사이드바 */}
      <div className="w-[270px]">
        <ProjectAside setData={setData} />
      </div>

      {/* 메인 섹션 */}
      <section className="flex-grow py-6 pl-6 pr-4 bg-white rounded-3xl overflow-hidden">
        {/* 헤더 */}
        <div className="flex pb-2.5 w-full mb-4 h-[7%]">
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
        <div className="flex gap-5 overflow-x-auto scrollbar-thin h-[93%]" ref={columnsRef} id="sortable">
          {data.columns.map((column, index) => (
            <ProjectColumn
              key={column.id}
              {...column}
              index={index}
              clearTasks={() => clearTasks(column.id)}
              setData={setData}
              onDelete={() => handleDeleteCol(column.id)}
              handleTaskUpsert={handleTaskUpsert}
            >
              {column.tasks.map((task) =>
                  <DynamicTask
                    key={task.id}
                    {...task}
                    columnIndex={index}
                    columnId={column.id}
                    onDelete={() => handleDeleteTask(task.id,index)}
                    onAddSubTask={(newSubTask) =>handleAddSubTask(index, task.id, newSubTask)}
                    onSave={handleTaskUpsert}
                  />
                
              )}
            </ProjectColumn>
          ))}
          {/* 새 보드 추가 */}
          {isNewColumnAdded ? (
            <ProjectColumn
              projectId={data.id}
              index={data.columns.length}
              setData={setIsNewColumnAdded}
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
