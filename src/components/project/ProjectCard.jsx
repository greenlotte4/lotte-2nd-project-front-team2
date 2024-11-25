import { CustomSVG } from "./CustomSVG";

/* eslint-disable react/prop-types */
export const ProjectCard = ({ title, content, priority, status, duedate, subTasks, checked, tags, commentsList }) => {
  let color = "#00000050";
  if(priority<2){color = "#EC6240";}
  else if(priority===2){color = "#F3AF3D";}
  else if(priority>2){color = "#2A63F6";}
    return (
      <div className="flex gap-2 items-start p-3 mt-2 w-full bg-white rounded-lg border border-solid shadow-sm border-black border-opacity-10">
        {status?(
          <div className={`flex flex-col justify-center items-center px-0.5 py-px w-6 text-lg leading-none ${status === 'active' ? 'text-amber-500' : status === 'completed' ? 'text-rose-500' : 'text-black'} whitespace-nowrap min-h-[24px]`}>
         
            <CustomSVG id={status==='active'?'circle-unchecked':status==='completed'?'circle-checked-filled':'circle-checked'} color={color}/> 
            </div>
        ):(<></>)}
        
        <div className="flex flex-col flex-1 shrink basis-0 text-black text-opacity-50">
          <div className="text-sm leading-4 min-h-[24px] ">{title}</div>
          {content && (
            <div className={`${status&&
              'max-w-[210px]'||'max-w-[220px]'} leading-3 whitespace-nowrap text-ellipsis overflow-hidden`}>{content}</div>
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
          {tags&&
          <div className="flex gap-1 items-center whitespace-nowrap pt-2 ">
            <CustomSVG id="tag"/>
            <div className="self-stretch my-auto text-ellipsis">{tags[0]}{tags.length>1&&` + ${tags.length-1}`}</div>
          </div>}  
        </div>
      </div>
    );
  };