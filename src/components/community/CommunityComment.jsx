import React, { useState } from "react";
import { Heart, MessageCircle, Send, MoreHorizontal } from "lucide-react";

const CommunityComment = ({
  comment,
  postId,
  user,
  handleCommentLike,
  handleCommentDelete,
  handleCommentEdit,
  handleReplySubmit,
  getInitial,
  formatDate,
  newReply,
  setNewReply,
  replyingTo,
  setReplyingTo,
}) => {
  console.log("댓글 데이터:", comment);
  console.log("현재 유저:", user);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const startEdit = () => {
    setIsEditing(true);
    setShowMenu(false); // 메뉴 닫기
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content); // 원래 내용으로 되돌리기
  };

  const submitEdit = () => {
    if (editContent.trim() === "") return;
    handleCommentEdit(comment.commentId, editContent);
    setIsEditing(false);
  };

  // 메뉴 외부 클릭시 닫기
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest(".menu-container")) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showMenu]);
  console.log("user?.uid:", user?.uid);
  console.log("comment.uid:", comment.uid);
  console.log("user?.name:", user?.name);
  console.log("comment.writer:", comment.writer);

  return (
    <div className="comment">
      <div className="comment-header">
        <div className="user-info">
          <div className="avatar">{getInitial(comment.writer)}</div>
          <span className="user-name">{comment.writer || "알 수 없음"}</span>
          <span className="comment-date">{formatDate(comment.createdAt)}</span>
        </div>

        {user?.uid === comment.uid && (
          <div className="menu-container">
            <button
              className="menu-button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <MoreHorizontal size={16} />
            </button>

            {showMenu && (
              <div className="menu-dropdown">
                <button onClick={startEdit}>수정</button>
                <button
                  onClick={() => handleCommentDelete(comment.commentId)}
                  className="delete-button"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="edit-form">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="edit-textarea"
          />
          <div className="edit-buttons">
            <button onClick={submitEdit} className="submit-edit">
              완료
            </button>
            <button onClick={cancelEdit} className="cancel-edit">
              취소
            </button>
          </div>
        </div>
      ) : (
        <p className="comment-content">{comment.content}</p>
      )}

      <div className="comment-actions">
        <button
          onClick={() => handleCommentLike(postId, comment.commentId, user?.id)}
          className={`reply-button ${comment.likes > 0 ? "liked" : ""}`}
        >
          <Heart size={16} />
          좋아요 ({comment.likesCount || 0})
        </button>
        <button
          onClick={() => setReplyingTo(comment.commentId)}
          className="reply-button"
        >
          <MessageCircle size={16} />
          답글
        </button>
      </div>

      {replyingTo === comment.commentId && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleReplySubmit(e, comment.commentId);
          }}
          className="reply-form"
        >
          <textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="답글을 입력하세요."
            required
          />
          <div className="reply-buttons">
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="cancel-button"
            >
              취소
            </button>
            <button type="submit" className="send-button">
              <Send size={16} />
              답글 작성
            </button>
          </div>
        </form>
      )}

      {comment.children && comment.children.length > 0 && (
        <div className="replies">
          {comment.children.map((reply) => (
            <CommunityComment
              key={reply.commentId}
              comment={reply}
              postId={postId}
              user={user}
              handleCommentLike={handleCommentLike}
              handleCommentDelete={handleCommentDelete}
              handleCommentEdit={handleCommentEdit}
              handleReplySubmit={handleReplySubmit}
              getInitial={getInitial}
              formatDate={formatDate}
              newReply={newReply}
              setNewReply={setNewReply}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityComment;
