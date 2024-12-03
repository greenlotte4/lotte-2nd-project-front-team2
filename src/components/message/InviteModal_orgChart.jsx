/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../services/axios";
import { useQuery } from "@tanstack/react-query";
import { getDeptsAndTeams } from "./Message_API";

export default function InviteModal_orgChart({
  users,
  setUsers,
  setSelectedGroup_Id_Name,
  selectedGroup_Id_Name,
  selectedUserUids,
  setSelectedUserUids,
  userList,
  setUserList,
  selectHandler,
}) {
  const [userUids, setUserUids] = useState([]);

  const [depts, setDepts] = useState([]);
  const [teams, setTeams] = useState([]);

  const handleGroupClick = (group_Id, group_Name) => {
    setSelectedGroup_Id_Name((prev) => ({
      ...prev,
      group_id: group_Id,
      group_name: group_Name,
    }));
  };

  const {
    isLoading,
    data: groupMembersData,
    isError,
    error,
  } = useQuery({
    queryKey: ["get-groupMembers", selectedGroup_Id_Name.group_name],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/group/users", {
        params: {
          team: selectedGroup_Id_Name.group_name,
        },
      });

      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!selectedGroup_Id_Name.group_name, // group_name이 존재할 때만 실행
  });

  console.log("members:", JSON.stringify(groupMembersData));

  const [showList, setShowList] = useState({
    type1: false,
    type2: false,
    arrow1: "/images/arrow-down.png",
    arrow2: "/images/arrow-down.png",
  });

  const type1Handler = (e) => {
    e.preventDefault();
    if (showList.type1 == false) {
      setShowList((prev) => ({
        ...prev,
        type1: true,
        arrow1: "/images/arrow-up.png",
      }));
    } else {
      setShowList((prev) => ({
        ...prev,
        type1: false,
        arrow1: "/images/arrow-down.png",
      }));
    }
  };
  const type2Handler = (e) => {
    e.preventDefault();
    if (showList.type2 == false) {
      setShowList((prev) => ({
        ...prev,
        type2: true,
        arrow2: "/images/arrow-up.png",
      }));
    } else {
      setShowList((prev) => ({
        ...prev,
        type2: false,
        arrow2: "/images/arrow-down.png",
      }));
    }
  };

  useEffect(() => {
    getDeptsAndTeams()
      .then((resp) => {
        setDepts(resp.departments);
        setTeams(resp.teams);
      })
      .catch((err) => console.log(err));
  }, []);

  const setUsersHandler = (member) => {
    if (!users.includes(member)) {
      setUsers([...users, member]);
    }
  };

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="inviteLeftBox">
      <span>조직도 목록</span>

      <div className="allOrgs">
        <div className="groupsDiv">
          <div className="groups" onClick={type1Handler}>
            <img className="upDownIcon" src={showList.arrow1} alt="" />
            <img className="representIcon" src="../images/group.jpg" alt="" />
            <span className="groupName selected-group">부서 목록</span>
          </div>
          {/* 부서 목록 출력 */}
          {depts && showList.type1 == true
            ? depts.map((dept) => (
                <div
                  className={`departments ${
                    selectedGroup_Id_Name.group_id === dept.id
                      ? "selected-dept"
                      : ""
                  }`}
                  onClick={() => handleGroupClick(dept.id, dept.name)}
                  key={dept.id}
                >
                  <img
                    className="representIcon"
                    src="/images/deptartment.jpg"
                    alt=""
                  />
                  <span className="groupName">{dept.name}</span>
                </div>
              ))
            : null}

          <div className="groups" onClick={type2Handler}>
            <img className="upDownIcon" src={showList.arrow2} alt="" />
            <img className="representIcon" src="../images/group.jpg" alt="" />
            <span className="groupName selected-group">팀 목록</span>
          </div>
          {/* 팀 목록 출력 */}
          {teams && showList.type2 == true
            ? teams.map((team) => (
                <div
                  className={`departments ${
                    selectedGroup_Id_Name.group_id === team.id
                      ? "selected-dept"
                      : ""
                  }`}
                  onClick={() => handleGroupClick(team.id, team.name)}
                  key={team.id}
                >
                  <img
                    className="representIcon"
                    src="../images/deptartment.jpg"
                    alt=""
                  />
                  <span className="groupName">{team.name}</span>
                </div>
              ))
            : null}
        </div>
      </div>

      <div className="orgs-Users-List">
        {groupMembersData
          ? groupMembersData.map((member) => (
              <div
                className={`orgs-User ${
                  selectedUserUids.some(
                    (selectedUserUid) => selectedUserUid === member.uid
                  )
                    ? "selectedUser"
                    : ""
                }`}
                key={member.uid}
                onClick={(e) => {
                  selectHandler(e, member.uid);
                  setUsersHandler(member);
                }}
              >
                <img
                  className="profile"
                  src="../images/sample_item1.jpg"
                  alt=""
                />
                <div className="name_dept">
                  <div className="name">{member.name}</div>
                  <div className="dept">
                    <span>{selectedGroup_Id_Name.group_name}</span>
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
