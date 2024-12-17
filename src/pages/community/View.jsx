import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import "@/pages/community/Community.scss";
import useUserStore from "../../store/useUserStore";
import axiosInstance from "../../services/axios";

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
  const { boardType, boardId, postId } = useParams();
  const user = useUserStore((state) => state.user);

  // 상태 관리
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPostEmojiPicker, setShowPostEmojiPicker] = useState(false);
  const [showCommentEmojiPicker, setShowCommentEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentLikes, setCommentLikes] = useState({});
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage] = useState(10);
  const [replyingTo, setReplyingTo] = useState(null);

  const currentComments = useMemo(() => {
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    return comments.slice(indexOfFirstComment, indexOfLastComment);
  }, [comments, currentPage, commentsPerPage]);

  // totalPages도 useMemo로 계산
  const totalPages = useMemo(() => {
    return Math.ceil(comments.length / commentsPerPage);
  }, [comments.length, commentsPerPage]);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    const commentsSection = document.querySelector(".comments-section");
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const emojis = ["👍", "❤️", "😊", "🎉", "👏", "✨", "💫", "🌟"];

  const fetchPost = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/community/view?postId=${postId}&boardId=${boardId}`
      );
      setPost(response.data);
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

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      await axiosInstance.delete(
        `/api/community/posts/${postId}/comments/${commentId}`
      );
      fetchComments();
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
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
          <p>{post?.content}</p>
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
              onClick={() => navigate(`/community/${boardType}/list`)}
              className="list-button"
            >
              목록
            </button>
          </div>
          {user?.id === post?.writerId && (
            <div className="footer-right">
              <button
                onClick={() =>
                  navigate(`/community/${boardType}/modify/${postId}`)
                }
                className="modify-button"
              >
                수정
              </button>
              <button
                onClick={() => {
                  if (window.confirm("게시글을 삭제하시겠습니까?")) {
                    // 삭제 API 연동
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
                placeholder="댓글을 입력하세요. (@로 멤버를 멘션할 수 있어요!)"
                required
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

          <div className="comment-list">
            {comments.length === 0 ? (
              <p className="no-comments">첫 번째 댓글을 작성해보세요!</p>
            ) : (
              currentComments.map((comment) => (
                <div key={comment.commentId} className="comment">
                  <div className="comment-header">
                    <div className="user-info">
                      <div className="avatar">{getInitial(comment.writer)}</div>
                      <span className="user-name">
                        {comment.writer || "알 수 없음"}
                      </span>
                      <span className="comment-date">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p>{comment.content}</p>
                  <div className="comment-actions">
                    <button
                      onClick={() =>
                        handleCommentLike(
                          post.postId,
                          comment.commentId,
                          user.id
                        )
                      }
                      className={`reply-button ${
                        comment.likes > 0 ? "liked" : ""
                      }`}
                    >
                      <Heart size={16} />
                      좋아요 ({comment.likesCount})
                    </button>
                    <button className="reply-button">
                      <MessageCircle size={16} />
                      답글
                    </button>
                    {user?.id === comment.writerId && (
                      <button
                        onClick={() => handleCommentDelete(comment.commentId)}
                        className="delete-button"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          {/* 페이지네이션 UI */}
          <div className="pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
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
                (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`pagination-button ${
                      currentPage === pageNum ? "active" : ""
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                (pageNum === currentPage - 3 && currentPage > 4) ||
                (pageNum === currentPage + 3 && currentPage < totalPages - 3)
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
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
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
