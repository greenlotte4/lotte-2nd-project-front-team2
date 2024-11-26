/* eslint-disable react/prop-types */
export default function AttachFileModal({ file, fileInfos, closeHandler }) {
  console.log("fileInfo : " + JSON.stringify(fileInfos));

  return (
    <div className="message-file">
      <img
        className="closeBtn"
        src="/images/closeBtn.png"
        alt=""
        onClick={closeHandler}
      />
      <span>파일 전송</span>
      <div className="preview_name_more">
        {fileInfos.map((fileInfo, index) => (
          <div key={index} className="file-item">
            {fileInfo.fileURL ? (
              <img
                className="filePreview"
                src={fileInfo.fileURL}
                alt="파일 미리보기"
              />
            ) : (
              <img
                className="filePreview"
                src="/images/message-fileIcon.png" // 비이미지 파일용 기본 아이콘
                alt="파일 아이콘"
              />
            )}
            <div className="name_size">
              <span className="fileName">{fileInfo.fileName}</span>
              <span className="fileSize">{fileInfo.fileSize}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="sendBtn">
        <button>{fileInfos.length}개 전송</button>
      </div>
    </div>
  );
}
