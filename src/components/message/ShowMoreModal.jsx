export default function ShowMoreModal() {
  return (
    <div className="viewMore">
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
      <div className="exitFn">
        <img src="/images/message-exit.png" alt="" className="exitFnImg" />
        <span>대화방 나가기</span>
      </div>
    </div>
  );
}
