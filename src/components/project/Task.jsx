/* eslint-disable react/prop-types */
import React, { useState, useMemo } from "react";
import { CustomSVG } from "./_CustomSVG";
import { DynamicTaskEditor } from "@/components/project/TaskEdit";
import { v4 as uuidv4 } from "uuid";
import clsx from "clsx";

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
  id,
  title,
  content,
  priority,
  status,
  duedate,
  subTasks = [],
  tags = [],
  commentsList = [],
  columnIndex,
  onAddSubTask,
  onDelete,
  onSave,
}) => {
  const [showInput, setShowInput] = useState(false); // 입력창 표시 상태
  const [newSubTask, setNewSubTask] = useState(""); // 새로운 하위 목표 값
  const [nowSubTasks, setNowSubTasks] = useState(subTasks);
  const [isEditing, setIsEditing] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // 수정 상태 토글
  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  // 상세 정보 열림 상태 토글
  const handleDetailToggle = () => {
    setIsDetailOpen((prev) => !prev);
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

  // useMemo로 하위 목표 체크된 항목 수 계산 최적화
  const checkedCount = useMemo(() => {
    return (nowSubTasks||[]).filter((task) => task.isChecked).length;
  }, [nowSubTasks]);
  const formattedDueDate = useMemo(() => getFormattedDueDate(duedate), [duedate]);
  const dateColor = useMemo(() => getDateColor(formattedDueDate), [formattedDueDate]);

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
  const handleCheckboxChange = (id) => {
    setNowSubTasks((prevSubTasks) =>
      prevSubTasks.map((subTask) =>
        subTask.id === id
          ? { ...subTask, isChecked: !subTask.isChecked }
          : subTask
      )
    );
  };
  const stopPropagation = (e) => e.stopPropagation();

  const renderedSubTasks = useMemo(() => {
    return (nowSubTasks||[]).map((subTask, index) => (
      <div key={subTask.id} className="flex items-center gap-1.5 h-[22px]">
        <input
          id={`check${index}`}
          checked={subTask.isChecked}
          type="checkbox"
          className="screen-reader"
          onChange={() => handleCheckboxChange(subTask.id)}
          onClick={(e) => stopPropagation(e)}
          aria-checked={subTask.isChecked}
        />
        <label
          aria-label={`하위목표 - ${subTask.name}`}
          htmlFor={`check${index}`}
          className="flex flex-row items-center gap-1 text-neutral-500 text-sm"
          onClick={(e) => stopPropagation(e)}
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
          taskToEdit={{
            id,
            title,
            content,
            priority,
            status,
            duedate,
            subTasks: nowSubTasks,
            tags,
            commentsList,
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
            className="flex gap-1 p-3 mt-2 w-full bg-white rounded-lg border shadow-sm border-black/10 cursor-pointer"
            onClick={handleDetailToggle}
            aria-expanded={isDetailOpen}
            aria-label={`작업 카드: ${title}`}
            data-task-id={id}
          >
            {/* Conditionally Render Content */}
            {isDetailOpen ? (
              <div className="flex flex-col flex-1 w-full">
                {/* Title and Priority */}
                <div className="flex items-start py-px gap-2">
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
                        onClick={(e) => {
                          stopPropagation(e);
                          setShowInput(false);
                        }}
                        aria-label="입력 취소"
                      >
                        <CustomSVG id="close" />
                      </button>
                      <input
                        type="text"
                        value={newSubTask}
                        onClick={stopPropagation}
                        onChange={handleChangeSubTask}
                        placeholder="새 하위 목표 입력"
                        className="flex-1 px-2 py-1 border rounded-lg outline-none text-sm"
                        aria-label="새로운 하위 목표 입력란"
                      />
                      <button
                        className="text-white bg-blue-500 rounded-xl"
                        onClick={(e) => {
                          stopPropagation(e);
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
                      className="flex items-center justify-center gap-1.5 py-1.5 mt-2 text-sm rounded-lg bg-gray-600/10 text-gray-600/60"
                      onClick={(e) => {
                        stopPropagation(e);
                        setShowInput(true);
                      }}
                      aria-label="새 하위 목표 추가"
                    >
                      <CustomSVG id="add-checkbox" />
                      <span className="text-sm">
                        {checkedCount}/{(subTasks||[]).length} 새 하위 목표 생성
                      </span>
                    </button>
                  )}
                </section>

                {/* Tags Section */}
                {(tags||[]).length > 0 && (
                  <section
                    className="flex flex-wrap gap-2 mt-1.5 text-xs text-black/50"
                    aria-labelledby="tags"
                  >
                    <h2 id="tags-title" className="sr-only">
                      태그
                    </h2>
                    <CustomSVG id="tag" />
                    {(tags||[]).map((tag, index) => (
                      <div
                        key={index}
                        className="px-2 py-1 rounded-2xl bg-zinc-700/10 text-xs"
                        aria-label={`태그: ${tag}`}
                      >
                        {tag}
                      </div>
                    ))}
                  </section>
                )}

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
                    aria-label={`의견 ${commentsList.length}개`}
                  >
                    <CustomSVG id="comment" />
                    <span>의견 {commentsList.length}</span>
                  </div>
                  {commentsList.map((comment) => (
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
                        <span className="text-gray-600">{comment.user}</span>
                        <time className="text-gray-600"> {comment.rdate}</time>
                        <p>{comment.content}</p>
                      </div>
                    </article>
                  ))}
                  <form
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-600/10"
                    aria-label="의견 작성하기"
                  >
                    <CustomSVG id="reply" />
                    <input
                      type="text"
                      placeholder="의견 작성하기"
                      className="w-full bg-transparent outline-none"
                      aria-label="의견 입력란"
                    />
                  </form>
                </section>

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
                    onClick={(e) => {
                      stopPropagation(e);
                      handleEditToggle();
                    }}
                    aria-label="작업 수정"
                  >
                    수정
                  </button>
                  <button
                    className="px-6 py-1 border rounded-lg border-slate-500/50"
                    onClick={(e) => {
                      stopPropagation(e);
                      onDelete();
                    }}
                    aria-label="작업 삭제"
                  >
                    삭제
                  </button>
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

                <div className="flex flex-col flex-1 shrink basis-0 text-black text-opacity-50">
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

                  {subTasks || duedate || commentsList ? (
                    <div className="flex flex-wrap gap-2 items-start pt-3 w-full text-xs leading-none">
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

                      {(commentsList||[]).length>0 && (
                        <div className="flex gap-1 items-center whitespace-nowrap">
                          <CustomSVG id="comment" size="18" />
                          <div className="self-stretch my-auto text-ellipsis">
                            {(commentsList||[]).length}
                          </div>
                        </div>
                      )}
                    </div>
                  ):null}

                  {/* Tags */}
                  {(tags||[]).length > 0 && (
                    <div className="flex items-center gap-1 pt-2 text-sm">
                      <CustomSVG id="tag" size="18" />
                      <div>
                        {tags[0]}
                        {tags.length > 1 && ` +${tags.length - 1}`}
                      </div>
                    </div>
                  )}
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
    JSON.stringify(prevProps.tags) === JSON.stringify(nextProps.tags) &&
    JSON.stringify(prevProps.commentsList) === JSON.stringify(nextProps.commentsList)
  );
}
);

DynamicTask.displayName = "DynamicTask"; // displayName 추가

export default DynamicTask;