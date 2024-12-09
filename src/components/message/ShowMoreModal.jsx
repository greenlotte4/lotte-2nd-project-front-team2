/* eslint-disable react/prop-types */
import { useState } from "react";
import axiosInstance from "../../services/axios";
import CustomAlert from "../Alert";
import useOnClickOutSide from "./useOnClickOutSide";

export default function ShowMoreModal({
  moreFnHandler,
  showMoreRef,
  uid,
  selectedRoomId,
}) {
  const [isOpen, setIsOpen] = useState();
  useOnClickOutSide(showMoreRef, moreFnHandler);

  const exitHandler = (e) => {
    e.preventDefault();
    const confirmQuit = confirm("정말 나가시겠습니까?");
    if (confirmQuit) {
      try {
        axiosInstance
          .delete("/api/message/quitRoom", {
            params: {
              uid,
              selectedRoomId,
            },
          })
          .then(() => {
            setIsOpen(true);
            setTimeout(() => {
              setIsOpen(false);
            }, 1500);
          });
      } catch (error) {
        console.error(error);
      }
    } else {
      return;
    }
  };

  return (
    <div className="viewMore" ref={showMoreRef}>
      <div className="inviteFn">
        <img src="/images/message-invite.png" alt="" className="inviteFnImg" />
        <span>대화상대 초대</span>
      </div>
      <div className="nameChangeFn">
        <img
          src="/images/message-changeName.png"
          alt=""
          className="nameChangeFnImg"
        />
        <span>대화방 이름 변경</span>
      </div>
      <div className="fileListFn">
        <img src="/images/fileIcon.png" alt="" className="fileListFnImg" />
        <span>첨부 파일 목록</span>
      </div>
      <div className="exitFn" onClick={exitHandler}>
        <img src="/images/message-exit.png" alt="" className="exitFnImg" />
        <span>대화방 나가기</span>
      </div>
      <CustomAlert
        type={"success"}
        message={"대화방을 나왔습니다."}
        isOpen={isOpen}
      />
    </div>
  );
}
