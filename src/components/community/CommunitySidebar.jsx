import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "@/pages/community/Community.scss";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "@/services/axios";

export default function CommunitySidebar({
  userRole = "user",
  currentUser = null,
  departmentBoards: initialDepartmentBoards = [],
  userBoards: initialUserBoards = [],
  onDeleteBoard = () => {},
  onUpdateBoard = () => {},
  onNewPost = () => {},
  onNewUserBoard = () => {},
}) {
  const { boardType } = useParams();

  // State 초기화
  const [boards, setBoards] = useState(initialUserBoards);
  const [departmentBoards, setDepartmentBoards] = useState([]);

  const [favoriteIds, setFavoriteIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardDescription, setNewBoardDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 상태값과 슬러그 매핑
  const statusToSlug = {
    1: "notice", // 공지사항
    2: "secret", // 익명게시판
    3: "free", // 자유게시판
    4: "archive", // 자료실
    5: "menuToday", // 오늘의 식단
    6: "department", // 부서별 게시판
    default: "unknown", // 기본값 추가
  };

  const [sections, setSections] = useState({
    favorites: true,
    allBoards: true,
    departmentBoards: true,
    myBoards: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          userBoardsResponse,
          departmentBoardsResponse,
          favoritesResponse,
        ] = await Promise.all([
          axiosInstance.get("/api/community/boards"),

          axiosInstance.get("/api/community/boards/group/1"),
          axiosInstance.get("/api/community/favorites"),
        ]);

        setBoards(userBoardsResponse?.data || []);

        {
          /*부서별*/
        }
        setDepartmentBoards(
          Array.isArray(departmentBoardsResponse?.data)
            ? departmentBoardsResponse.data
            : departmentBoardsResponse
            ? [departmentBoardsResponse.data]
            : []
        );

        setFavoriteIds(
          favoritesResponse?.data?.map((fav) => fav.boardId) || []
        );
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        setError("데이터를 로드하는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleSection = (section) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCreateBoard = () => {
    if (!newBoardName.trim() || !newBoardDescription.trim()) {
      alert("게시판 이름과 설명을 입력해주세요.");
      return;
    }

    const newBoard = {
      key: new Date().getTime().toString(),
      label: newBoardName,
      description: newBoardDescription,
    };

    setBoards((prevBoards) => [...prevBoards, newBoard]);
    onNewUserBoard(newBoard);
    alert(`새 게시판 "${newBoard.label}"이 생성되었습니다!`);
    setNewBoardName("");
    setNewBoardDescription("");
    handleCloseModal();
  };

  const toggleFavorite = (boardId) => {
    setFavoriteIds((prevFavorites) =>
      prevFavorites.includes(boardId)
        ? prevFavorites.filter((id) => id !== boardId)
        : [...prevFavorites, boardId]
    );
  };

  const favoriteBoards = boards.filter((board) =>
    favoriteIds.includes(board.boardId)
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

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
                key={board.boardId}
                className="flex items-center justify-between px-8 py-1 group"
              >
                <img
                  src="/images/document_text.png"
                  alt="icon"
                  className="w-5 h-5 mr-2"
                />
                {/* Link가 연결되도록 수정 */}
                <Link
                  to={`/community/${
                    statusToSlug[board.status] || statusToSlug.default
                  }/list`}
                  className="flex-grow hover:underline"
                >
                  {board.boardName || "이름 없음"}
                </Link>
                <img
                  src="/images/star_on.png"
                  alt="star"
                  className="cursor-pointer"
                  onClick={() => toggleFavorite(board.boardId)}
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
          boards.map((board) => (
            <div
              key={board.boardId}
              className="flex items-center justify-between px-8 py-1 group"
            >
              <img
                src="/images/document_text.png"
                alt="icon"
                className="w-5 h-5 mr-2"
              />
              <Link
                to={`/community/${
                  statusToSlug[board.status] || statusToSlug.default
                }/list`}
                className="flex-grow hover:underline"
              >
                {board.boardName}
              </Link>
              <img
                src={
                  favoriteIds.includes(board.boardId)
                    ? "/images/star_on.png"
                    : "/images/star_off.png"
                }
                alt="star"
                className={`cursor-pointer ${
                  favoriteIds.includes(board.boardId)
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                } transition-opacity duration-300`}
                onClick={() => toggleFavorite(board.boardId)}
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
          (departmentBoards.length > 0 ? (
            departmentBoards.map((board) => (
              <div
                key={board.boardId || board.key || Math.random()} // 고유한 key 설정
                className="flex items-center justify-between px-8 py-1 group"
              >
                <img
                  src="/images/document_text.png"
                  alt="icon"
                  className="w-5 h-5 mr-2"
                />
                {board.boardName ? (
                  <Link
                    to={`/community/${board.boardId}/list`}
                    className="flex-grow hover:underline"
                  >
                    {board.boardName}
                  </Link>
                ) : (
                  <p className="flex-grow text-gray-500">이름 없음</p>
                )}
                <img
                  src={
                    favoriteIds.includes(board.boardId)
                      ? "/images/star_on.png"
                      : "/images/star_off.png"
                  }
                  alt="star"
                  className={`cursor-pointer ${
                    favoriteIds.includes(board.boardId)
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  } transition-opacity duration-300`}
                  onClick={() => toggleFavorite(board.boardId)}
                />
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">
              부서별 게시판이 없습니다.
            </div>
          ))}
      </div>

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

      {/* 새 개인 게시판 생성 버튼 */}
      <button
        onClick={handleOpenModal}
        className="new-user-board-button flex items-center justify-center px-4 py-2 mt-4 space-x-2 w-full min-w-[150px] rounded-md"
      >
        <img
          src="/images/Vector.png"
          alt="새 개인 게시판"
          className="w-5 h-5 mr-2"
        />
        새 게시판 생성
      </button>

      {/* 모달 */}
      {isModalOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg p-6 w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">새게시판 생성</h2>
            <div className="mb-4">
              <label className="block font-medium mb-1">게시판 이름</label>
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="게시판 이름을 입력하세요"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">게시판 설명</label>
              <textarea
                value={newBoardDescription}
                onChange={(e) => setNewBoardDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="게시판 설명을 입력하세요"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              >
                취소
              </button>
              <button
                onClick={handleCreateBoard}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                생성
              </button>
            </div>
          </div>
        </div>
      )}
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
