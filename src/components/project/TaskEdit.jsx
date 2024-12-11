/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { CustomSVG } from "./_CustomSVG";
import { comment } from "postcss";

export function DynamicTaskEditor({
  mode,
  taskToEdit,
  columnIndex,
  columnId,
  setIsAdded,
  onSave,
  onClose,
}) {
  const [task, setTask] = useState({
    columnId: columnId,
    id:taskToEdit?.id||"",
    title: taskToEdit?.title||"",
    content: taskToEdit?.content||"",
    priority: taskToEdit?.priority||5,
    duedate: taskToEdit?.duedate||"",
    tags: taskToEdit?.tags||[],
    subTasks:taskToEdit?.subTasks||[],
    comments:taskToEdit?.comments||[],
    status: taskToEdit?.status||1,
    associate: taskToEdit?.associate||[],
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [isNewTagAdded, setIsNewTagAdded] = useState(false);
  const textareaRef = useRef(null); // textarea에 대한 ref

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // 높이를 초기화
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // scrollHeight에 맞춰 조정
    }
  }, [task.content]); // content가 변경될 때마다 높이를 조정
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };
  const handleTAChange = (e) => {
    e.target.style.height = 'auto'; // 초기화
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleClose = () => {
    if (mode === "create") setIsAdded(false);
    else if (mode === "edit") onClose();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.title.trim() === "") return;
    console.log("TaskEdit - columnIndex : "+columnIndex);
    
    onSave(task, columnIndex);
    setIsAdded(false); // 태스크 추가 후 창 닫기
  };

  const handleAddTag = () => {
    if (newTag.trim() === "") return;
    setTask((prevTask) => ({ ...prevTask, tags: [...prevTask.tags, newTag] }));
    setNewTag("");
    setIsNewTagAdded(false);
  };
  const handleDeleteTag = (index) => {
    setTask((prevTask) => ({
      ...prevTask,
      tags: prevTask.tags.filter((_, i) => i !== index),
    }));
  };
  const handleNewTag = () => {
    if (!isNewTagAdded) setIsNewTagAdded(true);
  };
  const handleDeleteSubTask = (index) => {
    setTask((prevTask) => ({
      ...prevTask,
      subTasks: prevTask.subTasks.filter((_, i) => i !== index),
    }));
  };


  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handlePrioritySelect = (priority) => {
    setTask((prevTask) => ({ ...prevTask, priority }));
    setIsDropdownOpen(false);
  };

  const priorities = [
    { id: "p0", icon: "p0", label: "P0 - 아주 높음" },
    { id: "p1", icon: "p1", label: "P1 - 높음" },
    { id: "p2", icon: "p2", label: "P2 - 보통" },
    { id: "p3", icon: "p3", label: "P3 - 낮음" },
    { id: "p4", icon: "p4", label: "P4 - 아주 낮음" },
    { id: "none", label: "None", icon: null },
  ];

  const colClassName =
    "flex gap-1.5 items-start pt-1.5 mt-1.5 max-w-full tracking-normal leading-none rounded-lg min-h-[26px] text-gray-600 text-opacity-60 w-[231px]";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col mt-3 w-full text-sm relative"
      aria-labelledby="new-task-form"
    >
      <div className="flex gap-2 items-start p-3 pt-2 w-full bg-white rounded-lg border border-solid shadow-sm border-black border-opacity-10">
        <div className="flex flex-col flex-1 shrink w-full basis-0">
          {/* Task Name */}
          <label htmlFor="taskName" className="sr-only">
            Task Name
          </label>
          <div className="flex items-center justify-between">
            <input
              autoFocus
              id="taskName"
              type="text"
              name="title"
              value={task.title}
              onChange={handleInputChange}
              placeholder="이름을 입력하세요"
              className="flex flex-col max-w-full tracking-normal leading-6 rounded-lg min-h-[26px] text-gray-600 text-opacity-60 w-[198px]"
              aria-label="Task name"
            />
            <button onClick={handleClose} aria-label="Close form" type="button">
              <CustomSVG id="close" />
            </button>
          </div>

          {/* Priority Dropdown */}
          <div className={colClassName}>
            <CustomSVG
              id={
                priorities[task.priority].label === "None"
                  ? "bar-chart"
                  : priorities[task.priority].icon
              }
            />
            <button
              type="button"
              className="flex flex-col flex-1 shrink basis-0 text-sm"
              onClick={toggleDropdown}
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
              aria-label="Select priority"
            >
              {priorities[task.priority].label === "None"
                ? "중요도 선택"
                : priorities[task.priority].label}
            </button>
            {isDropdownOpen && (
              <ul
                className="absolute mt-1 w-36 py-2 bg-white border rounded shadow-md z-30"
                role="listbox"
                aria-labelledby="priority-dropdown"
              >
                {priorities.map((priority, index) => (
                  <li
                    key={priority.id}
                    className="flex items-center gap-2 px-3 h-6 text-xs hover:bg-gray-100 cursor-pointer"
                    onClick={() => handlePrioritySelect(index)}
                    role="option"
                    aria-selected={priorities[task.priority].id === priority.id}
                  >
                    <CustomSVG id={priority.icon} />
                    <span>{priority.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Task Details */}
          <div className={colClassName}>
            <CustomSVG id="post-add" />
            <textarea
              id="taskDetails"
              name="content"
              value={task.content}
              onChange={(e)=>{handleInputChange(e);handleTAChange(e)}}
              placeholder="세부 내용 입력"
              className="flex flex-col flex-1 shrink basis-0"
              ref={textareaRef}
              aria-label="Task contents"
            />
          </div>

          {/* 마감일 */}
          <div className={colClassName+' relative'}>
            <CustomSVG id="calendar" />
            <h2 id="taskDate" className="sr-only">
            마감일
            </h2>
            <input
              id="taskDate"
              type="date"
              name="duedate"
              value={task.duedate}
              onChange={handleInputChange}
              min="2020-01-01"
              max="9999-12-31"
              aria-label="마감일"
            />
          </div>
          {/* SubTasks Section */}
          <section
            className="flex flex-col mt-1.5"
            aria-labelledby="subtasks-title"
          >
            <h2 id="subtasks-title" className="sr-only">
              하위 목표
            </h2>
            {task.subTasks.map((subTask, index) => (
              <div
                key={subTask.id}
                className="flex items-center gap-1.5 h-[22px]"
              >
                <input
                  id={`check${index}`}
                  checked={subTask.isChecked}
                  type="checkbox"
                  className="screen-reader"
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
                <button
                    onClick={() => handleDeleteSubTask(index)}
                    aria-label="Delete SubTask"
                    className="ml-auto text-sm"
                  >
                    <CustomSVG id="cancel" />
                </button>
              </div>
            ))}
          </section>
          {/* Tags */}
          <div className={`${colClassName} flex-wrap`}>
            <CustomSVG id="tag" />
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className="flex items-center justify-center px-2 py-1 rounded-2xl bg-zinc-700 bg-opacity-10 text-xs"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleDeleteTag(index)}
                  aria-label={`Remove tag ${tag}`}
                >
                  <CustomSVG id="cancel" size="14" />
                </button>
              </span>
            ))}
            {isNewTagAdded ? (
              <span className="flex items-center self-stretch px-0.5 py-1 my-auto rounded-2xl bg-zinc-700 bg-opacity-10">
                <span className="flex justify-center px-1 my-auto text-xs">
                  <input
                    className="bg-transparent"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    aria-label="New tag input"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    aria-label="Add new tag"
                  >
                    <CustomSVG id="add" size="15" />
                  </button>
                </span>
              </span>
            ) : (
              <button
                onClick={handleNewTag}
                type="button"
                className="flex gap-1.5 items-center tracking-normal leading-none text-black text-opacity-50"
                aria-label="Add new tag"
              >
                <span className="flex items-center self-stretch px-0.5 py-1 my-auto rounded-2xl bg-zinc-700 bg-opacity-10">
                  <span className="flex justify-center px-1 my-auto text-xs">
                    <CustomSVG id="add" size="15" /> 새 태그
                  </span>
                </span>
              </button>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex overflow-hidden flex-wrap gap-2 items-start mt-2 w-full">
            <button
              type="submit"
              className="flex grow shrink justify-center items-start font-medium tracking-wide leading-6 uppercase whitespace-nowrap text-zinc-700 w-[214px]"
              aria-label="Submit task"
              onClick={handleSubmit}
            >
              <span className="flex overflow-hidden flex-col justify-center items-center rounded-lg border border-solid border-zinc-700/50">
                <span className="overflow-hidden px-6 py-1 max-md:px-5">
                  {mode === "edit" ? "수정" : "저장"}
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
