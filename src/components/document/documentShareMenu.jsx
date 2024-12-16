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
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
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
  DEPARTMENTALL: "부서",
  DEPARTMENT:"개별",
};

const TabButton = ({ active, onClick, icon, label }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-6 py-3 
        ${active 
          ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
          : 'text-gray-500 hover:bg-gray-50'
        }
        transition-colors
      `}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
};

const DriveShareModal = ({
  isModalOpen,
  setIsModalOpen,
  selectedFolder,
  selected,
  name,
  id,
  type,
  company, // 새로 추가된 prop
  sharedMember,
  sharedDept,
  ownerId,

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
  const queryClient = useQueryClient();
  const selectedName = name;
 
  useEffect(() => {
    if (sharedMember && Array.isArray(sharedMember)) {
      console.log("Received sharedMember:", sharedMember);
  
      // 초기화: sharedMember 배열을 그대로 복사
      setSelectedUsers(sharedMember);
    }
  }, [sharedMember]);

  useEffect(() => {
    console.log("useEffect 실행: isModalOpen 또는 sharedDept 변경");
    console.log("isModalOpen:", isModalOpen);
    console.log("sharedDept:", sharedDept);
    console.log("Received sharedDept:", sharedDept);
    if (isModalOpen && (sharedDept || sharedMember) ) {
      const parsedShareDepts = Array.isArray(sharedDept)
        ? sharedDept.reduce((acc, dept) => {
            acc[dept.deptId] = {
              id: dept.deptId,
              name: dept.deptName,
              cnt: dept.cnt,
              permission: dept.permission || PERMISSIONS.READING,
            };
            return acc;
          }, {})
        : {};
      console.log("초기화된 selectedDepartments:", parsedShareDepts);
      setSelectedDepartments(parsedShareDepts);
    }
    if (sharedMember && Array.isArray(sharedMember)) {
      console.log("Received sharedMember:", sharedMember);
  
     
    }
  }, [isModalOpen, sharedDept,sharedMember]);
  useEffect(() => {
    console.log("초기화된 selectedUsers:", selectedUsers);
  }, [selectedUsers]);
  
  useEffect(() => {
    console.log("선택된 부서111:", selectedDepartments);
    console.log("현재 selectedDepartments 상태:", Object.values(selectedDepartments).length);
    console.log("선택된 사용자1111:", selectedUsers);
  }, [selectedDepartments, selectedUsers]);

  

  const toggleDepartmentList = () => {
    setIsDepartmentListVisible((prev) => !prev); // 표시 여부를 토글
  };

  const onshareCancel = () => {
    setIsAlert(false);
  };
  const handleChangeShareType = (type) => {
    setShareType(type);
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
    setSelectedDepartments((prev) => {
      const newDepartments = { ...prev };
      if (checked) {
        // If the department is not already in selectedDepartments, add it
        if (!newDepartments[group.id]) {
          newDepartments[group.id] = {
            id: group.id,
            name: group.name || "알 수 없는 부서",
            cnt: group.cnt,
            permission: PERMISSIONS.READING,
          };
        }
      } else {
        // Remove the department if unchecked
        delete newDepartments[group.id];
      }
      return newDepartments;
    });
  };
  const [deletedDepartments, setDeletedDepartments] = useState([]);

  const handleDepartmentRemove = async (dept) => {
    setSelectedDepartments((prev) => {
      const updated = { ...prev };
      delete updated[dept.id];
      return updated;
    });
    setDeletedDepartments((prev) => [...prev, dept.id]);
  };
  
  useEffect(() => {
    console.log("초기화된 부서 데이터:", selectedDepartments);
    console.log("삭제된 부서들",deletedDepartments);
  }, [selectedDepartments]);
  
  useEffect(() => {
    console.log("allGroups 데이터:", allGroups);
  }, [allGroups]);

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


    // 이메일 공유 처리
    const handleEmailShare = async (emailData) => {
      try {
        const response = await axiosInstance.post('/api/drive/share/email', {
          id,
          type,
          email: emailData.email,
          permission: emailData.permission
        });
  
        if (response.status === 200) {
          queryClient.invalidateQueries(['folderContents']);
          alert('이메일로 공유되었습니다.');
        }
      } catch (error) {
        alert('공유 중 오류가 발생했습니다.');
      }
    };
  
    // 부서 전체 공유 처리
    const handleDepartmentShare = async (deptData) => {
      try {

        const departmentsToShare = Object.values(selectedDepartments).map((dept) => ({
          departmentId: dept.id,
          departmentName: dept.name,
          departmentCnt:dept.cnt,
          permission: dept.permission,
        }));

        const response = await axiosInstance.post(`/api/drive/share/department?id=${id}&type=${type}`, {
          id,   // folderId or fileId
          type,  // folder or file 
          departments: departmentsToShare, // 여러 부서를 배열로 보냄
        });
  
        if (response.status === 200) {
          queryClient.invalidateQueries(['folderContents']);
           // 선택된 부서 업데이트
          setSelectedDepartments((prev) => ({
            ...prev,
            [deptData.departmentId]: {
              id: deptData.departmentId,
              name: deptData.departmentName, // 부서 이름
              permission: deptData.permission || PERMISSIONS.READING, // 기본 권한 설정
              cnt: deptData.departmentCnt || 0, // 부서 구성원 수
            },
          }));
        }
      } catch (error) {
        alert('부서 공유 중 오류가 발생했습니다.');
      }
    };

    //부서 삭제요청 처리
    const handleDeleteDepartments = async() =>{
      try {
        const response = await axiosInstance.post(`/api/drive/share/remove-department`, {
          id,
          type,
          ownerId,
          deletedDepartments,
        });
  
        if (response.status === 200) {
          setDeletedDepartments([]); // 삭제 목록 초기화

          queryClient.invalidateQueries(['folderContents']);
        }
      } catch (error) {
        alert('사용자 공유 중 오류가 발생했습니다.');
      }
    }
  
    // 개별 선택 공유 처리
    const handleIndividualShare = async (users) => {
      try {
        const response = await axiosInstance.post('/api/drive/share/users', {
          id,
          type,
          users: users.map(user => ({
            userId: user.id,
            permission: user.permission || '읽기'
          }))
        });
  
        if (response.status === 200) {
          queryClient.invalidateQueries(['folderContents']);
          setSelectedUsers(prev => [...prev, ...users]);
        }
      } catch (error) {
        alert('사용자 공유 중 오류가 발생했습니다.');
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


  const noneUserHandler = () => {
    setIsNoneAlert(false);
    setIsAlert(false);
  };

  const shareHandler = async () => {
    let payload;

    if (shareType === SHARE_TYPES.DEPARTMENT) {
      payload = {
        userType: "department",
        sharedUsers:selectedUsers,
      };
    } else if (shareType === SHARE_TYPES.INDIVIDUAL) {
      payload = {
        userType: "individual",
        sharedUsers,
      };
    } else if (shareType === SHARE_TYPES.DEPARTMENTALL) {
      handleDepartmentShare();
      return;
    }
  
    try {
      const response = await axiosInstance.post(`/api/share/drive/${type}/${id}`, payload);
  
      if (response.status === 200) {
        alert("공유 작업이 완료되었습니다.");
        setDeletedDepartments([]); // 삭제 목록 초기화
        queryClient.invalidateQueries(['folderContents']);
        setSelectedDepartments({});
        setSelectedUsers([]);
        setIsAlert(false);
        setIsModalOpen(false);
      } else {
        alert("공유 작업 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("공유 요청 오류:", error);
      alert("공유 요청 중 문제가 발생했습니다.");
    }
      
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
              {/* 탭 메뉴 */}
              <div className="flex border-b">
                <TabButton
                  active={shareType === SHARE_TYPES.INDIVIDUAL}
                  onClick={() => handleChangeShareType(SHARE_TYPES.INDIVIDUAL)}
                  icon={<Mail className="w-5 h-5" />}
                  label="이메일로 공유"
                />
                <TabButton
                  active={shareType === SHARE_TYPES.DEPARTMENTALL}
                  onClick={() => handleChangeShareType(SHARE_TYPES.DEPARTMENTALL)}
                  icon={<Building2 className="w-5 h-5" />}
                  label="부서 전체 공유"
                />
                <TabButton
                  active={shareType === SHARE_TYPES.DEPARTMENT}
                  onClick={() => handleChangeShareType(SHARE_TYPES.DEPARTMENT)}
                  icon={<Users className="w-5 h-5" />}
                  label="개별 선택 공유"
                />
              </div>

              {/* 공유 방식 선택 */}
              {company && (
                <div className="space-y-4">
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
                                key={`${group.id}-${group.name}`}
                                className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={!!selectedDepartments[group.id]} // 반드시 Boolean으로 변환
                                    onChange={(e) => handleDepartmentSelect(group, e.target.checked)}                            
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
                      
                      {Object.values(selectedDepartments).length > 0 ? (
                            Object.values(selectedDepartments).map(({ id, name, cnt, permission }) => (
                              <div
                                key={id}
                                className="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
                              >
                                <div className="flex items-center">
                                  <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                                  <span className="font-medium">{name || "알 수 없는 부서"}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <div className="flex gap-2">
                                    {editingDepartment === id ? (
                                      <select
                                        value={permission || PERMISSIONS.READING}
                                        onChange={(e) => updateDepartmentPermission(id, e.target.value)}
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
                                  <button
                                      onClick={() => handleDepartmentRemove({ id, name, cnt })}
                                      className="ml-4 text-red-600 hover:text-red-800"
                                    >
                                      X
                                    </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500">선택된 부서가 없습니다.</p>
                          )}
                       <button
                          disabled={Object.keys(selectedDepartments).length === 0}
                          onClick={handleDepartmentShare}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          선택된 부서 전체 공유 ({Object.keys(selectedDepartments).length}개 부서)
                        </button>

                        {deletedDepartments.length > 0 && (
                          <button
                            onClick={handleDeleteDepartments}
                            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            삭제 요청 ({deletedDepartments.length}개 부서)
                          </button>
                        )}
                      
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
              {shareType === SHARE_TYPES.DEPARTMENT && (<>
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
                      {Array.isArray(selectedUsers) && selectedUsers.length > 0 ? (
                          selectedUsers.map((user) => (
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
                                      <span className="font-medium">{user.name}</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {user.email || "이메일 없음"}
                                    </div>
                                  </div>
                                  <div className="text-gray-600">{user.group || "부서 없음"}</div>
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
                                </div>
                                <button
                                  onClick={(e) =>
                                    cancleSelectedUsersHandler(e, user)
                                  }
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  ×
                                </button>
                              </div>

                            </li>
                          ))
                        ) : (
                          <p className="text-gray-500">선택된 사용자가 없습니다.</p>
                        )}
                      </ul>
                    </div>
            
              
              
              </>)}

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

