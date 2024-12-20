import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import "@/pages/community/Community.scss";
import useUserStore from "../../store/useUserStore";
import axiosInstance from "../../services/axios";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";
import CommentList from "../../components/community/CommentList";

import {
  Heart,
  Share2,
  Paperclip,
  MessageCircle,
  MoreHorizontal,
  Send,
  Image,
  Star,
  Smile,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function CommunityView() {
  const navigate = useNavigate();
  const { boardId, postId } = useParams();
  console.log("boardId:", boardId);
  console.log("postId:", postId);
  const user = useUserStore((state) => state.user);
  const [boardName, setBoardName] = useState("");

  // 상태 관리
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState("");

  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPostEmojiPicker, setShowPostEmojiPicker] = useState(false);
  const [showCommentEmojiPicker, setShowCommentEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [error, setError] = useState(null);
  const [commentPage, setCommentPage] = useState(1);
  const [commentsPerPage] = useState(10);
  const [replyingTo, setReplyingTo] = useState(null);
  const [content, setContent] = useState("");

  const currentComments = useMemo(() => {
    const indexOfLastComment = commentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    return comments.slice(indexOfFirstComment, indexOfLastComment);
  }, [comments, commentPage, commentsPerPage]);

  // totalPages도 useMemo로 계산
  const totalPages = useMemo(() => {
    return Math.ceil(comments.length / commentsPerPage);
  }, [comments.length, commentsPerPage]);

  const paginateComments = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCommentPage(pageNumber);
    const commentsSection = document.querySelector(".comments-section");
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchBoardName = async () => {
      try {
        const response = await axiosInstance.get("/api/community/boards");
        const boards = response.data;
        const currentBoard = boards.find(
          (board) => board.boardId === parseInt(boardId)
        );
        if (currentBoard) {
          setBoardName(currentBoard.boardName);
          localStorage.setItem(`boardName_${boardId}`, currentBoard.boardName);
        }
      } catch (error) {
        console.error("게시판 정보 로드 실패:", error);
      }
    };

    fetchBoardName();
  }, [boardId]);

  const emojis = ["👍", "❤️", "😊", "🎉", "👏", "✨", "💫", "🌟"];

  const fetchPost = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/community/view?postId=${postId}&boardId=${boardId}`
      );
      console.log("API Response:", response.data); // API 응답 확인
      setPost(response.data);

      setContent(response.data.content);
    } catch (error) {
      setError(error);
      console.error("게시글 조회 실패:", error);
    }
  };
  console.log(boardId, postId);

  const fetchComments = async (page = 0) => {
    try {
      const response = await axiosInstance.get(
        `/api/community/posts/${postId}/comments`
      );
      console.log("들어오나안들어오나" + response.data);

      // 최신순으로 댓글 정렬 (createdAt을 기준으로 내림차순 정렬)
      const sortedComments = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setComments(response.data || []);
    } catch (error) {
      console.error("댓글 조회 실패:", error);
      setComments([]);
    }
  };

  const handleCommentEdit = async (commentId, newContent) => {
    try {
      await axiosInstance.put(
        `/api/community/posts/${postId}/comments/${commentId}`,
        {
          content: newContent,
          userId: user?.id,
        }
      );

      fetchComments(); // 댓글 목록 새로고침
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      throw error; // 에러를 상위로 전달
    }
  };

  // 유틸리티 함수
  const getInitial = (name) => name?.charAt(0) || "?";

  const formatDate = (dateString) => {
    if (!dateString) return "날짜 없음";
    return new Date(dateString).toLocaleDateString();
  };

  // 이벤트 핸들러
  const handleCommentSubmit = async (e, parentId) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    console.log("에라모르겟다");

    if (!user?.id) {
      console.log("User ID is null");
      return;
    }

    try {
      await axiosInstance.post(`/api/community/posts/${postId}/comments`, {
        content: newComment,
        postId: postId,
        userId: user?.id,
        writer: user?.name,
        parentId: parentId,
      });

      setNewComment("");
      setReplyingTo(null);
      fetchComments();
    } catch (error) {
      console.error("댓글 작성 실패:", error);
    }
  };

  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    console.log("parentId:", parentId); // 디버깅용 로그

    if (!newReply.trim()) return;

    try {
      await axiosInstance.post(`/api/community/posts/${postId}/comments`, {
        content: newReply,
        postId: postId,
        userId: user?.id,
        writer: user?.name,
        parentId: parentId,
      });

      setNewReply("");
      setReplyingTo(null);
      fetchComments();
    } catch (error) {
      console.error("답글 작성 실패:", error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      console.log(
        `Deleting comment with postId: ${postId}, commentId: ${commentId}`
      );

      await axiosInstance.delete(
        `/api/community/posts/${postId}/comments/${commentId}`
      );
      fetchComments();
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert(
        `댓글 삭제에 실패했습니다: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handlePostReaction = async (emoji) => {
    try {
      await axiosInstance.post(`/api/community/posts/${postId}/reactions`, {
        emoji,
        userId: user?.id,
      });
      setSelectedEmoji(emoji);
      setShowPostEmojiPicker(false);
    } catch (error) {
      console.error("반응 추가 실패:", error);
    }
  };

  const handleCommentLike = async (postId, commentId, userId) => {
    const url = `/api/community/posts/${postId}/comments/${commentId}/like?userId=${userId}`;
    console.log("요청 URL:", url);
    console.log("좋아요 요청:", { postId, commentId });

    try {
      const response = await axiosInstance.post(
        url,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // 응답 상태 코드 로깅
      console.log("응답 상태:", response.status);

      if (response.status === 200) {
        console.log("좋아요가 성공적으로 처리되었습니다.");
        location.reload(); // 새로 고침
      } else {
        console.error("서버 오류:", response.status);
      }
    } catch (error) {
      console.error("네트워크 오류:", error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("링크가 복사되었습니다.");
  };

  const handleBookmark = async () => {
    try {
      await axiosInstance.post(`/api/community/posts/${postId}/bookmark`, {
        userId: user?.id,
      });
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("북마크 실패:", error);
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchPost(), fetchComments()]);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (boardId && postId) {
      loadData();
    }
  }, [boardId, postId]);
  useEffect(() => {
    if (post) {
      console.log("Post State:", post); // post 상태가 업데이트될 때 확인
    }
  }, [post]);
  if (isLoading) return <div className="loading-spinner">로딩 중...</div>;
  if (error)
    return <div className="error-message">에러 발생: {error.message}</div>;
  if (!post) return <div className="not-found">게시글을 찾을 수 없습니다.</div>;

  return (
    <div id="community-container">
      <CommunitySidebar currentUser={user} boardId={boardId} />
      <div className="community-view">
        <div className="post-header">
          <h2>{post?.title}</h2>
          <div className="post-meta">
            <div className="meta-item">
              <div className="avatar">{getInitial(post?.writer)}</div>
              <span>{post?.writer || "알 수 없음"}</span>
            </div>
            <div className="meta-item">
              <span>{formatDate(post?.createdAt)}</span>
            </div>
          </div>
          <div className="post-actions">
            <button
              onClick={() => setShowPostEmojiPicker(!showPostEmojiPicker)}
              className={`${selectedEmoji ? "liked" : ""}`}
            >
              {selectedEmoji || <Smile size={18} />}
              {selectedEmoji ? "반응완료" : "반응하기"}
            </button>
            <button
              onClick={handleBookmark}
              className={isBookmarked ? "liked" : ""}
            >
              <Star size={18} />
              즐겨찾기
            </button>
            <button onClick={handleShare}>
              <Share2 size={18} />
              공유하기
            </button>
          </div>
          {showPostEmojiPicker && (
            <div className="emoji-picker">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handlePostReaction(emoji)}
                  className="emoji-button"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="post-content">
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post?.content),
            }}
          />

          {post?.attachments?.length > 0 && (
            <div className="attachments">
              <h4>
                <Paperclip size={18} />
                첨부파일
              </h4>
              <div className="attachment-list">
                {post.attachments.map((file, index) => (
                  <div key={index} className="attachment-item">
                    <Paperclip size={16} />
                    {file.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="view-footer">
          <div className="footer-left">
            <button
              onClick={() => navigate(`/community/${boardId}/list`)}
              className="list-button"
            >
              목록
            </button>
          </div>
          {user?.uid === post?.uid && (
            <div className="footer-right">
              <button
                onClick={() =>
                  navigate(`/community/${boardId}/modify/${postId}`)
                }
                className="modify-button"
              >
                수정
              </button>
              <button
                onClick={async () => {
                  if (window.confirm("게시글을 삭제하시겠습니까?")) {
                    try {
                      await axiosInstance.delete(
                        `api/community/posts/${boardId}/view/${postId}`
                      );
                      console.log("boardId:", boardId);
                      console.log("postId:", postId);
                      alert("게시글이 삭제되었습니다!");
                      navigate(`/community/${boardId}/list`);
                    } catch (error) {
                      console.error("게시글 삭제를 실패:".error);
                      alert("게시글 삭제를 실패했습니다.");
                    }
                  }
                }}
                className="delete-button"
              >
                삭제
              </button>
            </div>
          )}
        </div>

        <div className="comments-section">
          <h3>
            댓글 <span className="comment-count">{comments.length}</span>
          </h3>

          <form onSubmit={handleCommentSubmit} className="comment-form">
            <div className="input-wrapper">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요."
                required
                style={{ resize: "none" }}
              />

              <button type="button" className="attach-button">
                <Paperclip size={25} />
              </button>

              <button
                type="button"
                className="emoji-button"
                onClick={() =>
                  setShowCommentEmojiPicker(!showCommentEmojiPicker)
                }
              >
                <Smile size={25} />
              </button>

              <button type="submit" className="send-button">
                <Send size={25} />
              </button>

              {showCommentEmojiPicker && (
                <div className="emoji-picker">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => setNewComment((prev) => prev + emoji)}
                      className="emoji-picker-button"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </form>

          <CommentList
            comments={comments}
            postId={postId}
            user={{ ...user, id: user?.uid }} // user의 uid를 id로 매핑
            handleCommentLike={handleCommentLike}
            handleCommentDelete={handleCommentDelete}
            handleReplySubmit={handleReplySubmit}
            handleCommentEdit={handleCommentEdit} // 추가
            getInitial={getInitial}
            formatDate={formatDate}
            newReply={newReply}
            setNewReply={setNewReply}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
          />

          {/* 페이지네이션 UI */}
          <div className="pagination">
            <button
              onClick={() => paginateComments(commentPage - 1)}
              disabled={commentPage === 1}
              className="pagination-arrow"
            >
              <ChevronLeft size={20} />
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              // 현재 페이지 주변의 페이지 번호만 표시
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= commentPage - 2 && pageNum <= commentPage + 2)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => paginateComments(pageNum)}
                    className={`pagination-button ${
                      commentPage === pageNum ? "active" : ""
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                (pageNum === commentPage - 3 && commentPage > 4) ||
                (pageNum === commentPage + 3 && commentPage < totalPages - 3)
              ) {
                return (
                  <span key={pageNum} className="pagination-ellipsis">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() => paginateComments(commentPage + 1)}
              disabled={commentPage === totalPages}
              className="pagination-arrow"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityView;
