import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import useUserStore from "../../store/useUserStore";
import axiosInstance from "../../services/axios";
import ReactQuill from "react-quill";

function CommunityModify() {
  const navigate = useNavigate();
  const { boardId, postId } = useParams();
  const [isPinned, setIsPinned] = useState(false);
  const currentUser = useUserStore((state) => state.user);
  const [isCommentEnabled, setIsCommentEnabled] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [boardName, setBoardName] = useState("게시판");
  const [selectedBoardId, setSelectedBoardId] = useState(boardId);
  const [error, setError] = useState(null);

  // 게시글 데이터 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/community/posts/${boardId}/${postId}`
        );
        console.log("불러온 게시글 데이터:", response.data);

        if (response.data) {
          setTitle(response.data.title || "");
          setContent(response.data.content || "");
          setIsCommentEnabled(!!response.data.isCommentEnabled);
          setSelectedBoardId(response.data.boardId || boardId);
          setIsPinned(!!response.data.isPinned);
        }
      } catch (error) {
        console.error(
          "게시글 불러오기 실패:",
          error.response?.data || error.message
        );
        setError("게시글을 불러오는데 실패했습니다.");
        alert("게시글을 불러오는데 실패했습니다.");
        navigate(-1);
      }
    };

    if (boardId && postId) {
      fetchPost();
    }
  }, [boardId, postId, navigate]);

  // 게시판 목록 불러오기
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axiosInstance.get(`/api/community/boards`);
        console.log("게시판 목록 응답:", response.data);

        if (Array.isArray(response.data)) {
          setData(response.data);

          const currentBoard = response.data.find(
            (board) => board.boardId === parseInt(selectedBoardId)
          );

          if (currentBoard) {
            setBoardName(currentBoard.boardName);
          } else {
            setBoardName("알 수 없는 게시판");
          }
        }
      } catch (error) {
        console.error("게시판 목록 불러오기 실패:", error);
        setError("게시판 목록을 불러오는데 실패했습니다.");
        setBoardName("알 수 없는 게시판");
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [selectedBoardId]);

  const validateFiles = (files) => {
    if (files.length > 2) {
      throw new Error("파일은 최대 두 개까지만 첨부할 수 있습니다.");
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    for (const file of files) {
      if (file.size > maxSize) {
        throw new Error(`${file.name}의 크기가 5MB를 초과합니다.`);
      }
    }

    return true;
  };

  const handleFileChange = (e) => {
    try {
      const selectedFiles = Array.from(e.target.files);
      validateFiles(selectedFiles);
      setFiles(selectedFiles);
      console.log(
        "선택된 파일:",
        selectedFiles.map((f) => ({ name: f.name, size: f.size }))
      );
    } catch (error) {
      alert(error.message);
      e.target.value = ""; // input 초기화
      setFiles([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("제목을 입력해주세요!");
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요!");
      return;
    }

    const formData = new FormData();

    // 로깅을 통한 데이터 검증
    console.log("전송 전 데이터 확인:", {
      boardId: selectedBoardId,
      title,
      content,
      isPinned,
      writer: currentUser.username,
      uid: currentUser?.id,
      files: files.map((f) => f.name),
    });

    // FormData에 데이터 추가
    formData.append("boardId", Number(selectedBoardId));
    formData.append("title", title);
    formData.append("content", content);
    formData.append("isPinned", isPinned);
    formData.append("writer", currentUser.username);
    formData.append("uid", currentUser?.id);

    // 파일 처리
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        console.log(`첨부 파일 ${index + 1}:`, file.name, file.size);
        formData.append("files", file);
      });
    }

    // FormData 내용 최종 확인
    for (let pair of formData.entries()) {
      console.log("FormData entry:", pair[0] + ": " + pair[1]);
    }

    try {
      const response = await axiosInstance.put(
        `/api/community/posts/${boardId}/view/${postId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("서버 응답:", response.data);
      alert("게시글 수정이 완료되었습니다!");
      navigate(`/community/${boardId}/list`);
    } catch (error) {
      console.error("게시글 수정 실패:", {
        error: error,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert("게시글 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div id="community-container">
      <CommunitySidebar currentUser={currentUser} />

      <div className="community-modify">
        <h2>{`${boardName} 수정`}</h2>
        <form onSubmit={handleSubmit}>
          {/* 게시판 선택 */}
          <div className="form-group">
            <label>유형</label>
            <div className="select-pinned-wrapper">
              <select
                value={selectedBoardId}
                onChange={(e) => setSelectedBoardId(e.target.value)}
                required
              >
                <option value="" disabled>
                  게시판을 선택하세요
                </option>
                {!loading && data.length > 0 ? (
                  data.map((board) => (
                    <option key={board.boardId} value={board.boardId}>
                      {board.boardName}
                    </option>
                  ))
                ) : (
                  <option value="">로딩중...</option>
                )}
              </select>
            </div>
          </div>

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
            <label htmlFor="file-upload" className="file-upload-label">
              파일 선택(최대 2개, 각 5MB 이하)
            </label>
            <input
              id="file-upload"
              type="file"
              className="file-upload-input"
              multiple
              onChange={handleFileChange}
            />
            {files.length > 0 && (
              <div className="file-selected">
                {files.map((file, index) => (
                  <div key={index}>
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 내용 입력 */}
          <div className="form-group">
            <label>내용</label>
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={{
                toolbar: [
                  [{ header: "1" }, { header: "2" }, { font: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  [{ align: [] }],
                  ["bold", "italic", "underline", "strike"],
                  ["blockquote", "code-block"],
                  ["link"],
                  [{ indent: "-1" }, { indent: "+1" }],
                  [{ direction: "rtl" }],
                  ["clean"],
                ],
              }}
              formats={[
                "header",
                "font",
                "list",
                "align",
                "bold",
                "italic",
                "underline",
                "strike",
                "blockquote",
                "code-block",
                "link",
                "indent",
                "direction",
              ]}
            />
          </div>

          {/* 버튼 그룹 */}
          <div className="button-group">
            <button
              type="button"
              onClick={() => {
                if (confirm("수정을 취소하시겠습니까?")) {
                  navigate(-1);
                }
              }}
            >
              취소
            </button>
            <button type="submit">수정하기</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CommunityModify;
