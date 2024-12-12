import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Share2,
  Link,
  Copy,
  Edit2,
  Lock,
  Unlock,
  Users,
  Mail,
  Edit,
  Building2,
  UserCheck
} from "lucide-react";
import axiosInstance from "../../services/axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import GetAddressModal from "../calendar/GetAddressModal";
import { multiply } from "lodash";
import useUserStore from "../../store/useUserStore";
import CustomAlert from "./CustomAlert";

// 공유 권한 타입
const PERMISSIONS = {
  READING: "읽기",
  WRITING: "수정",
  FULL: "모든"
};

const SHARE_TYPES = {
  INDIVIDUAL: "개인",
  DEPARTMENTALL: "부서"
};

const DriveShareModal = ({
  isModalOpen,
  setIsModalOpen,
  selected,
  name,
  Id,
  company // 새로 추가된 prop
}) => {
  const [shareLink, setShareLink] = useState("");
  const [sharedUsers, setSharedUsers] = useState([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentPermission, setCurrentPermission] = useState(
    PERMISSIONS.READING
  );
  const [isLinkPublic, setIsLinkPublic] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const [isNoneAlert, setIsNoneAlert] = useState(false);

  const user = useUserStore((state) => state.user);

  const [sharedEntities, setSharedEntities] = useState({
    users: [], // 개별 유저
    departments: [] // 부서
  });

  const [openAddress, setOpenAddress] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const cancleSelectedUsersHandler = (e, user) => {
    setSelectedUsers((prev) => {
      return prev.filter((selectedUser) => selectedUser.id !== user.id);
    });
  };

  // 부서 공유 관련 새로운 상태 추가
  const [shareType, setShareType] = useState(SHARE_TYPES.INDIVIDUAL);
  // state 수정
  const [selectedDepartments, setSelectedDepartments] = useState({}); // 배열로 변경
  const [selectedDepartmentInfo, setSelectedDepartmentInfo] = useState({}); // 객체로 변경
  const [isDepartmentListVisible, setIsDepartmentListVisible] = useState(false); // 부서 목록 표시 상태

  // 새로운 상태 추가: 부서 직원 목록과 선택된 직원들
  const [departmentEmployees, setDepartmentEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const selectedName = name;

  const toggleDepartmentList = () => {
    setIsDepartmentListVisible((prev) => !prev); // 표시 여부를 토글
  };

  const onshareCancel = () => {
    setIsAlert(false);
  };

  const generateShareLink = () => {
    const link = `https://example.com/share/${Id}`;
    setShareLink(link);
  };

  const fetchAllUsers = async ({ pageParam }) => {
    try {
      const response = await axiosInstance.get(
        `/api/users/all?page=${pageParam}&keyword=${searchKeyword}&id=${selectedDepartments}`
      );
      setSelectedDepartmentInfo((prev) => ({
        ...prev,
        memberCount: response.data.memberCount // API에서 받은 값
      }));
      return response.data;
    } catch (err) {
      console.error("Users fetching error:", err);
      return null;
    }
  };
  const fetchAllGroups = async ({ pageParam }) => {
    try {
      const response = await axiosInstance.get(
        `/api/groups/all?page=${pageParam}`
      );
      return response.data;
    } catch (err) {
      console.error("groups fetching error:", err);
      return null;
    }
  };

  // 무한 스크롤로 그룹 데이터를 가져오는 React Query 훅
  const {
    data: allGroups, // 그룹 데이터
    fetchNextPage: fetchNextPageAllGroups, // 다음 페이지 데이터 호출 함수
    hasNextPage: hasNextPageAllGroups, // 다음 페이지가 있는지 여부
    isFetchingNextPage: isFetchingNextPageAllGroups, // 다음 페이지를 로드 중인지 여부
    refetch: refetchAllGroups // 데이터를 다시 가져오는 함수
  } = useInfiniteQuery({
    queryKey: ["groups-all"], // 쿼리 식별자 (키워드 포함)
    queryFn: fetchAllGroups, // 데이터를 가져오는 함수
    initialPageParam: 0, // 첫 페이지 파라미터
    getNextPageParam: (lastPage) => {
      // 다음 페이지 파라미터 결정 로직
      if (!lastPage.hasNextPage) {
        return null; // 더 이상 페이지가 없으면 null 반환
      }
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1; // 현재 페이지보다 하나 큰 값을 반환
      }
      return null; // 기본적으로 null 반환
    },
    select: (data) => {
      // 데이터를 변환하여 사용
      const allGroups = data.pages.flatMap((page) => page.groups); // 모든 페이지의 그룹 데이터를 합침
      return { ...data, pages: [{ ...data.pages[0], groups: allGroups }] }; // 첫 페이지에 모든 그룹 데이터 병합
    },
    cacheTime: 6 * 1000 * 60, // 데이터 캐싱 시간 (6분)
    retry: false // 요청 실패 시 재시도하지 않음
  });

  // 부서 선택 핸들러 수정
  const handleDepartmentSelect = (group, checked) => {
    if (!group || !group.id) return;

    setSelectedDepartments((prev) => {
      const newDepartments = { ...prev };
      if (checked) {
        // 부서 추가
        newDepartments[group.id] = {
          id: group.id,
          name: group.name || "알 수 없는 부서",
          cnt: group.cnt,
          permission: PERMISSIONS.READING
        };
      } else {
        // 부서 제거
        delete newDepartments[group.id];
      }
      return newDepartments;
    });
  };

  const updateDepartmentPermission = (groupId, newPermission) => {
    setSelectedDepartments((prev) => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        permission: newPermission
      }
    }));
    setEditingDepartment(null); // 수정 완료 후 초기화
  };

  useEffect(() => {
    console.log("Updated selectedDepartments:", selectedDepartments);
    console.log("Selected Department Info:", selectedDepartmentInfo);
  }, [selectedDepartments, selectedDepartmentInfo]);

  const addEmailToShare = () => {
    if (
      currentEmail &&
      !sharedUsers.some((user) => user.email === currentEmail)
    ) {
      setSharedUsers([
        ...sharedUsers,
        {
          email: currentEmail,
          permission: currentPermission || PERMISSIONS.READING
        }
      ]);
      setCurrentEmail("");
      setCurrentPermission(PERMISSIONS.VIEWER);
    }
  };

  const removeUser = (emailToRemove) => {
    setSharedUsers(sharedUsers.filter((user) => user.email !== emailToRemove));
  };

  const startEditingUser = (user) => {
    setEditingUser(user);
  };

  const startEditingDepartment = (groupId) => {
    console.log("Setting editing department:", groupId);

    setEditingDepartment(groupId);
  };

  // updateUserPermission 함수 수정
  const updateUserPermission = (newPermission) => {
    if (!editingUser) return;

    if (sharedUsers.find((user) => user.email === editingUser.email)) {
      // sharedUsers 업데이트 (기존 개인 공유 사용자)
      setSharedUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === editingUser.email
            ? { ...user, permission: newPermission }
            : user
        )
      );
    } else {
      // selectedUsers 업데이트 (부서 사용자)
      setSelectedUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id
            ? { ...user, permission: newPermission }
            : user
        )
      );
    }
    setEditingUser(null);
  };

  const handleShare = async () => {
    const payload = {
      emails: selectedUsers.map((user) => user.email),
      uids: sharedUsers,
      departments: selectedDepartments
    };

    try {
      await axiosInstance.post("/api/share", payload);
      alert("공유 완료");
      setSelectedUsers([]); // 이메일 목록 초기화
    } catch (error) {
      console.error("공유 실패", error);
    }
  };

  const fetchShareUser = async (payload) => {
    try {
      const response = await axiosInstance.post(
        `/api/drive/share/personal`,
        payload
      );
      return response.data;
    } catch (err) {
      console.error("Users fetching error:", err);
      return null;
    }
  };

  const fetchSelectedUser = async (payload) => {
    try {
      const response = await axiosInstance.post(
        `/api/drive/share/depart`,
        payload
      );
      return response.data;
    } catch (err) {
      console.error("Users fetching error:", err);
      return null;
    }
  };

  const fetchDepartUser = async (payload) => {
    const payloadJson = JSON.stringify(payload);

    try {
      const response = await axiosInstance.post( `/api/share/departments`,  payloadJson,{
        headers: {
          "Content-Type": "application/json", // JSON 데이터임을 명시
        }   
    });
      return response.data;
    } catch (err) {
      console.error("Users fetching error:", err);
      return null;
    }
  };
  const noneUserHandler = () => {
    setIsNoneAlert(false);
    setIsAlert(false);
  };

  const shareHandler = () => {
    if (shareType === SHARE_TYPES.INDIVIDUAL) {
      if (sharedUsers.length === 0) {
        setIsNoneAlert(true);
        return null;
      }
      const payload = sharedUsers;
      console.log("payload!!!", payload);
      fetchShareUser(payload);

    } else if (shareType === SHARE_TYPES.DEPARTMENTALL) {
      if (selectedUsers.length === 0) {
        setIsNoneAlert(true);
        return null;
      }

      if (selectedDepartments.length === 0) {
        setIsNoneAlert(true);
        return null;
      }

      if (selectedUsers.length !==  0) {
        console.log("여기야??");
        fetchSelectedUser(selectedUsers);
      }

      if (selectedDepartments.length !== 0) {
        fetchDepartUser(selectedDepartments);
      }
    }

    return null;
  };

  // handleDepartmentShare 함수 수정
  const handleDepartmentShare = () => {
    if (selectedDepartments.length === 0) return;
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
  };

  return (
    isModalOpen && (
      <>
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg w-[600px] max-h-[90vh] overflow-hidden">
            {/* 헤더 영역 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Share2 className="text-blue-600 w-5 h-5" />
                <h2 className="text-xl font-semibold">공유: {name}</h2>
              </div>
            </div>

            {/* 본문 영역 */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {/* 공유 방식 선택 */}
              {company && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg">
                    {Object.values(SHARE_TYPES).map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          value={type}
                          checked={shareType === type}
                          onChange={() => setShareType(type)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm font-medium">{type}</span>
                      </label>
                    ))}
                  </div>

                  {shareType === SHARE_TYPES.DEPARTMENTALL && (
                    <div className="space-y-4">
                      <div className="border rounded-lg overflow relative">
                        <div
                          className="p-3 bg-gray-50 border-b cursor-pointer"
                          onClick={toggleDepartmentList}
                        >
                          <h3 className="font-medium flex items-center justify-between">
                            부서 선택
                            <span>
                              {isDepartmentListVisible ? "▲" : "▼"}
                            </span>{" "}
                            {/* 상태에 따른 아이콘 변경 */}
                          </h3>
                        </div>
                        {/* 부서 목록 */}
                        {isDepartmentListVisible && ( // 부서 목록이 보일 때만 렌더링
                          <div className="max-h-48 top-[48px] w-full  bg-white overflow-y-auto p-2 border rounded-lg absolute z-[590]">
                            {allGroups?.pages.map((page) =>
                              page.groups.map((group) => (
                                <label
                                  key={group.id}
                                  className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      selectedDepartments[group.id] !==
                                      undefined
                                    } // 객체의 키 존재 여부 확인
                                    onChange={(e) =>
                                      handleDepartmentSelect(
                                        group,
                                        e.target.checked
                                      )
                                    } // 체크 변경 핸들러 호출
                                    className="w-4 h-4 mr-3 text-blue-600 rounded"
                                  />
                                  <span>{group.name}</span>
                                </label>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                      {/* 선택된 부서 정보 표시 */}
                      {Object.values(selectedDepartments).map(
                        ({ id, name, cnt, permission }) => (
                          <div
                            key={id}
                            className="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                              <span className="font-medium">
                                {name || "알 수 없는 부서"}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <div className="flex gap-2">
                                {editingDepartment === id ? (
                                  <select
                                    value={permission || PERMISSIONS.READING}
                                    onChange={(e) =>
                                      updateDepartmentPermission(
                                        id,
                                        e.target.value
                                      )
                                    }
                                    className="mt-1 px-2 py-1 text-sm border border-gray-300 rounded"
                                    autoFocus
                                  >
                                    {Object.values(PERMISSIONS).map((perm) => (
                                      <option key={perm} value={perm}>
                                        {perm} 권한
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">
                                      {permission || "읽기"} 권한
                                    </span>
                                    <button
                                      onClick={() => setEditingDepartment(id)}
                                      className="text-blue-600 hover:text-blue-700"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                              <UserCheck className="w-4 h-4 mr-2 ml-[10px]" />
                              <span>총 구성원 {cnt || 0}명</span>
                            </div>
                          </div>
                        )
                      )}
                      <button
                        disabled={Object.keys(selectedDepartments).length === 0}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        선택된 부서 전체 공유 (
                        {Object.keys(selectedDepartments).length}개 부서)
                      </button>

                      <div>
                        <button
                          onClick={() => setOpenAddress(true)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          개별 공유
                        </button>
                      </div>

                      <div>
                        <ul className="space-y-2 max-h-[150px] overflow-scroll scrollbar-none">
                          {selectedUsers.map((user) => (
                            <li
                              key={user.id}
                              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <img
                                    src="/images/admin-profile.png"
                                    className="w-10 h-10 rounded-full"
                                    alt={user.name}
                                  />
                                  <div>
                                    <div className="flex gap-2">
                                      <span className="font-medium">
                                        {user.name}
                                      </span>
                                      <span className="text-gray-500">
                                        {user.level}
                                      </span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {user.email}
                                    </div>
                                  </div>
                                  <div className="text-gray-600">
                                    {user.group}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  {editingUser?.email === user.email ? (
                                    <select
                                      value={user.permission}
                                      onChange={(e) =>
                                        updateUserPermission(e.target.value)
                                      }
                                      className="mt-1 px-2 py-1 text-sm border border-gray-300 rounded"
                                      autoFocus
                                    >
                                      {Object.values(PERMISSIONS).map(
                                        (perm) => (
                                          <option key={perm} value={perm}>
                                            {perm} 권한
                                          </option>
                                        )
                                      )}
                                    </select>
                                  ) : (
                                    <div className="flex  items-center gap-2">
                                      <span className="text-sm text-gray-500">
                                        {user.permission || "읽기"} 권한
                                      </span>
                                      <button
                                        onClick={() => startEditingUser(user)}
                                        className="text-blue-600 hover:text-blue-700"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}
                                  <button
                                    onClick={(e) =>
                                      cancleSelectedUsersHandler(e, user)
                                    }
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 링크 공유 섹션 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={shareLink}
                    placeholder="공유 링크 생성"
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button
                    onClick={generateShareLink}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    링크 생성
                  </button>
                  <button
                    onClick={copyShareLink}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 p-2">
                  {isLinkPublic ? (
                    <Unlock className="text-green-600 w-4 h-4" />
                  ) : (
                    <Lock className="text-red-600 w-4 h-4" />
                  )}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isLinkPublic}
                      onChange={() => setIsLinkPublic(!isLinkPublic)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    모든 사용자에게 링크 공유 허용
                  </label>
                </div>
              </div>

              {/* 개별 공유 섹션 */}
              {shareType === SHARE_TYPES.INDIVIDUAL && (
                <div className="space-y-4">
                  {/* 이메일 입력 부분 - 기존 코드 유지 */}
                  <div className="flex items-center gap-2">
                    <Users className="text-gray-600 w-5 h-5" />
                    <input
                      type="email"
                      value={currentEmail}
                      onChange={(e) => setCurrentEmail(e.target.value)}
                      placeholder="이메일 주소 입력"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <select
                      value={currentPermission}
                      onChange={(e) => setCurrentPermission(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      {Object.values(PERMISSIONS).map((perm) => (
                        <option key={perm} value={perm}>
                          {perm} 권한
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={addEmailToShare}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      추가
                    </button>
                  </div>

                  {/* 공유된 사용자 목록 표시 */}
                  {sharedUsers.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">
                        공유된 사용자
                      </h3>
                      <ul className="space-y-2">
                        {sharedUsers.map((user, index) => (
                          <li
                            key={index}
                            className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <img
                                  src="/images/admin-profile.png"
                                  className="w-10 h-10 rounded-full"
                                  alt="User profile"
                                />
                                <div className="flex  justify-between">
                                  <span className="font-medium">
                                    {user.email}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {editingUser?.email === user.email ? (
                                  <select
                                    value={user.permission}
                                    onChange={(e) =>
                                      updateUserPermission(e.target.value)
                                    }
                                    className="mt-1 px-2 py-1 text-sm border border-gray-300 rounded"
                                    autoFocus
                                  >
                                    {Object.values(PERMISSIONS).map((perm) => (
                                      <option key={perm} value={perm}>
                                        {perm} 권한
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <div className="flex  items-center gap-2">
                                    <span className="text-sm text-gray-500">
                                      {user.permission} 권한
                                    </span>
                                    <button
                                      onClick={() => startEditingUser(user)}
                                      className="text-blue-600 hover:text-blue-700"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                                <button
                                  onClick={() => removeUser(user.email)}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 푸터 영역 */}
            <div className="flex justify-end gap-2 p-6 border-t border-gray-200 bg-gray-50">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setIsModalOpen(false)}
              >
                취소
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => setIsAlert(true)}
              >
                공유
              </button>
            </div>
          </div>
        </div>

        <GetAddressModal
          isOpen={openAddress}
          onClose={() => setOpenAddress(false)}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          cancleSelectedUsersHandler={cancleSelectedUsersHandler}
        />
        {isAlert && (
          <CustomAlert
            type={"warning"}
            title={"공유하시겠습니까?"}
            onConfirm={() => shareHandler()}
            onCancel={onshareCancel}
            cancelText={"취소"}
            showCancel={true}
          ></CustomAlert>
        )}
        {isNoneAlert && (
          <CustomAlert
            type={"Info"}
            title={"공유할 인원이 없습니다."}
            onConfirm={() => noneUserHandler()}
            cancelText={"취소"}
          ></CustomAlert>
        )}
      </>
    )
  );
};

export default DriveShareModal;

{
  /*  {shareType === SHARE_TYPES.DEPARTMENTPERSONAL && (
            <div>
              <div className="flex items-center mb-2">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="flex-grow p-2 border rounded mr-2"
                >
                    {allGroups?.pages
                      .map((page, pageIndex) =>
                        page.groups.map((group, groupIndex) => {
                          const isLastGroup =
                            pageIndex === allGroups.pages.length - 1 &&
                            groupIndex === page.groups.length - 1;
                          return (
                            <option
                              key={group.id}
                              value={group.id}
                              onClick={()=>groupHandler()}
                              ref={isLastGroup ? lastGroupRef : null}
                              className="p-2 border-b"
                            >
                              {group.name}
                            </option>
                          );
                        })
                      )}
                      {hasNextPageAllGroups && (
                          <div
                            onClick={() => fetchNextPageAllGroups()}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            disabled={isFetchingNextPageAllGroups}
                          >
                            {isFetchingNextPageAllGroups ? "로딩 중..." : "더 보기"}
                          </div>
                        )}

                </select>
              </div>
              {selectedDepartment && (
                    <div className="border rounded p-2 overflow-auto scrollbar-none border-b ">
                      <h3 className=" font-semibold mb-3 pb-3 ">{selectedDepartment} 직원 목록</h3>
                    {allUsers?.pages.map((page) =>
                        page.users.map((user) => (
                          <div key={user.id} className="flex items-center p-2 border-b">
                            <input
                              type="checkbox"
                              checked={selectedEmployees.some((emp) => emp.id === user.id)}
                              onChange={() => toggleEmployeeSelection(user)}
                            />
                            <img src={user.img} alt="user-img" className="w-10 h-10 mr-2" />
                            <div>
                              <p>{user.name}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </div>
                        ))
                      )}    
                      <button 
                        onClick={shareSelectedEmployees}
                        disabled={selectedEmployees.length === 0}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                      >
                        선택된 직원에게 공유 ({selectedEmployees.length}명)
                      </button>
                    

                </div>
              )} */
}
{
  /* </div> */
}
{
  /* )} */
}
