/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { CustomSVG } from "./project/_CustomSVG";

const ShareMember = ({ members = [], maxNum="3", listName="참여자", children , isShareOpen, setIsShareOpen}) => {
  
  const [isMembersDropdownOpen, setIsMembersDropdownOpen] = useState(false); // 참가자 드롭다운 상태

  const toggleShare = () => {setIsShareOpen((prev) => !prev);};
  const toggleMembersDropdown = () => {setIsMembersDropdownOpen((prev) => !prev);};

  const [tooltip, setTooltip] = useState({ visible: false, name: "", x: 0, y: 0 });

  const handleMouseEnter = (e, index, name) => {
    let x= 120;
    if(maxNum >= members.length){x -= 28*(members.length-index-1)}
    else{x -= 28*(maxNum-index);}
    let y = 40;
    setTooltip({ visible: true, name, x, y });
  };
  const handleMouseLeave = () => {setTooltip({ visible: false, name: "", x: 0, y: 0 });};

  // 다른 곳 클릭 시 창 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".relative")) {
        setIsMembersDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);


  return (
    <div className="relative flex justify-end pr-6">
      {/* 버튼 및 프로필 섹션 */}
      <nav className="flex z-10 gap-2 items-start self-end mt-0 rounded-3xl max-md:mr-2 px-3">
        <div className="flex items-center space-x-2">
          {/* 프로필 사진 표시 */}
          <div className="relative flex items-center">
            {members.slice(0, maxNum).map((member, index) => (
              <img key={member.id} src={member.img||"/images/document-folder-profile.png"} alt={member.name}
                className="w-10 h-10 rounded-full border-2 border-white -ml-3 first:ml-0"
                style={{zIndex: maxNum - index,}}
                onMouseEnter={(e) => handleMouseEnter(e, index, member.name)} // 툴팁 표시
                onMouseLeave={handleMouseLeave} // 툴팁 숨기기
              />
            ))}
            
            {members.length > maxNum && (
              <div
                onClick={toggleMembersDropdown} title="모두 보기"
                className="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-700 rounded-full border-2 border-white -ml-3 select-none cursor-pointer font-semibold text-sm z-0"
              >
                +{members.length - maxNum}
              </div>
            )}
          </div>
        </div>
        {/* 공유 버튼 */}
        <button
          onClick={toggleShare} title={listName+' 초대'}
          className="flex gap-2.5 justify-center items-center px-2 w-10 h-10 bg-white border-2 border-gray-100 border-dashed min-h-[40px] rounded-[48px]"
        >
          <CustomSVG id="group-add" />
        </button>
      </nav>
      {tooltip.visible && (
        <div style={{ top: `${tooltip.y}px`, left: `${tooltip.x}px` }} className="absolute bg-black opacity-70 text-white text-sm rounded px-2 py-1 shadow-sm tooltip transform -translate-x-1/2 max-w-[150px] whitespace-nowrap z-20">
          {tooltip.name}
        </div>
      )}
      
      {/* 참가자 목록 드롭다운 */}
      {isMembersDropdownOpen && (
        <div className="absolute top-full left-12 z-20 bg-white border rounded shadow-sm p-4 w-48 ">
          <h3 className="text-sm font-semibold mb-2">{listName} 목록 ({members.length})</h3>
          <ul className="space-y-2 max-h-[300px] scrollbar-none overflow-auto">
            {members.map((member) => (
              <li key={member.id} className="flex items-center gap-2 text-sm text-gray-700">
                <img src={member.img} alt={member.name} className="w-6 h-6 rounded-full"/>
                <span>{member.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 공유 메뉴 */}
      {isShareOpen && (<>{children}</>)}
    </div>
  );
};

export default ShareMember;