import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DiscussionEmbed } from "disqus-react";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import "@/pages/community/Community.scss";
import useUserStore from "../../store/useUserStore";

function CommunityView() {
  const navigate = useNavigate();
  const { boardType, postId } = useParams();
  const currentUser = useUserStore((state) => state.user); // 사용자 정보 가져오기

  // 더미 데이터 (API 연동 시 교체 가능)
  const dummyData = {
    id: postId,
    title: "[안내] 공지사항입니다.",
    date: "2022.11.30",
    author: "이상훈",
    isPinned: true, // 필독 여부
    pinnedPeriod: "2024.11.20 - 2024.11.20", // 필독 노출 기간
    content: `안녕하세요, 공지사항 내용입니다.
G사와 해외의 구매처를 사칭하는 피싱 문자 거래건과 관련하여
해외발 주문 및 이와 관련된 주요 공지 사항을 알려드립니다.`,
    attachments: [
      { name: "파일명1.pdf", url: "/downloads/file1.pdf" },
      { name: "파일명2.docx", url: "/downloads/file2.docx" },
    ],
  };

  useEffect(() => {
    // Remark42 댓글 설정
    const remark_config = {
      host: "http://localhost:9090", // Remark42 서버 URL
      site_id: "localhost:9090", // Docker Compose에서 설정한 SITE 값
      url: window.location.href, // 현재 페이지 URL
    };
    // 스크립트 추가
    const script = document.createElement("script");
    script.src = `${remark_config.host}/web/embed.js`;
    script.defer = true;
    script.crossOrigin = "anonymous";

    // 설정을 전역으로 전달
    window.remark_config = remark_config;

    // 스크립트 삽입
    document.head.appendChild(script);

    // Cleanup: 컴포넌트가 언마운트될 때 스크립트를 제거
    return () => {
      document.head.removeChild(script);
    };
  }, [postId]);

  return (
    <div id="community-container">
      {/* 사이드바 */}
      <CommunitySidebar currentUser={currentUser} />

      {/* 본문 */}
      <div className="community-view">
        {dummyData.isPinned && (
          <div className="pinned-info">
            필독 노출 기간: {dummyData.pinnedPeriod}
          </div>
        )}
        <h2>
          {dummyData.title}
          <span className="view-date">
            {dummyData.date}
            <strong className="author">작성자: {dummyData.author}</strong>
          </span>
        </h2>

        <div className="view-content">
          <p>{dummyData.content}</p>
        </div>
        {dummyData.attachments && dummyData.attachments.length > 0 && (
          <div className="view-attachments">
            <h4>첨부파일</h4>
            <ul>
              {dummyData.attachments.map((attachment, index) => (
                <li key={index}>
                  <button onClick={() => handleDownload(attachment.url)}>
                    {attachment.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="view-footer">
          <button
            onClick={() => navigate(`/community/${boardType}/list`)}
            className="list-button"
          >
            목록
          </button>
          <button
            onClick={() => navigate(`/community/${boardType}/modify/${postId}`)}
            className="modify-button"
          >
            수정
          </button>
          <button
            onClick={() => alert("삭제 기능은 구현되지 않았습니다.")}
            className="delete-button"
          >
            삭제
          </button>
        </div>

        {/* Remark42 댓글 섹션 */}
        <div className="comment-section">
          <h3>댓글</h3>
          <div id="remark42"></div>
        </div>
      </div>
    </div>
  );
}

export default CommunityView;
