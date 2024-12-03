import React, { useState } from "react";
import PropTypes from "prop-types";
import "@/pages/community/Community.scss";
import { Link, useParams } from "react-router-dom";

export default function CommunitySidebar({
  userRole = "user", // 기본값: 일반 사용자
  currentUser = null,
  departmentBoards = [], // 부서별 게시판
  userBoards = [], // 사용자 게시판
  onDeleteBoard = () => {},
  onUpdateBoard = () => {},
  onNewPost = () => {},
  onNewUserBoard = () => {},
}) {
  const { boardType } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
  const [boards, setBoards] = useState(userBoards); // 사용자 게시판 상태
  const [newBoardName, setNewBoardName] = useState(""); // 새 게시판 이름
  const [newBoardDescription, setNewBoardDescription] = useState(""); // 새 게시판 설명

  // 열림/닫힘 상태 관리
  const [sections, setSections] = useState({
    favorites: true,
    allBoards: true,
    departmentBoards: true,
    myBoards: true,
  });

  // 특정 섹션의 열림/닫힘 토글 함수
  const toggleSection = (section) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section], // 상태 반전
    }));
  };

  // 모달 열기/닫기
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // 새 게시판 생성 핸들러
  const handleCreateBoard = () => {
    if (!newBoardName.trim() || !newBoardDescription.trim()) {
      alert("게시판 이름과 설명을 입력해주세요.");
      return;
    }

    const newBoard = {
      key: new Date().getTime().toString(), // 임시 키
      label: newBoardName,
      description: newBoardDescription,
    };

    setBoards((prevBoards) => [...prevBoards, newBoard]); // 상태 업데이트
    onNewUserBoard(newBoard); // 필요한 경우 서버와 연동
    alert(`새 개인 게시판 "${newBoard.label}"이 생성되었습니다!`);
    setNewBoardName(""); // 입력 초기화
    setNewBoardDescription("");
    handleCloseModal();
  };

  // 즐겨찾기 상태 관리
  const [favorites, setFavorites] = useState({}); // 키: 게시판 ID, 값: 즐겨찾기 여부

  // 즐겨찾기 토글 핸들러
  const toggleFavorite = (key) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [key]: !prevFavorites[key], // 현재 상태 반전
    }));
  };

  // 게시판 데이터
  const boardData = [
    { key: "notice", label: "공지사항" },
    { key: "archive", label: "자료실" },
    { key: "free", label: "자유게시판" },
    { key: "secret", label: "익명 게시판" },
    { key: "menuToday", label: "오늘의 식단" },
    ...departmentBoards.map((board) => ({
      key: board.key,
      label: board.label,
    })),
  ];

  // 즐겨찾기 항목 필터링
  const favoriteBoards = boardData.filter((board) => favorites[board.key]);

  return (
    <aside className="community-aside overflow-scroll flex flex-col scrollbar-none p-4">
      {/* 상단 메뉴 */}
      <div className="flex justify-around items-center mb-6">
        {[
          { icon: "/images/checkbox.png", label: "최신글" },
          { icon: "/images/alert-circle.png", label: "필독" },
          { icon: "/images/account-check.png", label: "내 게시글" },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center">
            <img src={item.icon} alt={item.label} className="w-6 h-6 mb-1" />
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </div>

      {/* 즐겨찾기 섹션 */}
      <div className="mb-6">
        <div
          className="flex justify-between items-center px-4 py-2 cursor-pointer"
          onClick={() => toggleSection("favorites")}
        >
          <p className="font-semibold">즐겨찾기</p>
          <img
            className="w-3 h-2 transition-transform duration-300"
            src="/images/arrow-top.png"
            alt="toggle"
            style={{
              transform: sections.favorites ? "rotate(0deg)" : "rotate(180deg)",
            }}
          />
        </div>
        {sections.favorites &&
          (favoriteBoards.length === 0 ? (
            <div className="px-4 py-2 text-gray-500">
              게시판명 옆의{" "}
              <img
                src="/images/star_on.png"
                alt="star"
                className="inline-block w-4 h-4 mx-1"
              />{" "}
              을 선택해서 추가 해주세요.
            </div>
          ) : (
            favoriteBoards.map((board) => (
              <div
                key={board.key}
                className="flex items-center justify-between px-8 py-1 group"
              >
                <img
                  src="/images/document_text.png"
                  alt="icon"
                  className="w-5 h-5 mr-2"
                />
                <p className="flex-grow">{board.label}</p>
                <img
                  src="/images/star_on.png"
                  alt="star"
                  className="cursor-pointer"
                  onClick={() => toggleFavorite(board.key)}
                />
              </div>
            ))
          ))}
      </div>

      {/* 전체 게시판 */}
      <div className="mb-6">
        <div
          className="flex justify-between items-center px-4 py-2 cursor-pointer"
          onClick={() => toggleSection("allBoards")}
        >
          <p className="font-semibold">전체 게시판</p>
          <img
            className="w-3 h-2 transition-transform duration-300"
            src="/images/arrow-top.png"
            alt="toggle"
            style={{
              transform: sections.allBoards ? "rotate(0deg)" : "rotate(180deg)",
            }}
          />
        </div>
        {sections.allBoards &&
          boardData.map((board) => (
            <div
              key={board.key}
              className="flex items-center justify-between px-8 py-1 group"
            >
              <img
                src="/images/document_text.png"
                alt="icon"
                className="w-5 h-5 mr-2"
              />
              <Link
                to={`/community/${board.key}/list`}
                className="flex-grow hover:underline"
              >
                {board.label}
              </Link>
              <img
                src={
                  favorites[board.key]
                    ? "/images/star_on.png"
                    : "/images/star_off.png"
                }
                alt="star"
                className={`cursor-pointer ${
                  favorites[board.key]
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                } transition-opacity duration-300`}
                onClick={() => toggleFavorite(board.key)}
              />
            </div>
          ))}
      </div>

      {/* 부서별 게시판 */}
      <div className="mb-6">
        <div
          className="flex justify-between items-center px-4 py-2 cursor-pointer"
          onClick={() => toggleSection("departmentBoards")}
        >
          <p className="font-semibold">부서별 게시판</p>
          <img
            className="w-3 h-2 transition-transform duration-300"
            src="/images/arrow-top.png"
            alt="toggle"
            style={{
              transform: sections.departmentBoards
                ? "rotate(0deg)"
                : "rotate(180deg)",
            }}
          />
        </div>
        {sections.departmentBoards &&
          departmentBoards.map((board) => (
            <div
              key={board.key}
              className="flex items-center justify-between px-8 py-1 group"
            >
              <img
                src="/images/document_text.png"
                alt="icon"
                className="w-5 h-5 mr-2"
              />
              <p className="flex-grow">{board.label}</p>
            </div>
          ))}
      </div>

 
        {sections.myBoards &&
          boards.map((board) => (
            <div
              key={board.key}
              className="flex items-center justify-between px-8 py-1 group"
            >
              <img
                src="/images/document_text.png"
                alt="icon"
                className="w-5 h-5 mr-2"
              />
              <p className="flex-grow">{board.label}</p>
            </div>
          ))}
 

      {/* 새 게시글 작성 버튼 */}
      <Link
        to={`/community/${boardType}/write`}
        className="new-user-board-button flex items-center justify-center px-4 py-2 mt-4 space-x-2 w-full min-w-[150px] rounded-md"
      >
        <img
          src="/images/component.png"
          alt="새 게시글"
          className="w-5 h-5 mr-2"
        />
        새 게시글 작성
      </Link>

      
 

    </aside>
  );
}

CommunitySidebar.propTypes = {
  userRole: PropTypes.string,
  currentUser: PropTypes.string,
  departmentBoards: PropTypes.array,
  userBoards: PropTypes.array,
  onDeleteBoard: PropTypes.func,
  onUpdateBoard: PropTypes.func,
  onNewPost: PropTypes.func,
  onNewUserBoard: PropTypes.func,
};
 