/* eslint-disable react/prop-types */
import InviteModal_orgChart from "./InviteModal_orgChart";
import InviteModal_frequent from "./InviteModal_frequent";
import InviteModal_userSearch from "./InviteModal_userSearch";
import { useState } from "react";
import useOnClickOutSide from "./useOnClickOutSide";
import InviteModal_chatRoomName from "./InviteModal_chatRoomName";

export default function InviteModal(props) {
  const { isOpen, closeHandler, option, optionHandler, inviteRef } = props;
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserUids, setSelectedUserUids] = useState([]);
  const [selectedGroup_Id_Name, setSelectedGroup_Id_Name] = useState({
    group_id: null,
    group_name: null,
  });
  const [userList, setUserList] = useState([]);
  const [userUids, setUserUids] = useState([]);
  const [roomNameModal, setRoomNameModal] = useState(false);

  const addUser = () => {
    setSelectedUsers((prevUsers) => {
      const usersToAdd = users.filter(
        (user) =>
          !prevUsers.some((selectedUser) => selectedUser.uid === user.uid)
      );

      return [...prevUsers, ...usersToAdd];
    });
    setUsers([]);
    setSelectedGroup_Id_Name({ group_id: null, group_name: null });
  };

  const removeUser = (userUid) => {
    setSelectedUsers((prevUsers) =>
      prevUsers.filter((user) => user.uid !== userUid)
    );
    setUserUids((prevUids) => prevUids.filter((uid) => uid !== userUid));
    setSelectedUserUids((prevUids) =>
      prevUids.filter((uid) => uid !== userUid)
    );
    setUsers((prevUsers) => prevUsers.filter((user) => user.uid !== userUid));
  };

  const clearAllUsers = () => {
    setSelectedUsers([]);
    setSelectedGroup_Id_Name({ group_id: null });
    setSelectedUserUids([]);
    setUserUids([]);
  };

  const selectHandler = (e, user_uid) => {
    e.preventDefault();
    if (!e.currentTarget.className.trim().includes("selectedUser")) {
      if (userUids.includes(user_uid)) {
        setUserUids((prevUids) => prevUids.filter((uid) => uid !== user_uid));
      } else {
        setUserUids((prevUids) => [...prevUids, user_uid]);
      }
      setSelectedUserUids([...selectedUserUids, user_uid]);
    } else {
      setUserUids((prevUids) => prevUids.filter((uid) => uid !== user_uid));
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.uid !== user_uid)
      );
      setSelectedUserUids((prevSelectedUids) =>
        prevSelectedUids.filter(
          (prevSelectedUid) => prevSelectedUid !== user_uid
        )
      );
    }
  };
  console.log("userUids:", userUids);
  console.log("selectedUserUids:", selectedUserUids);
  console.log("users:", users);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (selectedUsers && selectedUsers.length > 0) {
      roomNameHandler();
    }
  };

  const roomNameHandler = () => {
    setRoomNameModal(!roomNameModal);
  };

  useOnClickOutSide(inviteRef, closeHandler);

  console.log("selectedUserUids:", selectedUserUids);

  if (!isOpen) return null;
  console.log("selectedUsers :" + JSON.stringify(selectedUsers));

  return (
    <div id="invitation-modal">
      <div className="message-invite-container" ref={inviteRef}>
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
                return (
                  <InviteModal_userSearch
                    users={users}
                    setUsers={setUsers}
                    setSelectedGroup_Id_Name={setSelectedGroup_Id_Name}
                    selectedGroup_Id_Name={selectedGroup_Id_Name}
                    selectedUserUids={selectedUserUids}
                    setSelectedUserUids={setSelectedUserUids}
                    userList={userList}
                    setUserList={setUserList}
                    selectHandler={selectHandler}
                  />
                );
              case 2:
                return (
                  <InviteModal_orgChart
                    users={users}
                    setUsers={setUsers}
                    setSelectedGroup_Id_Name={setSelectedGroup_Id_Name}
                    selectedGroup_Id_Name={selectedGroup_Id_Name}
                    selectedUserUids={selectedUserUids}
                    setSelectedUserUids={setSelectedUserUids}
                    userList={userList}
                    setUserList={setUserList}
                    selectHandler={selectHandler}
                  />
                );
              case 3:
                return (
                  <InviteModal_frequent
                    users={users}
                    setUsers={setUsers}
                    setSelectedGroup_Id_Name={setSelectedGroup_Id_Name}
                    selectedGroup_Id_Name={selectedGroup_Id_Name}
                    selectedUserUids={selectedUserUids}
                    setSelectedUserUids={setSelectedUserUids}
                    userList={userList}
                    setUserList={setUserList}
                    selectHandler={selectHandler}
                  />
                );
              default:
                return null;
            }
          })()}

          <button
            className="addBtn"
            onClick={addUser}
            disabled={users.length === 0}
          >
            <img src="../images/arrowRight.png" alt="" />
          </button>

          <div className="selected-Users-List">
            <div className="selected-title">
              <span>선택한 대상</span>
              <button className="resetBtn" onClick={clearAllUsers}>
                초기화
              </button>
            </div>
            <div className="selected-Users">
              {selectedUsers.map((selectedUser) => (
                <div className="selected-User_cancelBtn" key={selectedUser.id}>
                  <div className="selected-User">
                    <img
                      className="profile"
                      src="../images/sample_item1.jpg"
                      alt=""
                    />
                    <div className="name_dept">
                      <div className="name">{selectedUser.name}</div>
                      <div className="dept">
                        <span>{selectedUser.group}</span>
                      </div>
                    </div>
                  </div>
                  <img
                    className="cancelBtn"
                    src="../images/closeBtn.png"
                    alt=""
                    onClick={() => removeUser(selectedUser.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {roomNameModal == true ? (
          <InviteModal_chatRoomName
            roomNameHandler={roomNameHandler}
            selectedUsers={selectedUsers}
            selectedUserUids={selectedUserUids}
            closeHandler={closeHandler}
          />
        ) : null}

        <div className="confirmBtn_cancelBtn">
          {selectedUsers && selectedUsers.length > 0 ? (
            <button className="confimBtn" onClick={submitHandler}>
              확인
            </button>
          ) : (
            <button
              className="confimBtn"
              onClick={submitHandler}
              disabled
              style={{ backgroundColor: "gray", cursor: "default" }}
            >
              확인
            </button>
          )}
          <button className="cancel-Btn" onClick={closeHandler}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
