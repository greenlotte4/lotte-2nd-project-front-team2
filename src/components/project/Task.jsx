/* eslint-disable react/prop-types */
import React, { useState, useMemo } from "react";
import { CustomSVG } from "./_CustomSVG";
import { DynamicTaskEditor } from "@/components/project/TaskEdit";
import { v4 as uuidv4 } from "uuid";
import clsx from "clsx";
import { MenuItem } from "./_CustomDropdown";
import axiosInstance from "@/services/axios.jsx";
import useProjectData from "../../util/useProjectData";

const getFormattedDueDate = (duedate) => {

  if (!duedate || isNaN(new Date(duedate))) {
    return null; // 기본값 출력 (필요에 따라 수정 가능)
  }
  const today = new Date();
  const dueDate = new Date(duedate);

  // 날짜 차이를 계산 (단위: 밀리초 → 일)
  const differenceInTime = dueDate - today;
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

  // D-day 출력 조건
  if (differenceInDays === 0) {
    return 'D-day';
  } else if (differenceInDays > 0) {
    return `D-${differenceInDays}`;
  } else {
    return `D+${Math.abs(differenceInDays)}`;
  }
};

function getFormattedRdate(inputTime) {
  const now = new Date();
  const inputDate = new Date(inputTime);

  const diffInSeconds = Math.floor((now - inputDate) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}초 전`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else {
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const day = String(inputDate.getDate()).padStart(2, '0');
    const hours = String(inputDate.getHours()).padStart(2, '0');
    const minutes = String(inputDate.getMinutes()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }
}

const getDateColor = (date) => {
  if (typeof date !== "string") return "";

  if (date === "D-day") {
    return "text-red-600 font-semibold";
  } else if (date.includes("-")) {
    return date.length === 3
      ? "text-yellow-600 font-semibold"
      : "text-green-600 font-semibold";
  } else {
    return "";
  }
};

const DynamicTask = React.memo(
  ({
    projectId,
    id,
    title,
    content,
    priority,
    status,
    duedate,
    subTasks = [],
    comments = [],
    associate=[],
    columnIndex,
    columnId,
    onAddSubTask,
    onDelete,
    onSave,
  }) => {
    const [showInput, setShowInput] = useState(false); // 입력창 표시 상태
    const [newSubTask, setNewSubTask] = useState(""); // 새로운 하위 목표 값
    const [nowSubTasks, setNowSubTasks] = useState(subTasks);
    const [isEditing, setIsEditing] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const {sendWebSocketMessage} = useProjectData(projectId);

    // 수정 상태 토글
    const handleEditToggle = () => {
      setIsEditing((prev) => !prev);
    };

    // 상세 정보 열림 상태 토글
    const handleDetailToggle = () => {
      setIsDetailOpen((prev) => !prev);
      setNewSubTask("");
      setShowInput(false);
    };

    const getPriorityColor = () => {
      if (priority < 2) return "#EC6240";
      if (priority === 2) return "#F3AF3D";
      if (priority > 4) return "#00000050";
      return "#2A63F6";
      
    };
    const statusStyles = {
      1: "circle-unchecked",
      2: "circle-checked-filled",
      3: "circle-checked",
    };

    const color = getPriorityColor();


    const checkedCount = useMemo(() => { // 체크된 서브태스크 계산
      return (nowSubTasks||[]).filter((task) => task.isChecked).length;
    }, [nowSubTasks]);
    const formattedDueDate = useMemo(() => getFormattedDueDate(duedate), [duedate]); // D-day 계산
    const dateColor = useMemo(() => getDateColor(formattedDueDate), [formattedDueDate]); // D-day 표시 색상 선택

    const handleChangeSubTask = (e) => {
      setNewSubTask(e.target.value);
    };

    const handleAddSubTask = () => {
      if (newSubTask.trim()) {
        onAddSubTask(newSubTask); // 상위로 SubTask 전달
        const newId = uuidv4();

        // 새로운 하위 목표 추가
        setNowSubTasks([
          ...(nowSubTasks||[]),
          { id: newId, name: newSubTask, isChecked: false },
        ]);
        setNewSubTask(""); // 입력 초기화
        setShowInput(false); // 입력창 닫기
      }
    };

    // 체크박스 상태 업데이트 함수
    const handleCheckboxChange = (subTask) => {
      sendWebSocketMessage(subTask, `/app/project/${projectId}/sub/updated`);
    };

    const renderedSubTasks = useMemo(() => {
      return (nowSubTasks||[]).map((subTask, index) => (
        <div key={subTask.id} className="flex items-center gap-1.5 h-[22px]">
          <input
            id={`check${index}`}
            checked={subTask.isChecked}
            type="checkbox"
            className="screen-reader"
            onChange={() => handleCheckboxChange(subTask.id)}
            aria-checked={subTask.isChecked}
          />
          <label
            aria-label={`하위목표 - ${subTask.name}`}
            htmlFor={`check${index}`}
            className="flex flex-row items-center gap-1 text-neutral-500 text-sm"
          >
            <CustomSVG
              id={subTask.isChecked ? "checkbox-checked" : "checkbox"}
              color={subTask.isChecked ? "#A2A2E6" : "#8A8AE2"}
            />
            {subTask.name}
          </label>
        </div>
      ));
    }, [nowSubTasks]);

    return (
      <>
        {isEditing ? (
          <DynamicTaskEditor
            mode="edit"
            columnId={columnId}
            taskToEdit={{
              id,
              title,
              content,
              priority,
              status,
              duedate,
              subTasks: [...nowSubTasks],
              comments,
              associate,
            }}
            columnIndex={columnIndex}
            onSave={(updatedTask) => {
              onSave(updatedTask,columnIndex);
              setIsEditing(false);
            }}
            onClose={handleEditToggle}
          />
        ) : (
          <>
            <div
              className={`flex gap-1 p-3 mt-2 w-full bg-white rounded-lg border shadow-sm border-black/10 ${isDetailOpen || "cursor-pointer"}`}
              aria-expanded={isDetailOpen}
              aria-label={`작업 카드: ${title}`}
              data-task-id={id}
            >
              {/* Conditionally Render Content */}
              {isDetailOpen ? (
                <div className="flex flex-col flex-1 w-full">
                  {/* Title and Priority */}
                  <div className="flex items-start py-px gap-2 cursor-pointer" onClick={handleDetailToggle}>
                    <div
                      className="w-[20px]"
                      aria-label={`우선순위: ${
                        priority === 0
                          ? "매우 높음"
                          : priority === 1
                          ? "높음"
                          : priority === 2
                          ? "보통"
                          : priority === 3
                          ? "낮음"
                          : priority === 4
                          ? "매우 낮음"
                          : "지정되지 않음"
                      }`}
                    >
                      <CustomSVG id={`p${priority}`} color={color} />
                    </div>
                    <div className="text-sm">{title}</div>
                  </div>

                  {/* Content Section */}
                  {content && (
                    <section
                      className="flex gap-1.5 items-start pt-1.5"
                      aria-label="세부사항"
                    >
                      <CustomSVG id="subject" />
                      <p className="flex-1 text-sm text-black/50">{content}</p>
                    </section>
                  )}

                  {/* SubTasks Section */}
                  <section
                    className="flex flex-col mt-1.5"
                    aria-labelledby="subtasks-title"
                  >
                    <h2 id="subtasks-title" className="sr-only">
                      하위 목표
                    </h2>
                    {renderedSubTasks}

                    {/* 새 하위 목표 추가 버튼 및 입력창 */}
                    {showInput ? (
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          className="text-gray-500 bg-gray-200 rounded-xl"
                          onClick={() => setShowInput(false)}
                          aria-label="입력 취소"
                        >
                          <CustomSVG id="close" />
                        </button>
                        <input
                          type="text"
                          value={newSubTask}
                          onChange={handleChangeSubTask}
                          placeholder="새 하위 목표 입력"
                          className="flex-1 px-2 py-1 border rounded-lg outline-none text-sm"
                          aria-label="새로운 하위 목표 입력란"
                        />
                        <button
                          className="text-white bg-blue-500 rounded-xl"
                          onClick={() => {
                            handleAddSubTask();
                            setShowInput(false);
                          }}
                          aria-label="하위 목표 추가"
                        >
                          <CustomSVG id="add" />
                        </button>
                      </div>
                    ) : (
                      <button
                        className="flex items-center justify-center gap-1.5 py-1.5 mt-2 text-sm rounded-lg border border-gray-600/40 text-gray-600/60"
                        onClick={() => setShowInput(true)}
                        aria-label="새 하위 목표 추가"
                      >
                        <CustomSVG id="add-checkbox" />
                        <span className="text-sm">
                          {checkedCount}/{(subTasks||[]).length} 새 하위 목표 생성
                        </span>
                      </button>
                    )}
                  </section>
                  
                  {/* 작업자 */}
                    <section
                      className="flex flex-wrap items-center space-x-2 gap-2 mt-1.5 text-sm text-black/50"
                      aria-labelledby="associate"
                    >
                        작업자
                      <div className="relative flex items-center">
                        
                  {(associate||[]).length>0 && (
                        associate.map((asso, index) => (
                          <img key={asso.id} src={asso.img||"/images/document-folder-profile.png"} alt={asso.name}
                            className="w-8 h-8 rounded-full border-2 border-white -ml-3 first:ml-0"
                            style={{zIndex: associate.length - index,}}
                          />
                        ))
                      )||"정해지지 않음"}
                      </div>
                    </section>
                  {/* 마감일 및 코멘트 */}
                  <section
                    className="flex flex-wrap gap-2 mt-1.5 text-sm text-gray-600/60"
                    aria-labelledby="마감일 및 댓글"
                  >
                    <h2 id="duedate-comments-title" className="sr-only">
                      마감일 및 의견
                    </h2>
                    {duedate && (
                      <div
                        className={`flex items-center gap-1.5 w-[232px] ${dateColor}`}
                        aria-label={`마감일: ${duedate} (${formattedDueDate})`}
                      >
                        <CustomSVG id="calendar" color="currentColor"/>
                        <time>{duedate}</time> ({formattedDueDate})
                      </div>
                    )}
                    <div
                      className="flex items-center gap-1.5"
                      aria-label={`의견 ${comments.length}개`}
                    >
                      <CustomSVG id="comment" />
                      <span>의견 {comments.length}</span>
                    </div>
                    {comments.map((comment) => (
                      <article
                        className="flex gap-1.5 items-start w-[232px] text-sm"
                        key={comment.id}
                        aria-labelledby={`의견-${comment.id}`}
                      >
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/5005caf306e020a63875ae89317ed34981ec083804afbfa938c3ea7760d10078"
                          alt="댓글 사용자 프로필 이미지"
                          className="w-5 h-5 rounded-full"
                        />
                        <div className="flex-1">
                          <span className="text-gray-600">{comment.user_id}</span>
                          <time className="text-gray-600 text-xs"> {getFormattedRdate(comment.rdate)}</time>
                          <p>{comment.content}</p>
                        </div>
                      </article>
                    ))}
                  </section>
                  <form className="flex items-center justify-between mt-2 gap-2">
                    <section
                      className="flex items-center flex-1 gap-1.5 px-2.5 py-1 rounded-lg bg-gray-600/5 w-full"
                      aria-label="의견 작성하기"
                    >
                      <input
                        type="text"
                        placeholder="의견 작성하기"
                        className="bg-transparent outline-none text-sm"
                        aria-label="의견 입력란"
                      />
                    </section>
                    <button className="bg-gray-600/40 rounded-3xl p-[2px] pl-1 pb-1">
                      <CustomSVG id="send" size={16} color="#FFFFFF"/>
                    </button>
                  </form>

                {/* 작업 버튼 */}
                <section
                    className="flex justify-center gap-1.5 mt-1.5 text-sm text-slate-500"
                    aria-labelledby="actions-title"
                  >
                    <h2 id="actions-title" className="sr-only">
                      작업 수정/삭제
                    </h2>
                    <button
                      className="px-6 py-1 border rounded-lg border-slate-500/50"
                      onClick={handleEditToggle}
                      aria-label="작업 수정"
                    >
                      수정
                    </button>
                    <MenuItem
                      className=""
                      border={'1 px-6 py-1 rounded-lg border-slate-500/50'}
                      onClick={onDelete}
                      confirm={true}
                      tooltip={'삭제 후엔 되돌릴 수 없습니다. 정말로 삭제하시겠습니까?'}
                      aria-label="작업 삭제"
                    >
                      삭제
                    </MenuItem>
                  </section>
                </div>
              ) : (
                <>
                  {status != null && (
                    <div
                      className={clsx(
                        "flex flex-col justify-start items-center px-0.5 py-px w-6 text-lg leading-none whitespace-nowrap min-h-[24px]",
                        {
                          // Add aria-label for better accessibility
                          "aria-label":
                            status === 1
                              ? "Active Task"
                              : status === 2
                              ? "Completed Task"
                              : "Task",
                        }
                      )}
                    >
                      <CustomSVG id={statusStyles[status]} color={color} />
                    </div>
                  )}

                  <div className="flex flex-col flex-1 shrink basis-0 text-black text-opacity-50" onClick={handleDetailToggle}>
                    <div
                      className={clsx("text-sm leading-4 min-h-[24px]", {
                        "line-through": status !== 1,
                      })}
                    >
                      {title}
                    </div>

                    {content && (
                      <div
                        className={clsx(
                          "max-w-[200px] leading-4 truncate text-xs",
                          {
                            "line-through": status !== 1,
                          }
                        )}
                      >
                        {content}
                      </div>
                    )}

                    {associate||subTasks || duedate || comments ? (
                      <div className="flex flex-wrap gap-2 items-start pt-3 w-full text-xs leading-none">
                        {(associate||[]).length>0 && (
                          <div className="relative flex items-center">
                          {associate.map((asso, index) => (
                            <img key={asso.id} src={asso.img||"/images/document-folder-profile.png"} alt={asso.name}
                              className="w-6 h-6 rounded-full border-2 border-white -ml-2 first:ml-0"
                              style={{zIndex: associate.length - index,}}
                            />
                          ))}
                        </div>
                        )}
                        {(subTasks||[]).length>0 && (
                          <div className="flex gap-1 items-center whitespace-nowrap">
                            <CustomSVG id="add-checkbox" size="18" />
                            <div className="self-stretch my-auto text-ellipsis">
                              {checkedCount}/{(subTasks||[]).length}
                            </div>
                          </div>
                        )}

                        {duedate && (
                          <div className={`flex gap-1 items-center whitespace-nowrap ${dateColor}`}>
                            <CustomSVG id="calendar" size="18" color="currentColor"/>
                            <div className="text-ellipsis pt-1">
                              {formattedDueDate}
                            </div>
                          </div>
                        )}

                        {(comments||[]).length>0 && (
                          <div className="flex gap-1 items-center whitespace-nowrap">
                            <CustomSVG id="comment" size="18" />
                            <div className="self-stretch my-auto text-ellipsis">
                              {(comments||[]).length}
                            </div>
                          </div>
                        )}
                      </div>
                    ):null}

                    
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </>
    );
  },
  (prevProps, nextProps) => {
    // props 변경을 비교하여 리렌더링 여부 결정
    // true를 반환하면 리렌더링을 건너뜀, false를 반환하면 리렌더링됨
    return (
      prevProps.title === nextProps.title &&
      prevProps.content === nextProps.content &&
      prevProps.priority === nextProps.priority &&
      prevProps.status === nextProps.status &&
      prevProps.duedate === nextProps.duedate &&
      JSON.stringify(prevProps.subTasks) === JSON.stringify(nextProps.subTasks) &&
      JSON.stringify(prevProps.commentsList) === JSON.stringify(nextProps.commentsList)
    );
  }
);

DynamicTask.displayName = "DynamicTask"; // displayName 추가

export default DynamicTask;