/* eslint-disable react/prop-types */
import { CustomSVG } from "./CustomSVG";

export const ProjectTaskDynamic = ({
  isSelected,
  title,
  content,
  priority,
  status,
  duedate,
  subTasks = [],
  checked = 0,
  tags = [],
  commentsList = [],
  handleToggle,
}) => {
  const getPriorityColor = () => {
    if (priority < 2) return "#EC6240";
    if (priority > 2) return "#2A63F6";
    if (priority === 2) return "#F3AF3D";
    return "#00000050";
  };

  const color = getPriorityColor();

  return (
    <div className="flex gap-2 p-3 mt-2 w-full bg-white rounded-lg border shadow-sm border-black/10" onClick={handleToggle}>
      

        {/* Conditionally Render Content */}
        {isSelected ? (
          <div className="flex flex-col flex-1 w-full">
          {/* Title and Priority */}
          <div className="flex justify-between items-start py-px pl-1.5">
            <h3>{title}</h3>
            <CustomSVG id={`p${priority}`} color={color} />
          </div>
            {/* Content Section */}
            {content && (
              <section className="flex gap-1.5 items-start pt-1.5">
                <CustomSVG id="subject" color="#00000050" />
                <p className="flex-1 text-sm text-black/50">{content}</p>
              </section>
            )}

            {/* Subtasks Section */}
            <section className="flex flex-col mt-1.5">
              {subTasks.map((subTask) => (
                <div
                  className="flex items-center gap-1.5 h-[22px]"
                  key={subTask.id}
                >
                  <CustomSVG
                    id={subTask.isChecked ? "checkbox-checked" : "checkbox"}
                    color={subTask.isChecked ? "#A2A2E6" : "#8A8AE2"}
                  />
                  <p className="flex-1 text-neutral-500">{subTask.name}</p>
                </div>
              ))}
              <button className="flex items-center justify-center gap-1.5 py-1.5 mt-2 text-sm rounded-lg bg-gray-600/10 text-gray-600/60">
                <CustomSVG id="add-checkbox" />
                <span>
                  {checked}/{subTasks.length} 새 하위 목표 생성
                </span>
              </button>
            </section>

            {/* Tags Section */}
            {tags.length > 0 && (
              <section className="flex flex-wrap gap-2 mt-1.5 text-xs text-black/50">
                <CustomSVG id="tag" />
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="px-2 py-1 rounded-2xl bg-zinc-700/10 text-xs"
                  >
                    {tag}
                  </div>
                ))}
              </section>
            )}

            {/* Due Date and Comments Section */}
            <section className="flex flex-wrap gap-2 mt-1.5 text-sm text-gray-600/60">
              {duedate && (
                <div className="flex items-center gap-1.5 w-[232px]">
                  <CustomSVG id="calendar" />
                  <time>{duedate}</time>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <CustomSVG id="comment" />
                <span>의견 {commentsList.length}</span>
              </div>
              {commentsList.map((comment) => (
                <article
                  className="flex gap-1.5 items-start w-[232px] text-sm"
                  key={comment.id}
                >
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/5005caf306e020a63875ae89317ed34981ec083804afbfa938c3ea7760d10078"
                    alt=""
                    className="w-5 h-5 rounded-full"
                  />
                  <div className="flex-1">
                    <span className="text-gray-600">{comment.user}</span>
                    <time className="text-gray-600"> {comment.rdate}</time>
                    <p>{comment.content}</p>
                  </div>
                </article>
              ))}
              <form className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-600/10">
                <CustomSVG id="reply" />
                <input
                  type="text"
                  placeholder="의견 작성하기"
                  className="w-full bg-transparent outline-none"
                  aria-label="의견 작성하기"
                />
              </form>
            </section>

            {/* Action Buttons */}
            <section className="flex justify-center gap-1.5 mt-1.5 text-sm text-slate-500">
              <button className="px-6 py-1 border rounded-lg border-slate-500/50">
                수정
              </button>
              <button className="px-4 py-1 border rounded-lg border-transparent">
                삭제
              </button>
            </section>
          </div>
        ) : (
          <>
           {status != null &&
              <div className={'flex flex-col justify-start items-center px-0.5 py-px w-6 text-lg leading-none whitespace-nowrap min-h-[24px]'}>
                <CustomSVG id={status==='active'?'circle-unchecked':status==='completed'?'circle-checked-filled':'circle-checked'} color={color}/> 
              </div>
            }
            
            <div className="flex flex-col flex-1 shrink basis-0 text-black text-opacity-50">
              <div className="text-sm leading-4 min-h-[24px] ">{title}</div>
              {content && (
                <div className={`${status&&
                  'max-w-[200px]'||'max-w-[220px]'} leading-4 whitespace-nowrap text-ellipsis overflow-hidden`}>{content}</div>
              )}
              {subTasks && duedate &&commentsList && 
                <div className="flex flex-wrap gap-2 items-start pt-3 w-full text-xs leading-none">
                  {subTasks && 
                    <div className="flex gap-1 items-center whitespace-nowrap">
                      <CustomSVG id="add-checkbox" />
                      <div className="self-stretch my-auto text-ellipsis">{checked}/{subTasks.length}</div>
                    </div>
                  }
                  {duedate && 
                    <div className="flex gap-1 items-center whitespace-nowrap">
                      <CustomSVG id="calendar" />
                      <div className="self-stretch my-auto text-ellipsis">{duedate}</div>
                    </div>
                  }
                  {commentsList && 
                    <div className="flex gap-1 items-center whitespace-nowrap">
                      <CustomSVG id="comment"/>
                      <div className="self-stretch my-auto text-ellipsis">{commentsList.length}</div>
                    </div>
                  }
                </div>
              }
              {/* Tags */}
              {tags.length>0 && (
                <div className="flex items-center gap-1 pt-2 text-sm">
                  <CustomSVG id="tag" />
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
  )
}
