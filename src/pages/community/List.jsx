import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "@/pages/community/Community.scss";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import useUserStore from "../../store/useUserStore";

function CommunityList() {
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const { boardType } = useParams();
  const currentUser = useUserStore((state) => state.user); // 사용자 정보 가져오기

  const itemsPerPage = 5; // 페이지당 아이템 개수
  const navigate = useNavigate(); // 라우팅용 navigate

  // boardType을 한글로 변환
  const boardTypeName =
    {
      notice: "공지사항",
      free: "자유게시판",
      archive: "자료실",
      secret: "익명게시판",
      menuToday: "오늘의 식단",
    }[boardType] || "게시판"; // 매핑되지 않은 값은 "게시판"으로 처리

  // 더미 데이터
  const data = [
    {
      id: 1,
      title: "공지사항입니다",
      author: "박서준",
      date: "2024-11-18 10:05",
    },
    {
      id: 2,
      title: "공지사항입니다",
      author: "이상훈",
      date: "2024-11-18 10:05",
    },
    {
      id: 3,
      title: "공지사항입니다",
      author: "박서준",
      date: "2024-11-18 10:05",
    },
    {
      id: 4,
      title: "공지사항입니다",
      author: "이상훈",
      date: "2024-11-18 10:05",
    },
    {
      id: 5,
      title: "공지사항입니다",
      author: "박서준",
      date: "2024-11-18 10:05",
    },
    {
      id: 6,
      title: "공지사항입니다",
      author: "이상훈",
      date: "2024-11-18 10:05",
    },
  ];

  // 검색 필터링
  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 페이지네이션 데이터 계산
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 페이지네이션 핸들러
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div id="community-container">
      {/* 사이드바 */}
      <CommunitySidebar currentUser={currentUser} />

      {/* 리스트 컨테이너 */}
      <div className="list-container">
        <div className="list-container2">
          <h2>{boardTypeName}</h2>

          {/* 헤더 */}
          <div className="list-header">
            <input
              type="text"
              placeholder="Find Document"
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
                <tr key={item.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td>
                    <Link to={`/community/${boardType}/view/${item.id}`}>
                      {item.title}
                    </Link>
                  </td>
                  <td>{item.author}</td>
                  <td>{item.date}</td>
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
              onClick={() => navigate(`/community/${boardType}/write`)}
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
