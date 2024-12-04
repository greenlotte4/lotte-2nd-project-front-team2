/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axiosInstance from "../../services/axios";
import CustomAlert from "../Alert";

export default function InviteModal_frequent(props) {
  const {
    users,
    setUsers,
    setSelectedGroup_Id_Name,
    selectedGroup_Id_Name,
    selectedUserUids,
    setSelectedUserUids,
    userList,
    setUserList,
    selectHandler,
  } = props;

  const [userUids, setUserUids] = useState([]);
  const [frequentList, setFrequentList] = useState([]);
  const [uid, setUid] = useState(() => localStorage.getItem("uid"));
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: memberData,
    isLoading: isMemberLoading,
    error: memberError,
  } = useQuery({
    queryKey: ["get-frequentMembers", setIsOpen],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/message/member/${uid}`);
      setFrequentList(response.data.frequent_members);

      return response.data;
    },
  });

  const setUsersHandler = (frequent) => {
    if (!users.includes(frequent)) {
      setUsers([...users, frequent]);
    }
  };

  const favoriteSetHandler = async (e, frequent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const resp = await axiosInstance.patch(
        "/api/message/frequentMembers",
        {},
        {
          params: {
            uid: uid,
            frequentUid: frequent.uid,
          },
        }
      );

      console.log("respData:", resp.data);

      setType(resp.data);
      if (resp.data === "success") {
        setMessage("즐겨찾기에서 제거하였습니다.");
        setFrequentList((prevList) =>
          prevList.filter((prev) => prev !== frequent)
        );
      } else {
        setMessage("즐겨찾기 제거 실패!");
      }
      setIsOpen(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 1500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="inviteLeftBox">
      <span>즐겨찾기</span>

      <div className="orgs-Users-List frequent-List">
        {frequentList && frequentList.length > 0
          ? frequentList.map((frequent) => (
              <div
                className={`orgs-User ${
                  selectedUserUids.some(
                    (selectedUserUid) => selectedUserUid === frequent.uid
                  )
                    ? "selectedUser"
                    : ""
                }`}
                onClick={(e) => {
                  selectHandler(e, frequent.uid), setUsersHandler(frequent);
                }}
                key={frequent.uid}
              >
                <img
                  className="profile"
                  src="../images/sample_item1.jpg"
                  alt=""
                />
                <div className="name_dept">
                  <div className="name">{frequent.name}</div>
                  <div className="dept">
                    <span>{frequent.group}</span>
                  </div>
                </div>
                <img
                  src="/images/closeBtn.png"
                  alt=""
                  className="cancelBtn"
                  onClick={(e) => favoriteSetHandler(e, frequent)}
                />
              </div>
            ))
          : null}
        <CustomAlert type={type} message={message} isOpen={isOpen} />
      </div>
    </div>
  );
}
