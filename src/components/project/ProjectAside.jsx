import ProjectAsideSection from "./ProjectAsideSection";
import { CustomSearch } from "../Search";
import { useEffect, useState } from "react";
import { AddProjectModal } from "./_Modal";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/axios.jsx";

function ProjectAside({ setData }) {

  const [openSections, setOpenSections] = useState({
    waiting: true,
    inProgress: true,
    completed: false,
  });
  const [activeItemId, setActiveItemId] = useState(null); // 활성화된 항목의 ID를 상태로 관리
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태 관리

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // 프로젝트 데이터를 가져오는 함수
  const fetchProjectsList = async () => {
    try {
      const response = await axiosInstance.get("/api/projects");
      return response.data;
    } catch (err) {
      return err;
    }
  };

  // useQuery 사용, refetch는 반환되는 객체에서 가져옴
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["projects", openSections], // openSections 상태가 변경될 때마다 쿼리 새로 호출
    queryFn: fetchProjectsList,
  });

  const projects = {
    waiting: { title: "대기중인 프로젝트", items: data?.waiting || [] },
    inProgress: { title: "진행중인 프로젝트", items: data?.inProgress || [] },
    completed: { title: "완료된 프로젝트", items: data?.completed || [] },
  };

  const count = data?.count;

 // 프로젝트 데이터를 가져오는 함수
 const fetchProject = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/project/${id}`);
    return response.data;
  } catch (err) {
    return err;
  }
};

  const handleItemClick = async (id) => {
    setActiveItemId(id); // 클릭된 항목의 ID를 활성화
    try {
      const projectData = await fetchProject(id); // API 호출
      console.log(projectData)
      setData(projectData); // 데이터를 상태로 설정
    } catch (err) {
      console.error(err)
      setData(null); // 기존 데이터 초기화
    }
  };
  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col max-w-full min-h-[100%] w-[270px] grow justify-between items-center p-2.5 bg-white rounded-3xl">
      {/* Header Section */}
      <section className="flex flex-col w-full min-h-[479px]">
        <h1 className="text-center text-black p-3">
          <span className="text-lg">내 프로젝트 ({count})</span>
        </h1>
        <CustomSearch width1="200" />

        {/* Dynamic Sections */}
        {Object.entries(projects).map(([key, section]) => (
          <ProjectAsideSection
            key={key}
            data={section}
            isCompleted={key === "completed"}
            isOpen={openSections[key]}
            toggleSection={() => toggleSection(key)}
            activeItemId={activeItemId}
            onItemClick={handleItemClick}
          />
        ))}
      </section>

      {/* Footer Section */}
      <section className="flex flex-col w-full">
        <div className="flex flex-col justify-center items-center self-center mt-2.5 w-full text-base text-center text-black">
          <hr className="w-full border border-solid border-neutral-500" />
          <button className="pt-3 pb-2" onClick={handleOpenModal}>
            새 프로젝트 생성
          </button>
        </div>
      </section>
      <AddProjectModal isOpen={isModalOpen} onClose={() => { handleCloseModal(); refetch(); }} text="새 프로젝트" />
    </div>
  );
}

export default ProjectAside;
