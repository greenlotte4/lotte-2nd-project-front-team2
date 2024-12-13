import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "@/pages/community/Community.scss";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import useUserStore from "../../store/useUserStore";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../services/axios";

function CommunityList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { boardId } = useParams();
  console.log("보드 들어오나보자" + boardId); // boardId 값 확인

  const { boardName } = useParams();
  const currentUser = useUserStore((state) => state.user);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // 글 목록을 가져오는 함수
  const fetchPosts = async () => {
    const response = await axiosInstance.get(
      `/api/community/posts?boardId=${boardId}`
    );
    return response.data;
  };
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생: {error.message}</div>;

  // 검색 필터링
  const filteredData = data.filter(
    (item) =>
      item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase()) // null/undefined 체크 후 toLowerCase() 호출
  );

  // 페이지네이션 데이터 계산
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 페이지네이션 핸들러
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div id="community-container">
      <CommunitySidebar currentUser={currentUser} boardId={boardId} />

      <div className="list-container">
        <div className="list-container2">
          <h2>{boardName}</h2>

          <div className="list-header">
            <input
              type="text"
              placeholder="검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="view-toggle">
              <span>view:</span>
              <button className="view-button">☰</button>
              <button className="view-button">▦</button>
            </div>
          </div>

          {/* 테이블 */}
          <table className="list-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일자</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={item.postId}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td>
                    <Link to={`/community/${boardId}/view/${item.postId}`}>
                      {item.title}
                    </Link>
                  </td>
                  <td>{item.writer}</td>
                  <td>{item.createdAt.split("T")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 하단 버튼 및 페이지네이션 */}
          <div className="list-footer">
            <button className="delete-button">선택삭제</button>
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                이전
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={currentPage === index + 1 ? "active" : ""}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                다음
              </button>
            </div>

            {/* 글쓰기 버튼 */}
            <button
              className="create-button"
              onClick={() => navigate(`/community/${boardId}/write`)}
            >
              <img
                src="/images/component.png"
                alt="새 게시글"
                className="button-icon"
              />
              글쓰기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityList;
