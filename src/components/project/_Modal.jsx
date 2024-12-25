/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect, useRef, useState } from "react";
import useUserStore from "@/store/useUserStore"
import { CustomSVG } from "./_CustomSVG";
import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/axios.jsx";
import templates from "./templates.json";
import { PROFILE_URI } from "../../api/_URI";
import { name } from "file-loader";

export const TemplateSelection = ({isOpen,onClose,onSelectTemplate}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">프로젝트 템플릿 선택</h2>
        <p className="text-sm text-gray-600 mb-6">
          시작할 템플릿을 선택하세요. 언제든지 변경할 수 있습니다.
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => onSelectTemplate("empty")}
            className="p-4 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm text-left"
          >
            <span className="font-bold text-gray-800">빈 프로젝트</span>
            <p className="text-sm text-gray-600">템플릿 없이 프로젝트를 시작합니다.</p>
          </button>
          <button
            onClick={() => onSelectTemplate("kanban")}
            className="p-4 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm text-left"
          >
            <span className="font-bold text-gray-800">기본 칸반 보드</span>
            <p className="text-sm text-gray-600">칸반 보드를 포함한 기본 템플릿.</p>
          </button>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export const ModifyProjectModal = ({ isOpen, onClose, projectId, onChangeProject, onSubmit }) => {
  if (!isOpen) return null;
  const [projectData, setProjectData] = useState({
    title: "",
    type: "",
    status: "1",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const typeDescriptions = {
    1: "부서 내부에서만 진행되는 프로젝트입니다. 이 프로젝트에서는 자신이 소속된 부서 내의 인원만 작업자로 초대할 수 있습니다.",
    2: "회사 전체에서 공유 및 진행하는 프로젝트입니다. 이 프로젝트에서는 자신이 소속된 회사의 모든 인원을 작업자로 초대할 수 있습니다.",
    3: "다른 회사와 협력하여 진행하는 프로젝트입니다.",
    4: "팀 단위로 진행되는 프로젝트입니다.",
    5: "모두가 볼 수 있는 공개 프로젝트입니다.",
  };


  useEffect(() => {
    if (isOpen && projectId) {
      fetchProjectData();
    }
    
    console.log(projectData)
  }, [isOpen, projectId]);

  const fetchProjectData = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/api/project/${projectId}`);
      console.log(response.data)
      setProjectData({
        title: response.data.title || "",
        type: response.data.type || "",
        status: response.data.status || "1", // status 기본값 설정
      });
    } catch (err) {
      setError("Failed to fetch project data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Updated projectData:", projectData);
  }, [projectData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({ ...prev, [name]: value }));
    if (onChangeProject) onChangeProject(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axiosInstance.put(`/api/project/${projectId}`, projectData);
      if (onSubmit) onSubmit(projectData);
      onClose();
    } catch (err) {
      setError("Failed to save project.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">프로젝트 수정</h2>

        {error && <span className="text-red-500 mb-4">{error}</span>}

        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col mb-3">
              <span className="bg-white text-gray-500 text-xs relative top-2 w-fit px-1 ml-2">
                프로젝트 제목
              </span>
              <input
                type="text"
                name="title"
                value={projectData.title}
                onChange={handleChange}
                className="border rounded-md h-[60px] indent-4 mr-2 text-sm"
                required
              />
            </div>

            <div className="flex flex-col mb-1">
              <span className="bg-white text-gray-500 text-xs relative top-2 w-fit px-1 ml-2">
                프로젝트 형태
              </span>
              <select
                name="type"
                value={projectData.type}
                onChange={handleChange}
                className="border rounded-md h-[60px] indent-4 mr-2 text-sm outline-none"
                required
              >
                <option value="1">부서 내 프로젝트</option>
                <option value="2">회사 내 프로젝트</option>
                <option value="3">협력 프로젝트</option>
                <option value="4">팀 프로젝트</option>
                <option value="5">공개 프로젝트</option>
              </select>
            </div>
            <div className="flex flex-col mb-3">
              <span className="text-xs text-gray-600 px-1">{typeDescriptions[projectData.type]}</span>
            </div>

            <div className="flex flex-col mb-6">
              <span className="bg-white text-gray-500 text-xs relative top-2 w-fit px-1 ml-2">
                프로젝트 상태
              </span>
              {isLoading ? (
                <p className="text-gray-500">Loading...</p>
              ) : (
                  <select
                    name="status"
                    value={projectData.status}
                    onChange={handleChange}
                    className="border rounded-md h-[60px] indent-4 mr-2 text-sm outline-none"
                    required
                  >
                    <option value="1">대기 중</option>
                    <option value="2">진행 중</option>
                    <option value="3">완료</option>
                  </select>
                  )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled={isLoading}
              >
                저장
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export const AddProjectModal = ({
  isOpen,
  onClose,
  text,
  selectedUsers = [],
  selectedTemplate,
  setSelectedUsers,
  projectId,
  onItemClick,
  type
}) => {
  if (!isOpen) return null;

  const ProfileURI = PROFILE_URI;
  const loginUser = useUserStore((state) => state.user)
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState((type==null||type===1)?loginUser.groupId:0);
  const [listType, setListType] = useState(1);
  const [project, setProject] = useState({
    title: "새 프로젝트",
    type: type||1,
    template: selectedTemplate,
    coworkers: selectedUsers,
    ...(selectedTemplate && { columns: templates[selectedTemplate].columns }) // selectedTemplate이 있을 때만 columns 설정
  });
  const fetchAllUsers = async ({ pageParam }) => {
    try {
      const response = await axiosInstance.get(
        `/api/users/all?page=${pageParam}&keyword=${searchKeyword}&id=${selectedGroupId}`
      );
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
      if (!lastPage||!lastPage.hasNextPage) {
        return null;
      }

      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }

      return null;
    },
    select: (data) => {
      const allUsers = data.pages.flatMap((page) => page.users);
      return { ...data, pages: [{ ...data.pages[0], users: [...new Set(allUsers)] }],};
    },
    cacheTime: 6 * 1000 * 60,
    retry: false,
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
      if (!lastPage||!lastPage.hasNextPage) {
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

  const observer = useRef();
  const observerGroups = useRef();
  const lastUserRef = useCallback(
    (node) => {
      if (isFetchingNextPageAllUsers) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPageAllUsers) {
          fetchNextPageAllUsers();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPageAllUsers, hasNextPageAllUsers, fetchNextPageAllUsers]
  );
  const lastGroupRef = useCallback(
    (node) => {
      if (isFetchingNextPageAllGroups) return;
      if (observerGroups.current) observerGroups.current.disconnect();
      observerGroups.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPageAllGroups) {
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

  // 검색 입력 핸들러
  const handleSearch = (e) => {
    setSearchKeyword(e.target.value.toLowerCase());
    setListType(1); selectGroup(0)
  };

  // 프로젝트 상태 변경 핸들러
  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && value !== "2" ? { coworkers: [] } : {}),
    }));
    if (name === 'type' && value === "2") { selectGroup(0);}
    if (name === 'type' && value === "1") { selectGroup(loginUser.groupId);setListType(1);}
  };
  
  // 멤버 클릭 핸들러 (토글 방식)
  const handleMemberClick = (member) => {
    if(loginUser.grade==1&&project.coworkers.length>2){alert('해당 플랜은 작업자를 최대 3명까지만 지정할 수 있습니다!'); return;}
    else if(loginUser.grade==2&&project.coworkers.length>9){alert('해당 플랜은 작업자를 최대 10명까지만 지정할 수 있습니다!'); return;}
    setProject((prev) => {
      const isSelected = prev.coworkers.some((user) => user.userId == member.id);
      const updatedCoworkers = isSelected
        ? prev.coworkers.filter((user) => user.userId != member.id) // 선택 해제
        : [...prev.coworkers, {userId:member.id, name:member.name, group:member.group, profile:member.profile, level:member.level, email:member.email}]; // 선택 추가
      
      return {
        ...prev,
        coworkers: updatedCoworkers,
      };
    });
    setSearchKeyword(""); // 검색어 초기화
    document.getElementById("focus").focus();
  };
  
  // 멤버 삭제 핸들러
  const handleDeleteTag = (index) => {
    setProject((prev) => ({
      ...prev,
      coworkers: prev.coworkers.filter((_, i) => i !== index),
    }));
  };

  const selectGroup = (id) => {
    setSelectedGroupId((prev) => (prev === id ? 0 : id));
  };

  const handleSubmit = async () => {
    if(text === "작업자 추가") {
      const prevCoworkers = selectedUsers; // 기존 작업자 목록
      const newCoworkers = project.coworkers; // 수정 후 작업자 목록

      const coworkerIds = new Set(prevCoworkers.map((coworker) => coworker.userId)); // 기존 작업자 ID 집합
      const newCoworkerIds = new Set(newCoworkers.map((user) => user.userId)); // 수정 후 작업자 ID 집합

      const addedCoworkers = newCoworkers.filter((user) => !coworkerIds.has(user.userId));
      const removedCoworkers = prevCoworkers.filter((coworker) => !newCoworkerIds.has(coworker.userId));

      const payload = {
        projectId: projectId,
        addedCoworkers: addedCoworkers.map((user) => user.userId ),
        removedCoworkers: removedCoworkers.map((coworker) => coworker.userId),
      };
      console.log(payload)
      try {
        await axiosInstance.patch(`/api/project/coworkers`, payload);
      
        setProject((prev) => ({
          ...prev,
          coworkers: newCoworkers,
        }));
      
        alert("작업자 목록이 성공적으로 수정되었습니다.");
        setSelectedUsers(newCoworkers);
        onClose();
      } catch (error) {
        console.error("작업자 수정 중 오류 발생:", error);
        alert("작업자 목록 수정 중 오류가 발생했습니다.");
      }
    }
    else{
      try {
        console.log(project);
        const res = await axiosInstance.post('/api/project', project);
        console.log(res.data)
        onItemClick(res.data)
        onClose();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg max-w-3xl modal-custom-width px-5">
        <div className="absolute top-5 right-5 rounded-t-xl">
          <button
            onClick={() => onClose(false)}
            className="text-md float-right display-block font-bold text-gray-600 hover:text-gray-900"
          >
            <CustomSVG id="close" />
          </button>
        </div>
        <div className="modal-content flex flex-col items-center">
          <div className="text-xl pt-7 px-12">{text}</div>
          {text === "새 프로젝트" && (
            <>
              <span className="text-xs font-light text-gray-500 mt-10">
                새 프로젝트를 만드시겠어요? 도와드릴테니 같이 만들어봐요!
              </span>
              <div className="w-full flex flex-col mt-10">
                <span className="bg-white text-gray-500 text-xs relative top-2 w-fit ml-10 px-1">
                  프로젝트 명
                </span>
                <input
                  type="text"
                  className="border rounded-md h-[45px] indent-4"
                  placeholder="프로젝트 이름을 입력해주세요"
                    onChange={handleProjectChange}
                    value={project.title}
                    name="title"
                />
              </div>
              <div className="flex w-full">
                <div className="w-2/5 flex flex-col">
                  <span className="bg-white text-gray-500 text-xs relative top-2 w-fit ml-10 px-1">
                    프로젝트 형태
                  </span>
                  <select
                    value={project.type}
                    onChange={handleProjectChange}
                    name="type"
                    className="border rounded-md h-[60px] indent-4 mr-2 text-sm"
                  >
                    <option value="1" selected>부서 내 프로젝트</option>
                    <option value="2">회사 내 프로젝트</option>
                    <option value="3">협력 프로젝트</option>
                    <option value="4">팀 프로젝트</option>
                    <option value="5">공개 프로젝트</option>
                  </select>
                </div>
                <div className="w-3/5 flex flex-col">
                  <span className="bg-white text-gray-500 text-xs relative top-2 w-fit ml-10 px-1">
                    작업자 목록 ({project.coworkers.length})
                  </span>

                  <div className="border rounded h-[60px] p-3 flex items-center gap-1 overflow-x-auto overflow-y-hidden scrollbar-thin">
                    {project.coworkers.map((user, index) => (
                      <span
                        key={index}
                        className="flex items-center flex-shrink-0 gap-[2px] px-2 py-[2px] rounded-2xl bg-indigo-200 bg-opacity-70 text-xs text-indigo-500"
                      >
                        <img src={`${ProfileURI}${user.profile}`} className="h-[24px] w-[24px] object-cover rounded-full" />
                        <span className="">{user.name}</span>
                        <span className="text-indigo-400">({user.group})</span>
                        <button onClick={() => handleDeleteTag(index)}>
                          <CustomSVG id="cancel" color="#666CFF" />
                        </button>
                      </span>
                    ))}
                    <input
                      id="focus"
                      type="text"
                      value={searchKeyword}
                      autoFocus
                      onChange={handleSearch}
                      className="border-0 flex-shrink-0 min-w-[100px]"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          {text === "작업자 추가" && (
            <>
              <span className="text-xs font-light text-gray-500 mt-10">
                함께 작업할 사람을 자유롭게 초대해보세요
              </span>

              <span className="bg-white text-gray-500 text-xs relative top-2 right-[43%] w-fit ml-10 px-1">
                작업자 목록 ({project.coworkers.length})
              </span>

              <div className="border rounded-md h-[60px] p-3 flex items-center gap-1 overflow-x-auto overflow-y-hidden scrollbar-thin w-full">
                {project.coworkers.map((user, index) => (
                  <span
                    key={index}
                    className="flex items-center flex-shrink-0 gap-[2px] px-2 py-[2px] rounded-2xl bg-indigo-200 bg-opacity-70 text-xs text-indigo-500"
                  >
                    <img src={`${ProfileURI}${user.profile}`} className="h-[24px] w-[24px] object-cover rounded-full" />
                        <span className="">{user.name}</span>
                        <span className="text-indigo-400"> ({user.group})</span>
                    <button onClick={() => handleDeleteTag(index)}>
                      <CustomSVG id="cancel" color="#666CFF" />
                    </button>
                  </span>
                ))}
                <input
                  id="focus"
                  type="text"
                  value={searchKeyword}
                  onChange={handleSearch}
                  autoFocus
                  className="border-0 flex-shrink-0 min-w-[100px]"
                />
              </div>
            </>
          )}
          {/* 리스트 */}
          <ul className="border rounded-lg w-full h-[400px] mt-10 px-4 pb-3 overflow-auto scrollbar-none scroll-smooth relative">
          {
            selectedGroupId === null ? (
              project.type === 1 ? (
                <>
                  <li>부서가 존재하지 않습니다.</li>
                </>
              ) : null
            ) : (
              <>
                {project.type == "2" && (
                  <div className="cursor-pointer text-xs sticky bg-white top-0 text-left z-30 py-2 mt-0">
                    <span onClick={() => { setListType(1); selectGroup(0); }}> 전체 보기 </span> | 
                    <span onClick={() => setListType(2)}> 부서별 보기 </span>
                  </div>
                )}

                {listType === 1 && (
                  <>
                    {allUsers &&
                    allUsers.pages[0] &&
                    allUsers.pages[0].users &&
                    allUsers.pages[0].users.length > 0 ? (
                      allUsers.pages[0].users
                        .filter(m => m.id !== loginUser.id)
                        .map((m) => (
                          <li
                            key={m?.id}
                            onClick={() => handleMemberClick(m)}
                            className={`rounded-3xl px-3 py-3 flex mt-2 cursor-pointer border border-transparent ${
                              project.coworkers.some((coworker) => coworker.userId === m.id)
                                ? "bg-indigo-100 hover:border-indigo-300"
                                : "bg-gray-100 hover:border-gray-300"
                            }`}
                          >
                            <img
                              src={m.profile!=null?ProfileURI+m.profile:"/images/user_face_icon.png"}
                              alt="user-img"
                              className="w-[45px] h-[45px] rounded-full object-cover"
                            />
                            <div className="ml-10 flex flex-col text-left">
                              <p className="font-light text-black">
                                <span className="opacity-80">{m?.group} </span>
                                {m?.name}
                              </p>
                              <span className="font-light text-black opacity-50 text-sm">
                                {m?.email}
                              </span>
                            </div>
                          </li>
                        ))
                    ) : (
                      <li>로딩중입니다...</li>
                    )}
                    {hasNextPageAllUsers && (
                      <div ref={lastUserRef} className="text-center mt-4">
                        {(isFetchingNextPageAllUsers) 
                          ? "Loading more..."
                          : "Load more"}
                      </div>
                    )}
                  </>
                )}

                {listType === 2 && (
                  <>
                    {allGroups &&
                    allGroups.pages[0] &&
                    allGroups.pages[0].groups &&
                    allGroups.pages[0].groups.length > 0 ? (
                      allGroups.pages[0].groups
                        .slice()
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((group) => (
                          <li key={group.id}>
                            <div
                              onClick={() => selectGroup(group.id)}
                              className="flex justify-between items-center px-[10px] relative border-b"
                            >
                              <div className="flex flex-col">
                                <div className="flex px-3 py-2 cursor-pointer">
                                  <span className="mr-[10px]">{group.name}</span>
                                  <span className="text-gray-400">({group.cnt})</span>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <CustomSVG
                                  id={selectedGroupId == group.id && "expand-up" || "expand-down"}
                                  color="currentColor"
                                />
                              </div>
                            </div>
                            {selectedGroupId == group.id && (
                              <ul className="pl-4 mt-2 max-h-[330px] overflow-auto scrollbar-none border-b pb-3">
                                {allUsers &&
                                allUsers.pages[0] &&
                                allUsers.pages[0].users &&
                                allUsers.pages[0].users.length > 0 ? (
                                  allUsers.pages[0].users
                                    .filter(m => m.id !== loginUser.id)
                                    .slice()
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map((m) => (
                                      <li
                                        key={m.id}
                                        onClick={() => handleMemberClick(m)}
                                        className={`flex rounded-3xl p-3 mt-2 cursor-pointer border border-transparent ${
                                          project.coworkers.some((coworker) => coworker.userId === m.id)
                                            ? "bg-indigo-100 hover:border-indigo-300"
                                            : "bg-gray-100 hover:border-gray-300"
                                        }`}
                                      >
                                        <img
                                          src={m.profile!=null?ProfileURI+m.profile:"/images/user_face_icon.png"}
                                          alt="user-img"
                                          className="w-[45px] h-[45px] rounded-full"
                                        />
                                        <div className="ml-10 flex flex-col text-left">
                                          <p className="font-light text-black">
                                            <span className="opacity-80">{m.group} </span>
                                            {m.name}
                                          </p>
                                          <span className="font-light text-black opacity-50 text-sm">
                                            {m.email}
                                          </span>
                                        </div>
                                      </li>
                                    ))
                                ) : (
                                  <li>로딩중입니다...</li>
                                )}
                                {hasNextPageAllUsers && (
                                  <div ref={lastUserRef} className="text-center mt-4">
                                    {(isFetchingNextPageAllUsers) 
                                      ? "Loading more..."
                                      : "Load more"}
                                  </div>
                                )}
                              </ul>
                            )}
                          </li>
                        ))
                    ) : (
                      <li>로딩중입니다...</li>
                    )}
                    {hasNextPageAllGroups && (
                      <div ref={lastGroupRef} className="text-center mt-4">
                        {isFetchingNextPageAllGroups
                          ? "Loading more..."
                          : "Load more"}
                      </div>
                    )}
                  </>
                )}
              </>
            )
          }

          </ul>
          <div className="flex justify-between w-full mt-1">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <CustomSVG id="supervised-user" />
              프로젝트 공개설정 : 누구나
            </span>
            <span className="flex items-center gap-1 text-xs text-[#7E7EDF]">
              <CustomSVG id="link" color="currentColor" />
              공유 링크 복사
            </span>
          </div>
          <button
            className="h-[40px] bg-[#7E7EDF] px-8 text-white rounded-[8px] mt-10 mb-[30px]"
            onClick={handleSubmit}
          >
            {(text === "작업자 추가" && "초대하기") || "생성하기"}
          </button>
        </div>
      </div>
    </div>
  );
};
