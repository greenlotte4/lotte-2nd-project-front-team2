import { useEffect, useState } from "react";
import "@/pages/community/Community.scss";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import useUserStore from "../../store/useUserStore";
import "react-quill/dist/quill.snow.css"; // Quill 스타일시트
import ReactQuill from "react-quill";

import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../services/axios";
import { useQuery } from "@tanstack/react-query";

function CommunityWrite() {
  const { boardId } = useParams();
  const currentUser = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [fileCount, setFileCount] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [boardName, setBoardName] = useState("");

  const { data: boards } = useQuery({
    queryKey: ["boards"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/community/boards`);
      return response.data;
    },
  });

  useEffect(() => {
    if (boards && boardId) {
      const foundBoard = boards.find(
        (board) => board.boardId === parseInt(boardId)
      );
      if (foundBoard) {
        setBoardName(foundBoard.boardName);
      }
    }
  }, [boards, boardId]);

  // 유형 선택 시 boardName 업데이트
  const handleBoardChange = (e) => {
    const newBoardId = e.target.value;
    setSelectedBoardId(newBoardId);

    const foundBoard = boards.find(
      (board) => board.boardId === parseInt(newBoardId)
    );
    if (foundBoard) {
      setBoardName(foundBoard.boardName);
    }
  };

  const handleModalOpen = () => {
    console.log("모달 열기 버튼 클릭됨");
    setShowModal(true);
  };

  const handleModalClose = () => {
    console.log("모달 닫기 버튼 클릭됨");
    setShowModal(false);
  };

  const fetchBoards = async () => {
    console.log("게시판 목록 데이터 요청 시작");
    const response = await axiosInstance.get(`/api/community/boards`);
    console.log("게시판 목록 데이터 응답:", response.data);
    return response.data;
  };

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["boards"],
    queryFn: fetchBoards,
  });

  if (isLoading) {
    console.log("게시판 목록 로딩 중...");
    return <div>로딩 중...</div>;
  }

  if (isError) {
    console.error("게시판 목록 로딩 중 에러 발생:", error.message);
    return <div>에러 발생: {error.message}</div>;
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    console.log("선택된 파일들:", selectedFiles);

    if (selectedFiles.length > 2) {
      alert("파일은 최대 두 개까지만 첨부할 수 있습니다.");
      console.warn("파일 선택 제한 초과: 2개 초과 파일 선택됨");
      return;
    }

    setFiles(selectedFiles);
    setFileCount(selectedFiles.length);
    console.log("파일 상태 업데이트: ", selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("내용을 입력해주세요!");
      return;
    }

    const formData = new FormData();

    // FormData에 필드별 데이터 추가
    formData.append("boardId", selectedBoardId);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("isPinned", isPinned);
    formData.append("writer", currentUser.username);
    formData.append("uid", currentUser?.id);

    // 파일이 있을 때만 추가
    if (files.length > 0) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }

    console.log("FormData:", formData);

    try {
      const response = await axiosInstance.post(
        "/api/community/write",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("글 작성이 완료되었습니다!");
      // 글 작성 후 리디렉션 또는 추가 동작
      // 예: navigate('/some-path');
    } catch (error) {
      console.error("작성 실패:", error);
      alert("글 작성에 실패했습니다.");
    }
  };

  return (
    <div id="community-container">
      <CommunitySidebar currentUser={currentUser} boardId={boardId} />

      <div className="community-write">
        <h2>{boardName ? `${boardName} 작성` : "게시판 작성"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>유형</label>
            <div className="select-pinned-wrapper">
              <select
                value={selectedBoardId}
                onChange={handleBoardChange}
                required
              >
                <option value="" disabled>
                  게시판을 선택하세요
                </option>
                {boards.map((board) => (
                  <option key={board.boardId} value={board.boardId}>
                    {board.boardName}
                  </option>
                ))}
              </select>
              <div className="pinned">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => {
                    setIsPinned(e.target.checked);
                    console.log("필독 상태 변경:", e.target.checked);
                  }}
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

          <div className="form-group">
            <label>제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                console.log("제목 입력:", e.target.value);
              }}
              placeholder="제목을 입력하세요."
              className="title-input"
              required
            />
          </div>

          <div className="form-group">
            <div className="file-upload-wrapper">
              <label htmlFor="file-upload" className="file-upload-label">
                파일 선택(최대 2개)
              </label>
              <input
                id="file-upload"
                type="file"
                name="file"
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

          <div className="form-group">
            <label>내용</label>
            <ReactQuill
              value={content}
              onChange={(value) => {
                setContent(value);
                console.log("내용 입력:", value);
              }}
            />
          </div>

          <div className="button-group">
            <button
              type="button"
              onClick={() => {
                console.log("취소 버튼 클릭");
                navigate(-1);
              }}
            >
              취소
            </button>
            <button type="submit">작성하기</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CommunityWrite;
