import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import useUserStore from "../../store/useUserStore";

function CommunityModify() {
  const navigate = useNavigate();
  const { boardType, postId } = useParams(); // URL 파라미터에서 boardType과 postId 가져오기
  const currentUser = useUserStore((state) => state.user); // 사용자 정보 가져오기

  const [title, setTitle] = useState(""); // 제목 상태
  const [content, setContent] = useState(""); // 내용 상태
  const [file, setFile] = useState(null); // 파일 상태

  // 더미 데이터 가져오기 (API 연동 시 교체 가능)
  useEffect(() => {
    // 서버에서 기존 데이터를 가져온다고 가정
    const fetchData = async () => {
      const dummyPost = {
        id: postId,
        title: "[안내] 공지사항입니다.",
        content: `안녕하세요, 공지사항 내용입니다.
        G사와 해외의 구매처를 사칭하는 피싱 문자 거래건과 관련하여
        해외발 주문 및 이와 관련된 주요 공지 사항을 알려드립니다.`,
        file: "파일명.pdf",
      };

      setTitle(dummyPost.title);
      setContent(dummyPost.content);
      setFile(dummyPost.file);
    };

    fetchData();
  }, [postId]);

  // 수정 완료 핸들러
  const handleModify = (e) => {
    e.preventDefault();

    const updatedData = {
      title,
      content,
      file,
    };

    console.log("수정된 데이터:", updatedData);

    // 서버로 데이터 전송 로직 추가
    alert("수정 완료!");
    navigate(`/community/${boardType}/view/${postId}`); // 수정 완료 후 상세 페이지로 이동
  };

  return (
    <div id="community-container">
      {/* 사이드바 */}
      <CommunitySidebar currentUser={currentUser} />

      <div className="community-modify">
        <h2>게시글 수정</h2>
        <form onSubmit={handleModify}>
          {/* 제목 입력 */}
          <div className="form-group">
            <label>제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요."
              required
            />
          </div>

          {/* 내용 입력 (CKEditor 사용) */}
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

          {/* 파일 첨부 */}
          <div className="form-group">
            <label>파일 첨부</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            {file && (
              <p>
                현재 파일: <strong>{file.name || file}</strong>
              </p>
            )}
          </div>

          {/* 버튼 */}
          <div className="button-group">
            <button type="button" onClick={() => navigate(-1)}>
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
