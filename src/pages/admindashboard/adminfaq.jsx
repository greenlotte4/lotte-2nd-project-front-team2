import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MainHeader from "../../layout/rending/mainHeader";
import MainFooter from "../../layout/rending/mainFooter";

const AdminFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [inquiries, setInquiries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // 서버로부터 FAQ 목록 가져오기 (Read)
  useEffect(() => {
    axios
    .get("/api/faqs")
    .then((response) => {
      // 응답 데이터가 배열인지 확인
      if (Array.isArray(response.data)) {
        setInquiries(response.data);
      } else {
        console.error("Invalid API response format", response.data);
        setInquiries([]); // 비정상 데이터인 경우 빈 배열로 초기화
      }
    })
    .catch((error) => {
      console.error("Error fetching FAQs:", error);
      setInquiries([]); // 에러 시 빈 배열로 초기화
    });
}, []);

  // 검색 및 필터링된 목록
  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch = inquiry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "전체" || inquiry.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // 페이지네이션
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
  const currentItems = filteredInquiries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginate = (page) => setCurrentPage(page);

  // 답변 저장 (Update)
  const handleSaveReply = () => {
    axios
      .put(`/api/faqs/${selectedInquiry.id}`, { reply: replyContent, status: "답변완료" })
      .then((response) => {
        setInquiries(
          inquiries.map((inquiry) => (inquiry.id === selectedInquiry.id ? response.data : inquiry))
        );
        setSelectedInquiry(null);
        setReplyContent("");
      })
      .catch((error) => console.error("Error updating FAQ:", error));
  };

  // 삭제 기능 (Delete)
  const handleDeleteInquiry = (id) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      axios
        .delete(`/api/faqs/${id}`)
        .then(() => setInquiries(inquiries.filter((item) => item.id !== id)))
        .catch((error) => console.error("Error deleting FAQ:", error));
    }
  };

  return (
    <>
      <MainHeader />
      <div className="min-h-screen bg-gray-50 pt-[120px] px-6">
        <div className="max-w-7xl mx-auto flex gap-6">
          {/* Sidebar */}
          <aside className="w-1/4 bg-white p-4 rounded-lg shadow-lg">
            <ul>
              {["💳 PAYMENT", "↩️ CANCELLATION & RETURN", "❓ QNA", "⚙️ PRODUCT & SERVICES"].map((title, index) => (
                <li
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`py-3 px-4 mb-2 rounded-md cursor-pointer ${
                    activeIndex === index ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                  }`}
                >
                  {title}
                </li>
              ))}
            </ul>
          </aside>

          {/* Content */}
          <div className="w-3/4 bg-white shadow-lg rounded-lg p-6">
            {/* 검색 및 필터 */}
            <div className="flex justify-between mb-4">
              <input
                type="text"
                placeholder="검색어 입력"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border p-2 rounded w-3/4"
              />
              <select
                onChange={(e) => setFilterStatus(e.target.value)}
                value={filterStatus}
                className="border p-2 rounded"
              >
                <option value="전체">전체</option>
                <option value="답변대기">답변대기</option>
                <option value="답변완료">답변완료</option>
              </select>
            </div>

            {/* 리스트 */}
            <ul>
              {currentItems.map((inquiry) => (
                <li
                  key={inquiry.id}
                  className="flex items-center justify-between border-b py-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setSelectedInquiry(inquiry);
                    setReplyContent(inquiry.reply || "");
                  }}
                >
                  <div>
                    <h3 className="text-lg font-semibold">{inquiry.content}</h3>
                    <p className="text-sm text-gray-500">작성자: {inquiry.username}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        inquiry.status === "답변완료" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {inquiry.status}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteInquiry(inquiry.id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* 페이지네이션 */}
            <div className="flex justify-center mt-4">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 모달 */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">{selectedInquiry.content}</h2>
            <textarea
              rows="4"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setSelectedInquiry(null)} className="px-4 py-2 bg-gray-300 rounded">
                취소
              </button>
              <button onClick={handleSaveReply} className="px-4 py-2 bg-blue-500 text-white rounded">
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      <MainFooter />
    </>
  );
};

export default AdminFAQ;
