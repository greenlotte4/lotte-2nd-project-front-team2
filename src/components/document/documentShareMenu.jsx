import React, { useCallback, useEffect, useRef, useState } from 'react';
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
} from 'lucide-react';
import axiosInstance from '../../services/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import GetAddressModal from '../calendar/GetAddressModal';

// 공유 권한 타입
const PERMISSIONS = {
  READING: '읽기',
  WRITING: '수정', 
  FULL: '모든',
};

const SHARE_TYPES = {
  INDIVIDUAL: '개인',
  DEPARTMENTALL: '부서전체',
  DEPARTMENTPERSONAL: '부서',
  
};

const DriveShareModal = ({
  isModalOpen, 
  setIsModalOpen, 
  selected, 
  name, 
  Id, 
  company // 새로 추가된 prop
}) => {
  const [shareLink, setShareLink] = useState('');
  const [sharedUsers, setSharedUsers] = useState([
    { email: 'user1@example.com', permission: PERMISSIONS.VIEWER },
    { email: 'user2@example.com', permission: PERMISSIONS.EDITOR }
  ]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentPermission, setCurrentPermission] = useState(PERMISSIONS.VIEWER);
  const [isLinkPublic, setIsLinkPublic] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState();

  const [openAddress,setOpenAddress] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const cancleSelectedUsersHandler = (e,user) => {
     setSelectedUsers((prev)=>{
         return prev.filter((selectedUser) => selectedUser.id !== user.id);
     })
   }



  // 부서 공유 관련 새로운 상태 추가
  const [shareType, setShareType] = useState(SHARE_TYPES.INDIVIDUAL);
  const [selectedDepartment, setSelectedDepartment] = useState([null]);
  const [selectedDepartmentInfo, setSelectedDepartmentInfo] = useState({
    name: "",
    groupId: "",
    count: "",
});


   // 새로운 상태 추가: 부서 직원 목록과 선택된 직원들
   const [departmentEmployees, setDepartmentEmployees] = useState([]);
   const [selectedEmployees, setSelectedEmployees] = useState([]);

  const selectedName = name;

  const generateShareLink = () => {
    const link = `https://example.com/share/${Id}`;
    setShareLink(link);
  };

  useEffect(() => {
    if (selectedDepartment) {
      // 예시 데이터 - 실제로는 API나 company prop에서 데이터를 가져와야 

      setDepartmentEmployees(selectedDepartment);
    }
  }, [selectedDepartment]);

 /*  useEffect(() => {
    if (searchKeyword !== "") {
      refetchAllUsers();
    } else {
      refetchAllUsers();
    }
  }, [searchKeyword, refetchAllUsers]); */



  const fetchAllUsers = async ({ pageParam }) => {
    try {
      const response = await axiosInstance.get(
        `/api/users/all?page=${pageParam}&keyword=${searchKeyword}&id=${selectedDepartment}`
      );
      setSelectedDepartmentInfo((prev) => ({
        ...prev,
        memberCount: response.data.memberCount, // API에서 받은 값
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

  const {
    data: allUsers,
    fetchNextPage: fetchNextPageAllUsers,
    hasNextPage: hasNextPageAllUsers,
    isFetchingNextPage: isFetchingNextPageAllUsers,
    refetch: refetchAllUsers,
  } = useInfiniteQuery({
    queryKey: ["users-all", searchKeyword, selectedGroupId],
    queryFn: fetchAllUsers,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.hasNextPage) {
        return null;
      }
      return lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : null;
    },
    select: (data) => {
      const allUsers = data.pages.flatMap((page) => page.users);
      return { ...data, pages: [{ ...data.pages[0], users: [...new Set(allUsers)] }],};
    },
    cacheTime: 6 * 1000 * 60,
    retry: false,
    enabled: !!selectedGroupId, // selectedGroupId가 null이 아닐 때만 실행
  });
  // 무한 스크롤로 그룹 데이터를 가져오는 React Query 훅
  const {
    data: allGroups, // 그룹 데이터
    fetchNextPage: fetchNextPageAllGroups, // 다음 페이지 데이터 호출 함수
    hasNextPage: hasNextPageAllGroups, // 다음 페이지가 있는지 여부
    isFetchingNextPage: isFetchingNextPageAllGroups, // 다음 페이지를 로드 중인지 여부
    refetch: refetchAllGroups, // 데이터를 다시 가져오는 함수
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
    retry: false, // 요청 실패 시 재시도하지 않음
  });

    // 개별 직원 선택/해제 토글
    const toggleEmployeeSelection = (employee) => {
      setSelectedEmployees(prev => 
        prev.some(emp => emp.id === employee.id)
          ? prev.filter(emp => emp.id !== employee.id)
          : [...prev, employee]
      );
    };
    // 선택된 직원들 공유 로직
  const shareSelectedEmployees = () => {
    // 선택된 직원들을 sharedUsers에 추가
    const newSharedUsers = selectedEmployees.map(emp => ({
      email: emp.email,
      permission: PERMISSIONS.VIEWER // 기본 권한 설정
    }));

    setSharedUsers(prev => [...prev, ...newSharedUsers]);
    
    // 선택 초기화
    setSelectedEmployees([]);
  };

  const observer = useRef();
  const observerGroups = useRef();

  const lastGroupRef = useCallback(
    (node) => {
      if (isFetchingNextPageAllGroups) return;
      if (observerGroups.current) observerGroups.current.disconnect();
      observerGroups.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPageAllUsers) {
          fetchNextPageAllGroups();
        }
      });
      if (node) observerGroups.current.observe(node);
    },
    [isFetchingNextPageAllGroups, hasNextPageAllGroups, fetchNextPageAllGroups]
  );

  useEffect(() => {
    if (searchKeyword !== "") {
      refetchAllUsers();
    } else {
      refetchAllUsers();
    }
  }, [searchKeyword, refetchAllUsers]);

  useEffect(() => {
    if (selectedDepartment) {
      refetchAllUsers();

    }
  }, [selectedDepartment, refetchAllUsers]);

  const addEmailToShare = () => {
    if (currentEmail && !sharedUsers.some(user => user.email === currentEmail)) {
      setSharedUsers([
        ...sharedUsers, 
        { 
          email: currentEmail, 
          permission: currentPermission 
        }
      ]);
      setCurrentEmail('');
      setCurrentPermission(PERMISSIONS.VIEWER);
    }
  };

  const removeUser = (emailToRemove) => {
    setSharedUsers(sharedUsers.filter(user => user.email !== emailToRemove));
  };

  const startEditingUser = (user) => {
    setEditingUser(user);
  };

// updateUserPermission 함수 수정
const updateUserPermission = (newPermission) => {
  if (!editingUser) return;

  if (sharedUsers.find(user => user.email === editingUser.email)) {
    // sharedUsers 업데이트 (기존 개인 공유 사용자)
    setSharedUsers(prevUsers => 
      prevUsers.map(user => 
        user.email === editingUser.email 
          ? { ...user, permission: newPermission }
          : user
      )
    );
  } else {
    // selectedUsers 업데이트 (부서 사용자)
    setSelectedUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === editingUser.id 
          ? { ...user, permission: newPermission }
          : user
      )
    );
  }
  setEditingUser(null);
};


  const handleDepartmentChange = async (e) => {
    const deptId = e.target.value;
    setSelectedDepartment(deptId);
    setSelectedGroupId(deptId); 

    if (deptId) {
      const selectedDept = allGroups?.pages
        .flatMap(page => page.groups)
        .find(group => group.id === deptId);
  
      if (selectedDept) {
        // allUsers 데이터에서 선택된 부서에 속한 사용자 수 계산
        const deptUsers = allUsers?.pages
          .flatMap(page => page.users)
          .filter(user => user.groupId === deptId);
  
        const memberCount = deptUsers?.length || 0;
  
        setSelectedDepartmentInfo({
          ...selectedDept,
          memberCount
        });
  
        // 사용자 목록을 업데이트하기 위해 refetch
        refetchAllUsers();
      }
    } else {
      setSelectedDepartmentInfo(null);
    }
  };

  useEffect(() => {
    if (selectedDepartment && allUsers?.pages) {
      const deptUsers = allUsers.pages
        .flatMap(page => page.users)
        .filter(user => user.groupId === selectedDepartment);
  
      setSelectedDepartmentInfo(prev => ({
        ...prev,
        memberCount: deptUsers?.length || 0
      }));
    }
  }, [selectedDepartment, allUsers]);
  
  // handleDepartmentShare 함수 수정
  const handleDepartmentShare = () => {
    if (!selectedDepartment || !allUsers?.pages) return;
  
    const deptUsers = allUsers.pages
      .flatMap(page => page.users)
      .filter(user => user.groupId === selectedDepartment);
  
    // 부서 전체 사용자를 selectedUsers에 추가
    setSelectedUsers(prevUsers => {
      // 이미 선택된 사용자는 제외하고 새로운 사용자만 추가
      const existingUserIds = new Set(prevUsers.map(u => u.id));
      const newUsers = deptUsers.filter(user => !existingUserIds.has(user.id));
      return [...prevUsers, ...newUsers];
    });
  };

  



  const groupHandler = (group) =>{
    setSelectedDepartment(group);
    console.log("이게맞냐!!1",group);
  }

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
  };

 
  return (isModalOpen && (<>
    <div className='fixed inset-0 z-[500] flex items-center justify-center bg-black/40 backdrop-blur-sm'>
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
                {Object.values(SHARE_TYPES).map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
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
                  <div className="flex gap-2">
                    <select
                      value={selectedDepartment}
                      onChange={(e) => {
                        const selectedGroup = JSON.parse(e.target.value);
                        console.log("Selected Group:", selectedGroup);
                        // 선택된 부서 정보를 업데이트
                        setSelectedDepartmentInfo({
                          id: selectedGroup.id,
                          name: selectedGroup.name,
                          memberCount: 0, // 초기값 (예: API 호출 후 업데이트 가능)
                        });
                        setSelectedDepartment(selectedGroup.name); // group.name
                        setSelectedGroupId(selectedGroup.id);     // group.id
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">부서 선택</option>
                      {allGroups?.pages.map((page, pageIndex) =>
                        page.groups.map((group) => (
                          <option key={group.id}         
                          value={JSON.stringify({ id: group.id, name: group.name })} // JSON 문자열로 저장
                            >
                            {group.name}
                          </option>
                        ))
                      )}
                    </select>
                    <button 
                      onClick={handleDepartmentShare}
                      disabled={!selectedDepartment}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      부서 전체 공유
                    </button>
                  </div>
                  
              {/* 선택된 부서 정보 표시 */}
              {selectedDepartmentInfo !==null && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center">
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="font-medium text-lg">{selectedDepartment}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <UserCheck className="w-4 h-4 mr-2" />
                    <span>총 구성원 {selectedDepartmentInfo.memberCount}명</span>
                  </div>
                </div>
              )}
                  
                  <div>
                    <button 
                      onClick={()=>setOpenAddress(true)} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      개별 공유
                    </button>
                  </div>

                  <div>
                    <ul className="space-y-2">
                      {selectedUsers.map(user => (
                        <li key={user.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
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
                                  <span className="text-gray-500">{user.level}</span>
                                </div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                              <div className="text-gray-600">{user.group}</div>
                            </div>
                            <div className='flex gap-2'>
                                {editingUser?.email === user.email ? (
                                    <select
                                      value={user.permission}
                                      onChange={(e) => updateUserPermission(e.target.value)}
                                      className="mt-1 px-2 py-1 text-sm border border-gray-300 rounded"
                                      autoFocus
                                    >
                                      {Object.values(PERMISSIONS).map(perm => (
                                        <option key={perm} value={perm}>{perm} 권한</option>
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
                              onClick={(e)=>cancleSelectedUsersHandler(e,user)}
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
              {isLinkPublic ? 
                <Unlock className="text-green-600 w-4 h-4" /> : 
                <Lock className="text-red-600 w-4 h-4" />
              }
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
        {Object.values(PERMISSIONS).map(perm => (
          <option key={perm} value={perm}>{perm} 권한</option>
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
        <h3 className="text-sm font-medium mb-2">공유된 사용자</h3>
        <ul className="space-y-2">
          {sharedUsers.map((user, index) => (
            <li key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img 
                    src="/images/admin-profile.png" 
                    className="w-10 h-10 rounded-full"
                    alt="User profile"
                  />
                  <div className="flex  justify-between">
                    <span className="font-medium">{user.email}</span>
                    
                  </div>
         
                </div>
                <div className='flex gap-2'>
                  {editingUser?.email === user.email ? (
                      <select
                        value={user.permission}
                        onChange={(e) => updateUserPermission(e.target.value)}
                        className="mt-1 px-2 py-1 text-sm border border-gray-300 rounded"
                        autoFocus
                      >
                        {Object.values(PERMISSIONS).map(perm => (
                          <option key={perm} value={perm}>{perm} 권한</option>
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
          >
            공유
          </button>
        </div>
      </div>
    </div>

    <GetAddressModal 
      isOpen={openAddress}
      onClose={()=>setOpenAddress(false)}
      selectedUsers={selectedUsers}
      setSelectedUsers={setSelectedUsers}
      cancleSelectedUsersHandler={cancleSelectedUsersHandler}
    />
  </>));
};

export default DriveShareModal;




   {/*  {shareType === SHARE_TYPES.DEPARTMENTPERSONAL && (
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
              )} */}
            {/* </div> */}
          {/* )} */}