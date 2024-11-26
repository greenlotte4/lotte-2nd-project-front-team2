import InviteModal_orgChart from "./InviteModal_orgChart";
import InviteModal_frequent from "./InviteModal_frequent";
import InviteModal_userSearch from "./InviteModal_userSearch";

export default function InviteModal(props) {
  const {
    isOpen,
    closeHandler,
    option,
    optionHandler,
    selectedUsers,
    addUser,
    removeUser,
    clearAllUsers,
  } = props;
  if (!isOpen) return null;

  return (
    <div id="invitation-modal">
      <div className="message-invite-container">
        <div className="title_closeBtn">
          <span>대화상대 초대</span>
          <img
            className="closeBtn"
            src="../images/closeBtn.png"
            alt=""
            onClick={closeHandler}
          />
        </div>

        <div className="options">
          <div
            className={
              option === 1 ? "userSearch selected-option" : "userSearch"
            }
            onClick={optionHandler}
          >
            사용자 검색
          </div>
          <div
            className={option === 2 ? "orgChart selected-option" : "orgChart"}
            onClick={optionHandler}
          >
            조직도
          </div>
          <div
            className={option === 3 ? "frequent selected-option" : "frequent"}
            onClick={optionHandler}
          >
            즐겨찾기
          </div>
        </div>

        <div className="list_add">
          {(() => {
            switch (option) {
              case 1:
                return <InviteModal_userSearch selectedUsers={selectedUsers} />;
              case 2:
                return <InviteModal_orgChart selectedUsers={selectedUsers} />;
              case 3:
                return <InviteModal_frequent selectedUsers={selectedUsers} />;
              default:
                return null;
            }
          })()}

          <button className="addBtn" onClick={null}>
            <img src="../images/arrowRight.png" alt="" />
          </button>

          <div className="selected-Users-List">
            <div className="selected-title">
              <span>선택한 대상</span>
              <button className="resetBtn" onClick={null}>
                초기화
              </button>
            </div>
            <div className="selected-Users" ref={selectedUsers}>
              <div className="selected-User_cancelBtn">
                <div className="selected-User">
                  <img
                    className="profile"
                    src="../images/sample_item1.jpg"
                    alt=""
                  />
                  <div className="name_dept">
                    <div className="name">김규찬</div>
                    <div className="dept">
                      <span>인사팀</span>
                    </div>
                  </div>
                </div>
                <img
                  className="cancelBtn"
                  src="../images/closeBtn.png"
                  alt=""
                  onClick={null}
                />
              </div>
              <div className="selected-User_cancelBtn">
                <div className="selected-User">
                  <img
                    className="profile"
                    src="../images/sample_item1.jpg"
                    alt=""
                  />
                  <div className="name_dept">
                    <div className="name">김규찬</div>
                    <div className="dept">
                      <span>인사팀</span>
                    </div>
                  </div>
                </div>
                <img
                  className="cancelBtn"
                  src="../images/closeBtn.png"
                  alt=""
                  onClick={null}
                />
              </div>
              <div className="selected-User_cancelBtn">
                <div className="selected-User">
                  <img
                    className="profile"
                    src="../images/sample_item1.jpg"
                    alt=""
                  />
                  <div className="name_dept">
                    <div className="name">김규찬</div>
                    <div className="dept">
                      <span>인사팀</span>
                    </div>
                  </div>
                </div>
                <img
                  className="cancelBtn"
                  src="../images/closeBtn.png"
                  alt=""
                  onClick={null}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="confirmBtn_cancelBtn">
          <button className="confimBtn">확인</button>
          <button className="cancel-Btn" onClick={closeHandler}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}