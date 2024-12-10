import { useState } from "react";
import "@/pages/community/Community.scss";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import useUserStore from "../../store/useUserStore";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useParams } from "react-router-dom";
import axiosInstance from "../../services/axios";
import { useQuery } from "@tanstack/react-query";

function CommunityWrite() {
  const { boardId } = useParams(); // URL에서 boardId 추출
  console.log("boardId from URL:", boardId); // 콘솔로 확인
  const currentUser = useUserStore((state) => state.user); // 사용자 정보 가져오기

  const [title, setTitle] = useState(""); // 제목
  const [content, setContent] = useState(""); // 내용
  const [files, setFiles] = useState([]); // 첨부 파일
  const [fileCount, setFileCount] = useState(0);
  const [isPinned, setIsPinned] = useState(false); // 필독 등록 여부
  const [isCommentEnabled, setIsCommentEnabled] = useState(false); // 댓글 활성화 여부
  const [commentOption, setCommentOption] = useState("모두"); // 댓글 설정 옵션
  const [showModal, setShowModal] = useState(false); // 모달 상태
  const [selectedBoardId, setSelectedBoardId] = useState(""); // 게시판 ID 상태 관리

  const handleModalOpen = () => setShowModal(true); // 모달 열기
  const handleModalClose = () => setShowModal(false); // 모달 닫기
  console.log("boardId from URL:", boardId);

  const fetchBoards = async () => {
    const response = await axiosInstance(`/api/community/write`);
    console.log("데이터 " + JSON.stringify(response.data));
    return response.data;
  };

  // useQuery를 사용하여 데이터를 불러옴
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["boards"],
    queryFn: fetchBoards,
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>에러 발생: {error.message}</div>;
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // 최대 두 개까지만 선택 가능
    if (selectedFiles.length > 2) {
      alert("파일은 최대 두 개까지만 첨부할 수 있습니다.");
      return;
    }

    setFiles(selectedFiles);
    setFileCount(selectedFiles.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit에서 boardId:", boardId);

    const postData = {
      boardId: selectedBoardId,
      title: title,
      content: content,
      files: files,
      commentOption: isCommentEnabled ? commentOption : "댓글 비활성화",
      isPinned,
      fileCount: fileCount,
      favoritePost: false,
      isMandatory: isPinned,
      writer: currentUser.username, // 사용자 이름
      uid: currentUser?.id,
    };
    console.log("전송 데이터 " + JSON.stringify(postData));

    try {
      const response = await axiosInstance.post(
        `/api/community/write`,
        postData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("작성 성공:", response.data);
      alert("글 작성이 완료되었습니다!");
    } catch (error) {
      console.error("작성 실패:", error);
      alert("글 작성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div id="community-container">
      {/* 사이드바 */}
      <CommunitySidebar currentUser={currentUser} boardId={boardId} />

      {/* 작성 폼 */}
      <div className="community-main">
        <h2>{`${boardId} 작성`}</h2>
        <form onSubmit={handleSubmit}>
          {/* 게시판 유형 선택 및 필독 등록 */}
          <div className="form-group">
            <label>유형</label>
            <div className="select-pinned-wrapper">
              <select
                value={selectedBoardId}
                onChange={(e) => setSelectedBoardId(e.target.value)}
                required
              >
                {data.map((board) => (
                  <option key={board.boardId} value={board.boardId}>
                    {board.boardName}
                  </option>
                ))}
              </select>
              <div className="pinned">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                />
                <label>필독 등록</label>
                <img
                  src="/images/setting.png"
                  alt="설정"
                  className="pinned-settings-icon"
                  onClick={handleModalOpen}
                />
              </div>
            </div>
          </div>

          {/* 모달 */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>필독 표시</h3>
                <p>
                  지정한 기간 동안 게시판 서비스 메인화면에 노출시킬 수
                  있습니다.
                </p>
                <div className="modal-form">
                  <label htmlFor="datepicker">날짜 선택</label>
                  <input
                    type="date"
                    id="datepicker"
                    className="date-input"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                  <span>일까지 노출 (최대 30일)</span>
                </div>
                <div className="modal-buttons">
                  <button onClick={handleModalClose} className="cancel-button">
                    취소
                  </button>
                  <button onClick={handleModalClose} className="confirm-button">
                    확인
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 제목 입력 */}
          <div className="form-group">
            <label>제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요."
              className="title-input"
              required
            />
          </div>

          {/* 파일 첨부 */}
          <div className="form-group">
            <div className="file-upload-wrapper">
              <label htmlFor="file-upload" className="file-upload-label">
                파일 선택(최대 2개)
              </label>
              <input
                id="file-upload"
                type="file"
                className="file-upload-input"
                multiple
                onChange={handleFileChange}
              />
              <span className="file-selected">
                {files.length > 0
                  ? files.map((file) => file.name).join(", ")
                  : "선택된 파일 없음"}
              </span>
            </div>
          </div>

          {/* CKEditor (내용 입력) */}
          <div className="form-group">
            <label>내용</label>
            <CKEditor
              editor={ClassicEditor}
              data={content}
              onChange={(event, editor) => {
                const data = editor.getData();
                setContent(data);
              }}
            />
          </div>

          {/* 댓글 설정 */}
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={isCommentEnabled}
                onChange={(e) => setIsCommentEnabled(e.target.checked)}
              />
              댓글 설정
            </label>
            {isCommentEnabled && (
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="commentOption"
                    value="모두"
                    checked={commentOption === "모두"}
                    onChange={(e) => setCommentOption(e.target.value)}
                  />
                  모두
                </label>
                <label>
                  <input
                    type="radio"
                    name="commentOption"
                    value="작성자 및 관리자"
                    checked={commentOption === "작성자 및 관리자"}
                    onChange={(e) => setCommentOption(e.target.value)}
                  />
                  작성자 및 관리자
                </label>
              </div>
            )}
          </div>

          {/* 버튼 그룹 */}
          <div className="button-group">
            <button type="button" onClick={() => alert("취소했습니다!")}>
              취소하기
            </button>
            <button type="submit">작성하기</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CommunityWrite;
