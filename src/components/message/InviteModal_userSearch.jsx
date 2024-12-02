import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import { useQuery } from "@tanstack/react-query";

export default function InviteModal_userSearch(props) {
  const {
    users,
    setUsers,
    setSelectedGroup_Id_Name,
    selectedGroup_Id_Name,
    selectedUserIds,
    setSelectedUserIds,
    userList,
    setUserList,
    selectHandler,
  } = props;

  const {
    isLoading,
    data: allUsers,
    isError,
    error,
  } = useQuery({
    queryKey: ["get-allUsers"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/allUsers");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  setUserList(allUsers);

  const [userIds, setUserIds] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  console.log("userList:", userList);

  useEffect(() => {
    if (keyword !== "") {
      setSearchResult(userList.filter((user) => user.name.includes(keyword)));
    }
  }, [keyword, userList]);

  const searchHandler = (e) => {
    setKeyword(e.target.value);
  };

  const setUsersHandler = (result) => {
    if (!userIds.includes(result.id)) {
      setUsers([...users, result]);
    }
  };

  if (isError) return <>Error : {error.message}</>;

  return (
    <div className="inviteLeftBox">
      <span>사용자 검색</span>

      <div className="userSearch">
        <div className="search_Input_Img">
          <input
            type="text"
            className="searchInput"
            value={keyword}
            onChange={searchHandler}
          />
          <img src="/images/search-icon.png" alt="" className="searchImg" />
        </div>
        <div className="orgs-Users-List searched-Users-List">
          {isLoading ? (
            <div className="isLoading"> Loading</div>
          ) : isError ? (
            <div className="isError">Error</div>
          ) : null}
          {searchResult
            ? searchResult.map((result) => (
                <div
                  className={`orgs-User ${
                    selectedUserIds.some(
                      (selectedUserId) => selectedUserId === result.id
                    )
                      ? "selectedUser"
                      : null
                  }`}
                  onClick={(e) => {
                    selectHandler(e, result.id);
                    setUsersHandler(result);
                  }}
                  key={result.id}
                >
                  <img
                    className="profile"
                    src="../images/sample_item1.jpg"
                    alt=""
                  />
                  <div className="name_dept">
                    <div className="name">{result.name}</div>
                    <div className="dept">
                      <span>개발팀</span>
                    </div>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
