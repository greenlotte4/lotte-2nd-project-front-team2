import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import "@/pages/community/Community.scss";
import useUserStore from "../../store/useUserStore";
import axiosInstance from "../../services/axios";

function CommunityView() {
  const navigate = useNavigate();
  const { boardType } = useParams();
  const { boardId, postId } = useParams();
  const currentUser = useUserStore((state) => state.user);

  const [remarkLoaded, setRemarkLoaded] = useState(false);
  const remarkRef = useRef(null);
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // token 상태 관리
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState(null);

  // 게시글 데이터 가져오기
  const fetchPost = async () => {
    setIsLoading(true);
    try {
      if (!postId || postId === "undefined") {
        console.error("잘못된 postId 값:", postId);
        return;
      }
      const response = await axiosInstance.get(
        `/api/community/view?postId=${postId}&boardId=${boardId}`
      );
      setPost(response.data);
    } catch (error) {
      console.error("게시글 조회 실패:", error);
      if (error.response && error.response.status === 500) {
        alert("서버에서 문제가 발생했습니다. 나중에 다시 시도해주세요.");
      }
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 처음에 게시글 데이터 fetch
  useEffect(() => {
    if (postId && boardId) {
      fetchPost();
    } else {
      console.error("잘못된 파라미터: postId 또는 boardId가 없습니다.");
    }
  }, [postId, boardId]);

  // 토큰을 가지고 유저 데이터 가져오기
  useEffect(() => {
    if (!token) {
      console.log("로그인 필요");
      return;
    }

    // 토큰이 있을 경우 API 요청 보내기
    fetch("http://localhost:9090/api/v1/user?site=localhost", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("응답 상태:", response.status);
        if (!response.ok) {
          throw new Error(`인증 실패: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUserData(data); // 유저 데이터를 상태로 저장
        console.log("받은 데이터:", data);
      })
      .catch((error) => {
        console.error("에러 발생:", error.message);
      });
  }, [token]); // token이 바뀔 때마다 실행

  // JWT 디코딩
  const decodeJWT = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      console.error("JWT 디코딩 실패:", e);
      return null;
    }
  };

  useEffect(() => {
    if (!token) {
      console.log("로그인이 필요합니다.");
      return;
    }

    let isMounted = true;

    const initRemark = () => {
      if (!remarkRef.current) return;

      try {
        const tokenData = decodeJWT(token);
        console.log("토큰 데이터:", tokenData);

        const cleanToken = token.replace("Bearer ", "");

        window.remark_config = {
          host: "http://localhost:9090",
          site_id: "localhost",
          url: window.location.origin + window.location.pathname,
          theme: "light",
          locale: "ko",
          components: ["embed"],
          auth: {
            type: "jwt",
            token: cleanToken,
          },
        };

        let remarkDiv = document.getElementById("remark42");
        if (!remarkDiv && remarkRef.current) {
          remarkDiv = document.createElement("div");
          remarkDiv.id = "remark42";
          remarkRef.current.appendChild(remarkDiv);
        }

        const existingScript = document.querySelector(
          'script[src="http://localhost:9090/web/embed.js"]'
        );
        if (existingScript) {
          existingScript.remove();
        }

        const script = document.createElement("script");
        script.src = "http://localhost:9090/web/embed.js";
        script.async = true;

        script.onload = () => {
          if (!isMounted) return;
          if (window.REMARK42 && remarkDiv) {
            try {
              window.REMARK42.destroy();
              window.REMARK42.createInstance({
                node: remarkDiv,
                ...window.remark_config,
              });
              setRemarkLoaded(true);
            } catch (error) {
              console.error("Remark42 인스턴스 생성 실패:", error);
            }
          }
        };

        document.body.appendChild(script);
      } catch (error) {
        console.error("Remark42 초기화 에러:", error);
      }
    };
    const timer = setTimeout(initRemark, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (window.REMARK42) {
        window.REMARK42.destroy();
      }
    };
  }, [token, postId]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러 발생: {error.message}</div>;
  }

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  const handleDownload = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div id="community-container">
      <CommunitySidebar currentUser={currentUser} boardId={boardId} />

      <div className="community-view">
        {post.isPinned && (
          <div className="pinned-info">필독 노출 기간: {post.pinnedPeriod}</div>
        )}
        <h2>
          {post.title}
          <span className="view-date">
            {new Date(post.createdAt).toISOString().split("T")[0]}
            <strong className="author">작성자: {post.writer}</strong>
          </span>
        </h2>

        <div className="view-content">
          <p>{post.content}</p>
        </div>
        {post.attachments && post.attachments.length > 0 && (
          <div className="view-attachments">
            <h4>첨부파일</h4>
            <ul>
              {post.attachments.map((attachment, index) => (
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

        {/* 댓글 섹션 */}
        <div className="comment-section">
          <h3>댓글</h3>
          {!token ? (
            <div className="login-message text-center py-4 bg-gray-100 rounded">
              댓글을 작성하려면 로그인이 필요합니다.
            </div>
          ) : (
            <>
              <div
                ref={remarkRef}
                className="comments-section mt-8 p-4 border rounded-lg"
              />
              {!remarkLoaded && (
                <div className="text-center py-4">댓글을 불러오는 중...</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommunityView;
