import React from "react";

export default function CommunityCard() {
  return (
    <div className="communityCard flex flex-col items-center p-4 w-[300px] h-[200px] border bg-white ">
      <div className="title_link flex flex-row justify-between">
        <span className="title">공지사항</span>
        <img src="" alt="" className="linkImg" />
      </div>
      <div className="communityCardcontent w-300px h-300px">
        <span className="">공지사항입니다</span>
      </div>
    </div>
  );
}
