/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { CustomSVG } from "./CustomSVG";

export const TaskCard = ({ title, content, priority, status, duedate, subTasks=[], checked=0, tags=[], commentsList=[] }) => {

   
  return (
    <article className="flex gap-2 items-start p-3 mt-2 w-full bg-white rounded-lg border border-solid shadow-sm border-black border-opacity-10">
      <div className="flex flex-col flex-1 shrink w-full basis-0">
        <div className="flex justify-between items-start py-px pl-1.5 w-full">
            <h3 className="py-0.5 w-auto">{title}</h3>
            <CustomSVG id={'p'+priority} />
        </div>
        {content&&
        <section className="flex gap-1.5 items-start pt-1.5 mt-1.5 max-w-full rounded-lg w-[231px]">
            <div className="flex flex-col justify-center items-start pr-1">
                <CustomSVG id="subject" color="#00000050" />
            </div>
            <p className="flex flex-col flex-1 shrink w-full text-sm leading-4 basis-0 text-black text-opacity-50">
                <span className="gap-2 w-full">{content}</span>
            </p>
        </section>
}
        <section className="flex flex-col mt-1.5 w-full">
            {subTasks.map((subTask)=>(
                <div className="flex gap-1.5 items-center w-full h-[22px]" key={subTask.id}>
                    <div className="flex items-end self-stretch py-0.5 my-auto w-5">
                        {subTask.isChecked?(<CustomSVG id="checkbox-checked" color="#A2A2E6" />)
                        :(<CustomSVG id="checkbox" color="#8A8AE2" />)}
                    </div>
                    <div className="flex flex-1 shrink gap-1.5 items-center self-stretch my-auto leading-6 basis-0 text-neutral-500">
                        <p className="self-stretch my-auto">{subTask.name}</p>
                        <div className="flex shrink-0 self-stretch my-auto w-4 h-5" />
                    </div>
                </div>
            ))}
            
            <button className="flex overflow-hidden gap-1.5 justify-center items-center py-1.5 mt-2 w-full text-sm tracking-normal leading-none rounded-lg bg-gray-600 bg-opacity-10 text-gray-600 text-opacity-60">
                <CustomSVG id="add-checkbox" />
                <span className="self-stretch my-auto">{checked}/{subTasks.length} 새 하위 목표 생성</span>
            </button>
        </section>
        {tags.length>0 &&
            <section className="flex overflow-hidden flex-wrap gap-2.5 items-start mt-1.5 w-full text-xs leading-none text-black text-opacity-50">
                <div className="flex flex-wrap flex-1 shrink gap-1.5 items-center pt-1.5 w-full basis-0">
                <CustomSVG id="tag" />
                {tags.map((tag, index) => (
                    <div key={index} className="flex items-center self-stretch p-0.5 my-auto leading-none rounded-2xl bg-zinc-700 bg-opacity-10 text-black text-opacity-50">
                    <div className="self-stretch px-1.5 py-1 my-auto">{tag}</div>
                    </div>
                ))}
                </div>
            </section>
        }
        <section className="flex overflow-hidden flex-wrap gap-2 items-start mt-1.5 w-full text-sm tracking-normal leading-none text-gray-600 text-opacity-60">
            {duedate && 
            <div className="flex flex-1 shrink gap-1.5 items-center pt-1.5 whitespace-nowrap basis-5">
                <CustomSVG id="calendar" />
                <time className="self-stretch my-auto">{duedate}</time>
            </div>
            }
            <div className="flex gap-1.5 items-center pt-1.5 min-h-[25px] w-[232px]">
                <CustomSVG id="comment" />
                <span className="self-stretch my-auto">의견 {commentsList.length}</span>
            </div>
            {commentsList?.map((comment)=>(
                <article className="flex gap-1.5 items-start leading-4 w-[232px]" key={comment.id}>
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/5005caf306e020a63875ae89317ed34981ec083804afbfa938c3ea7760d10078?placeholderIfAbsent=true&apiKey=64129ff822ae4d01a6810b1149e35589"
                        alt=""
                        className="object-contain shrink-0 w-5 aspect-square min-h-[20px]"
                    />
                    <div className="flex-1 shrink basis-0">
                        <span className="text-gray-600">{comment.user}</span>
                        <time className="text-gray-600"> {comment.rdate}</time>
                        <p>{comment.content}</p>
                    </div>
                </article>
            ))}
            
            <form className="flex gap-1.5 items-center px-2.5 py-1 rounded-lg bg-gray-600 bg-opacity-10 min-h-[25px] w-[232px]">
                <CustomSVG id="reply" />
                <input
                    type="text"
                    placeholder="의견 작성하기"
                    className="self-stretch my-auto w-[185px] bg-transparent border-none outline-none"
                    aria-label="의견 작성하기"
                />
            </form>
        </section>
        <section className="flex gap-1.5 justify-center items-start pt-2.5 mt-1.5 w-full text-sm font-medium tracking-wide leading-6 uppercase whitespace-nowrap text-slate-500">
            <button className="flex overflow-hidden flex-col justify-center items-center rounded-lg border border-solid border-slate-500 border-opacity-50">
            <span className="overflow-hidden px-6 py-1 max-md:px-5">수정</span>
            </button>
            <button className="flex overflow-hidden flex-col justify-center items-center rounded-lg">
            <span className="overflow-hidden px-4 py-1">삭제</span>
            </button>
        </section>
      </div>
    </article>
  );
}