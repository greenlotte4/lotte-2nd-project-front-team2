/* eslint-disable react/prop-types */
import InviteModal_orgChart from "./InviteModal_orgChart";
import InviteModal_frequent from "./InviteModal_frequent";
import InviteModal_userSearch from "./InviteModal_userSearch";
import { useRef, useState } from "react";
import axiosInstance from "../../services/axios";
import useOnClickOutSide from "./useOnClickOutSide";

export default function InviteModal(props) {
  const { isOpen, closeHandler, option, optionHandler, inviteRef } = props;
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectedGroup_Id_Name, setSelectedGroup_Id_Name] = useState({
    group_id: null,
    group_name: null,
  });
  const [userList, setUserList] = useState([]);
  const [userIds, setUserIds] = useState([]);

  const addUser = () => {
    setSelectedUsers((prevUsers) => {
      const usersToAdd = users.filter(
        (user) => !prevUsers.some((selectedUser) => selectedUser.id === user.id)
      );

      return [...prevUsers, ...usersToAdd];
    });
    setUsers([]);
    setSelectedGroup_Id_Name({ group_id: null, group_name: null });
    setSelectedUserIds([]);
  };

  const removeUser = (userId) => {
    setSelectedUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== userId)
    );
    setUserIds((prevIds) => prevIds.filter((id) => id !== userId));
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  const clearAllUsers = () => {
    setSelectedUsers([]);
    setSelectedGroup_Id_Name({ group_id: null });
    setSelectedUserIds([]);
    setUserIds([]);
  };

  const selectHandler = (e, user_Id) => {
    e.preventDefault();
    if (!e.currentTarget.className.trim().includes("selectedUser")) {
      if (userIds.includes(user_Id)) {
        setUserIds((prevIds) => prevIds.filter((id) => id !== user_Id));
      } else {
        setUserIds((prevIds) => [...prevIds, user_Id]);
      }
      setSelectedUserIds([...selectedUserIds, user_Id]);
    } else {
      setUserIds((prevIds) => prevIds.filter((id) => id !== user_Id));
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.user_id !== user_Id)
      );
      setSelectedUserIds((prevSelectedIds) =>
        prevSelectedIds.filter((prevSelectedId) => prevSelectedId !== user_Id)
      );
    }
  };

  const formdata = new FormData();
  formdata.append("chatMembers", JSON.stringify(selectedUsers));
  for (let pair of formdata.entries()) {
    console.log(pair[0] + ": " + pair[1]);
  }

  const submitHandler = () => {
    axiosInstance
      .post("/api/message/room", formdata, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((resp) => console.log(JSON.stringify(resp.data)))
      .catch((err) => console.log(err));
  };

  useOnClickOutSide(inviteRef, closeHandler);

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
                    selectedUserIds={selectedUserIds}
                    setSelectedUserIds={setSelectedUserIds}
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
                    selectedUserIds={selectedUserIds}
                    setSelectedUserIds={setSelectedUserIds}
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
                    selectedUserIds={selectedUserIds}
                    setSelectedUserIds={setSelectedUserIds}
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

        <div className="confirmBtn_cancelBtn">
          <button className="confimBtn" onClick={submitHandler}>
            확인
          </button>
          <button className="cancel-Btn" onClick={closeHandler}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
