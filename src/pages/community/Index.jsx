import React, { useContext, useState } from "react";
import Sidebar from "@/components/community/CommunitySidebar";
import "@/pages/community/Community.scss";
import CommunityCard from "@/components/community/CommunityCard";
import useUserStore from "../../store/useUserStore";

export default function CommunityIndex() {
  // 즐겨찾기 상태 관리 (key → label 기반)
  const [favorites, setFavorites] = useState([]);
  const user = useUserStore((state) => state.user);
  console.log("사용자", user.uid);

  const toggleFavorite = (label) => {
    console.log("즐겨찾기 상태 변경 이전:", favorites); // 디버깅용 로그
    setFavorites(
      (prevFavorites) =>
        prevFavorites.includes(label)
          ? prevFavorites.filter((item) => item !== label) // 이미 존재하면 제거
          : [...prevFavorites, label] // 존재하지 않으면 추가
    );
    console.log("즐겨찾기 상태 변경 이후:", favorites); // 디버깅용 로그
  };
  // 현재 사용자와 권한
  const [userRole] = useState("user"); // 'admin' 또는 'user'

  // 게시판 데이터
  const [boards, setBoards] = useState([
    { key: "notice", label: "공지사항", owner: "admin" },
    { key: "archive", label: "자료실", owner: "admin" },
    { key: "freeBoard", label: "자유게시판", owner: "user123" },
    { key: "anonymousBoard", label: "익명 게시판", owner: "user123" },
    { key: "menuToday", label: "오늘의 식단", owner: "admin" },
  ]);

  const [departmentBoards, setDepartmentBoards] = useState([
    { key: "production", label: "생산팀", owner: "admin" },
    { key: "management", label: "관리팀", owner: "admin" },
    { key: "sales", label: "영업팀", owner: "admin" },
  ]);

  const [userBoards, setUserBoards] = useState([]); // 개인 게시판 데이터

  // 카드 데이터
  const cardsData = [
    { id: 1, title: "공지사항", content: "이번 주 공지사항입니다." },
    { id: 2, title: "자유게시판", content: "이번 주 자유게시판입니다." },
    { id: 3, title: "익명 게시판", content: "익명으로 의견을 남겨보세요." },
    { id: 4, title: "부서별 게시판", content: "부서별 공지사항을 확인하세요." },
    { id: 5, title: "자료실", content: "업무 자료를 공유하세요." },
    { id: 6, title: "오늘의 식단", content: "오늘의 메뉴를 확인하세요." },
  ];

  // 게시판 삭제
  const handleDeleteBoard = (key) => {
    setBoards((prevBoards) => prevBoards.filter((board) => board.key !== key));
    setDepartmentBoards((prevBoards) =>
      prevBoards.filter((board) => board.key !== key)
    );
    setUserBoards((prevBoards) =>
      prevBoards.filter((board) => board.key !== key)
    );
  };

  // 게시판 수정
  const handleUpdateBoard = (key) => {
    const updatedLabel = prompt("새로운 게시판 이름을 입력하세요:");
    if (updatedLabel) {
      setBoards((prevBoards) =>
        prevBoards.map((board) =>
          board.key === key ? { ...board, label: updatedLabel } : board
        )
      );
      setDepartmentBoards((prevBoards) =>
        prevBoards.map((board) =>
          board.key === key ? { ...board, label: updatedLabel } : board
        )
      );
      setUserBoards((prevBoards) =>
        prevBoards.map((board) =>
          board.key === key ? { ...board, label: updatedLabel } : board
        )
      );
    }
  };

 

  // 새 게시판 생성 (관리자만)
  const handleNewBoard = () => {
    const newBoardName = prompt("새로운 게시판 이름을 입력하세요:");
    if (newBoardName) {
      const newBoard = {
        key: `board-${Date.now()}`,
        label: newBoardName,
        owner: "admin",
      };
      setBoards((prevBoards) => [...prevBoards, newBoard]);
    }
  };

  // 새 게시글 작성
  const handleNewPost = () => {
    alert("새 게시글 작성 페이지로 이동합니다!");
  };

  return (
    <div id="community-container" className="flex">
      {/* Sidebar */}
      <Sidebar
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        userRole={userRole}
        currentUser={user}
        departmentBoards={departmentBoards}
        userBoards={userBoards}
        onDeleteBoard={handleDeleteBoard}
        onUpdateBoard={handleUpdateBoard}
        onNewBoard={handleNewBoard}
        onNewPost={handleNewPost}
      />

      {/* Main Content */}
      <div className="community-main flex-1 p-4">
        <div className="flex flex-col space-y-6">
          {/* 첫 번째 줄의 카드 */}
          <div className="flex flex-row justify-evenly w-full gap-4 mb-6">
            {cardsData.slice(0, 3).map((card) => (
              <CommunityCard
                key={card.id}
                title={card.title}
                content={card.content}
              />
            ))}
          </div>
          {/* 두 번째 줄의 카드 */}
          <div className="flex flex-row justify-evenly w-full gap-4">
            {cardsData.slice(3).map((card) => (
              <CommunityCard
                key={card.id}
                title={card.title}
                content={card.content}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
