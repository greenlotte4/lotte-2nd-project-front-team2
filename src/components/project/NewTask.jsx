import { useState } from "react";
import { CustomSVG } from "./CustomSVG";

function NewTask({ setIsAdded }) {

    const handleClose = () => {
        setIsAdded(false); // 컴포넌트를 닫을 때 상태를 false로 설정
      };

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedPriority, setSelectedPriority] = useState({ id: "none", label: "None", icon: null });
    const [isNewTagAdded, setIsNewTagAdded] = useState(false);
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const handleAddTag = () => {
        if (newTag.trim() === '') return;  // 빈 태그를 추가하지 않도록 처리
    
        // 새로운 태그 추가
        setTags((prevTags) => [...prevTags, newTag]);
        setNewTag('');  // 추가 후 input 비우기
        setIsNewTagAdded(false); // input 비활성화
    };
    const handleDeleteTag = (index) => {
        setTags((prevTags) => prevTags.filter((_, i) => i !== index));
    };
    const handleTagInputChange = (e) => {
        setNewTag(e.target.value);
    };

    const handleNewTag = () => { // 추가된 컴포넌트가 없을 경우에만 추가
      if (!isNewTagAdded) {setIsNewTagAdded(true);}
    };
    const priorities = [
        { id: "none", label: "None", icon: null },
        { id: "p0", icon: "p0", label: "P0 - 아주 높음" },
        { id: "p1", icon: "p1", label: "P1 - 높음"},
        { id: "p2", icon: "p2", label: "P2 - 보통"},
        { id: "p3", icon: "p3", label: "P3 - 낮음"},
        { id: "p4", icon: "p4", label: "P4 - 아주 낮음"},
    ];

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handlePrioritySelect = (priority) => {
        setSelectedPriority(priority);
        setIsDropdownOpen(false); // 드롭다운 닫기
    };
    const colClassName="flex gap-1.5 items-start pt-1.5 mt-1.5 max-w-full tracking-normal leading-none rounded-lg min-h-[26px] text-gray-600 text-opacity-60 w-[231px]"
    return (
        <form className="flex flex-col mt-3 w-full text-sm relative">
        <div className="flex gap-2 items-start p-3 pt-2 w-full bg-white rounded-lg border border-solid shadow-sm border-black border-opacity-10">
            <div className="flex flex-col flex-1 shrink w-full basis-0">
            {/* Task Name */}
            <label htmlFor="taskName" className="sr-only">Task name</label>
            <div className="flex items-center justify-between">
                <input
                    autoFocus
                    id="taskName"
                    type="text"
                    placeholder="이름을 입력하세요"
                    className="flex flex-col max-w-full tracking-normal leading-6 rounded-lg min-h-[26px] text-gray-600 text-opacity-60 w-[198px]"
                />
                <button onClick={handleClose}>
                    <CustomSVG id="close" />
                </button>
                
            </div>

            {/* Priority Dropdown */}
            <div className={colClassName}>
                <CustomSVG id={selectedPriority.label === "None" ? "bar-chart" : selectedPriority.icon} />
                <button
                type="button"
                className="flex flex-col flex-1 shrink basis-0 text-sm"
                onClick={toggleDropdown}
                >
                {selectedPriority.label === "None" ? "중요도 선택" : selectedPriority.label}
                </button>
            {isDropdownOpen && (
              <div className="absolute mt-1 w-36 py-2 bg-white border rounded shadow-md z-30">
                {priorities.map((priority) => (
                  <div
                    key={priority.id}
                    className={`flex items-center gap-2 px-3 h-6 text-xs hover:bg-gray-100 cursor-pointer ${priority.color}`}
                    onClick={() => handlePrioritySelect(priority)}
                  >
                    <CustomSVG id={priority.icon} />
                    <span>{priority.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Task Details */}
          <div className={colClassName}>
            <CustomSVG id="post-add" />
            <label htmlFor="taskDetails" className="sr-only">Task details</label>
            <input
              id="taskDetails"
              type="text"
              placeholder="세부 내용 입력"
              className="flex flex-col flex-1 shrink basis-0"
            />
          </div>
          <div className={colClassName}>
          <CustomSVG id="calendar" />
          <label className="date-input-container relative" for="taskDetails">
            <input id="taskDetails" type="date" placeholder="일정 추가" min="2020-01-01" max="9999-12-31"/>
          </label>
          </div>

          {/* Submit Button */}
          
          <div className={colClassName+' flex-wrap'}>
            <CustomSVG id="tag" />
            {tags.map((tag, index) => (
                <span key={index} className="flex items-center justify-center px-2 py-1 rounded-2xl bg-zinc-700 bg-opacity-10 text-xs">
                    {tag}
                    <button
                    onClick={() => handleDeleteTag(index)}
                    >
                    <CustomSVG id="cancel" size="14" />
                    </button>
                </span>
            ))}
            {isNewTagAdded?(
                <span className="flex items-center self-stretch px-0.5 py-1 my-auto rounded-2xl bg-zinc-700 bg-opacity-10">
                    <span className="flex justify-center px-1 my-auto text-xs">
                        <input className="bg-transparent" value={newTag} onChange={handleTagInputChange}/>
                        <button type="button" onClick={handleAddTag}>
                            <CustomSVG id="add" size="15" />
                        </button>
                    </span>
                </span>):(
                    <button
                    onClick={handleNewTag}
                    type="button"
                    className="flex gap-1.5 items-center tracking-normal leading-none text-black text-opacity-50"
                >
                    <span className="flex items-center self-stretch px-0.5 py-1 my-auto rounded-2xl bg-zinc-700 bg-opacity-10">
                        <span className="flex justify-center px-1 my-auto text-xs">
                        <CustomSVG id="add" size="15" />새 태그
                        </span>
                    </span>
                </button>
                )}
            
        </div>

        <div className="flex overflow-hidden flex-wrap gap-2 items-start mt-2 w-full">
            <button
              type="submit"
              className="flex grow shrink justify-center items-start font-medium tracking-wide leading-6 uppercase whitespace-nowrap text-zinc-700 w-[214px]"
            >
              <span className="flex overflow-hidden flex-col justify-center items-center rounded-lg border border-solid border-zinc-700 border-opacity-50">
                <span className="overflow-hidden px-6 py-1 max-md:px-5">생성</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default NewTask;
