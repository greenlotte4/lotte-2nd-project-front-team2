import "@/pages/message/Message.scss";
import { useRef, useState } from "react";
import MessageToolTip from "../../components/message/MessageToolTip";
import InviteModal from "../../components/message/InviteModal";
import ShowMoreModal from "../../components/message/ShowMoreModal";
import AttachFileModal from "../../components/message/AttachFileModal";
import ProfileModal from "../../components/message/ProfileModal";

export default function Message() {
  const [isOpen, setIsOpen] = useState(false);
  const openHandler = () => {
    setIsOpen(true);
  };
  const closeHandler = () => {
    setIsOpen(false);
    setOption(2);
  };
  const [profile, setProfile] = useState(false);
  const profileHandler = () => {
    setProfile(!profile);
  };
  const [option, setOption] = useState(2);
  const optionHandler = (e) => {
    e.preventDefault();
    if (e.target.className === "userSearch") {
      setOption(1);
    } else if (e.target.className === "orgChart") {
      setOption(2);
    } else if (e.target.className === "frequent") {
      setOption(3);
    }
  };

  const propsObject = {
    isOpen,
    closeHandler,
    option,
    optionHandler,
  };

  const [search, setSearch] = useState(false);
  const searchHandler = () => {
    setSearch(!search);
  };

  const [moreFn, setMoreFn] = useState(false);
  const moreFnHandler = () => {
    setMoreFn(!moreFn);
  };

  const [file, setFile] = useState(false);
  const [fileInfos, setFileInfos] = useState([]);
  const fileRef = useRef();
  const fileHandler = (e) => {
    e.preventDefault();
    saveFileInfos();
  };
  const formatFileSize = (size) => {
    if (size >= 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(2) + " MB";
    } else if (size >= 1024) {
      return (size / 1024).toFixed(2) + " KB";
    } else {
      return size + " bytes";
    }
  };
  const saveFileInfos = () => {
    const selectedFiles = Array.from(fileRef.current.files);
    console.log("selectedFiles.length : " + selectedFiles.length);

    if (selectedFiles.length === 0) {
      alert("파일을 첨부해주세요");
      return;
    } else if (selectedFiles.length > 5) {
      alert("파일은 최대 5개까지 첨부 가능합니다.");
      return;
    } else {
      // 파일 크기 제한 (10MB)
      const maxSize = 10 * 1024 * 1024; // 5MB
      const oversizedFiles = selectedFiles.filter(
        (file) => file.size > maxSize
      );
      if (oversizedFiles.length > 0) {
        alert("파일 크기가 너무 큽니다. 10MB 이하의 파일만 선택해주세요.");
        return;
      }
      const readFilePromises = selectedFiles.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (file.type.startsWith("image/")) {
              resolve({
                fileName: file.name,
                fileSize: formatFileSize(file.size),
                fileURL: reader.result,
              });
            } else {
              resolve({
                fileName: file.name,
                fileSize: formatFileSize(file.size),
                fileURL: null,
              });
            }
          };
          reader.onerror = () => {
            reject(
              new Error(`파일을 읽는 중 오류가 발생했습니다: ${file.name}`)
            );
          };
          if (file.type.startsWith("image/")) {
            reader.readAsDataURL(file);
          } else {
            reader.readAsArrayBuffer(file); // 이미지가 아닌 경우 처리 방식에 따라 변경
          }
        });
      });

      Promise.all(readFilePromises)
        .then((results) => {
          setFileInfos(results);
          console.log("fileInfos updated:", results);
        })
        .catch((err) => {
          console.error(err);
          alert("파일을 읽는 중 오류가 발생했습니다.");
        });
      setFile(true);
    }
  };

  return (
    <div id="message-container">
      <div className="aside">
        <div className="aside-top">
          <div className="profile">
            <img
              src="../images/sample_item1.jpg"
              alt=""
              onClick={profileHandler}
            />
            {profile == true ? (
              <ProfileModal profile={profile} profileHandler={profileHandler} />
            ) : null}
            <MessageToolTip tooltip={"프로필 보기"} />
          </div>

          <div className="search">
            <img className="searchImg" src="../images/image.png" alt="" />
            <MessageToolTip tooltip={"대화방을 검색해보세요"} />
            <input type="text" placeholder="Search..." />
          </div>
        </div>
        <div className="list frequent">
          <h3>즐겨찾기</h3>
          <div className="rooms">
            <div className="room selected">
              <img
                className="profile"
                src="../images/sample_item1.jpg"
                alt=""
              />
              <div className="name_preview">
                <div className="name">
                  전규찬
                  <img
                    className="frequentImg"
                    src="../images/gold_star.png"
                    alt=""
                  />
                </div>
                <div className="preview">
                  <span>반갑습니다</span>
                </div>
              </div>
              <div className="date_unRead">
                <span>2024.11.20</span>
                <img
                  className="unReadImg"
                  src="../images/unreadNum.png"
                  alt=""
                />
              </div>
            </div>
            <div className="room">
              <img
                className="profile"
                src="../images/sample_item1.jpg"
                alt=""
              />
              <div className="name_preview">
                <div className="name">
                  전규찬
                  <img
                    className="frequentImg"
                    src="../images/gray_star.png"
                    alt=""
                  />
                </div>
                <div className="preview">
                  <span>반갑습니다</span>
                </div>
              </div>
              <div className="date_unRead">
                <span>2024.11.20</span>
                <img
                  className="unReadImg"
                  src="../images/unreadNum.png"
                  alt=""
                />
              </div>
            </div>
            <div className="room">
              <img
                className="profile"
                src="../images/sample_item1.jpg"
                alt=""
              />
              <div className="name_preview">
                <div className="name">
                  전규찬
                  <img
                    className="frequentImg"
                    src="../images/gray_star.png"
                    alt=""
                  />
                </div>
                <div className="preview">
                  <span>반갑습니다</span>
                </div>
              </div>
              <div className="date_unRead">
                <span>2024.11.20</span>
                <img
                  className="unReadImg"
                  src="../images/unreadNum.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>

        <div className="list">
          <h3>대화방</h3>
          <div className="rooms">
            <div className="room selected">
              <img
                className="profile"
                src="../images/sample_item1.jpg"
                alt=""
              />
              <div className="name_preview">
                <div className="name">
                  전규찬
                  <img
                    className="frequentImg"
                    src="../images/gray_star.png"
                    alt=""
                  />
                </div>
                <div className="preview">
                  <span>반갑습니다</span>
                </div>
              </div>
              <div className="date_unRead">
                <span>2024.11.20</span>
                <img
                  className="unReadImg"
                  src="../images/unreadNum.png"
                  alt=""
                />
              </div>
            </div>
            <div className="room">
              <img
                className="profile"
                src="../images/sample_item1.jpg"
                alt=""
              />
              <div className="name_preview">
                <div className="name">
                  전규찬
                  <img
                    className="frequentImg"
                    src="../images/gray_star.png"
                    alt=""
                  />
                </div>
                <div className="preview">
                  <span>반갑습니다</span>
                </div>
              </div>
              <div className="date_unRead">
                <span>2024.11.20</span>
                <img
                  className="unReadImg"
                  src="../images/unreadNum.png"
                  alt=""
                />
              </div>
            </div>
            <div className="room">
              <img
                className="profile"
                src="../images/sample_item1.jpg"
                alt=""
              />
              <div className="name_preview">
                <div className="name">
                  전규찬
                  <img
                    className="frequentImg"
                    src="../images/gray_star.png"
                    alt=""
                  />
                </div>
                <div className="preview">
                  <span>반갑습니다</span>
                </div>
              </div>
              <div className="date_unRead">
                <span>2024.11.20</span>
                <img
                  className="unReadImg"
                  src="../images/unreadNum.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        {isOpen == true ? <InviteModal {...propsObject} /> : null}
        <div className="create">
          <button className="create-btn" onClick={openHandler}>
            대화방 생성
          </button>
        </div>
      </div>
      <div className="view">
        <div className="others">
          <div className="profile_name_preview">
            <img className="profile" src="../images/sample_item1.jpg" alt="" />
            <div className="name_preview">
              <div className="name">전규찬</div>
              <div className="preview">
                <span>백엔드 개발자</span>
              </div>
            </div>
          </div>
          <div className="search_more">
            {search == true ? (
              <div className="searchBox">
                <input type="text" placeholder="대화 검색..." />
                <img
                  className="searchImg"
                  src="../images/image.png"
                  alt=""
                  onClick={null}
                />
                <img
                  className="closeSearch"
                  src="../images/closeBtn.png"
                  alt=""
                  onClick={searchHandler}
                />
              </div>
            ) : (
              <img
                className="searchImg"
                src="../images/image.png"
                alt=""
                onClick={searchHandler}
              />
            )}

            {moreFn == true ? <ShowMoreModal /> : null}
            <img
              className="searchImg"
              src="../images/More.png "
              alt=""
              onClick={moreFnHandler}
            />
          </div>
        </div>
        <div className="messages">
          <div className="my-message_profile">
            <div className="my-messages_readTime">
              <div className="my-message">
                안녕하세요 저는 전규찬이라고 합니다.
              </div>
              <div className="readTime">1:15 PM</div>
            </div>
            <img
              className="message-profile"
              src="../images/sample_item1.jpg"
              alt=""
            />
          </div>
          <div className="others-messages">
            <img
              className="message-profile"
              src="../images/sample_item1.jpg"
              alt=""
            />
            <div className="others-messages_readTime">
              <div className="others-message">
                어? 이름이 규찬이세요? 이런 우연이!!! 저 살면서 규찬이라는 이름
                쓰는 사람 조규찬 말고는 처음봤어요. 저는 김규찬입니다!
              </div>
              <div className="others-message">
                죄송해요 말이 좀 많았죠? 너무 신기해서 제가 조금 흥분했나봐요..
                어쨌든 만나뵙게 되어 정말 반갑습니다!
              </div>
              <div className="readTime">1:16 PM</div>
            </div>
          </div>
          <div className="my-message_profile">
            <div className="my-messages_readTime">
              <div className="my-message">아 넵.</div>
              <div className="readTime">1:17 PM</div>
            </div>
            <img
              className="message-profile"
              src="../images/sample_item1.jpg"
              alt=""
            />
          </div>
        </div>
        <div className="send-message">
          <div className="input_fileIcon">
            <input
              className="message-input"
              type="text"
              placeholder="메시지를 입력해주세요"
            />
            <label className="fileInput" htmlFor="fileInput">
              <img className="fileIcon" src="../images/fileIcon.png" alt="" />
              <MessageToolTip tooltip={"파일 첨부"} />
            </label>
            <input
              id="fileInput"
              type="file"
              multiple
              name="file"
              onChange={fileHandler}
              ref={fileRef}
            />
            {file == true ? (
              <AttachFileModal
                file={file}
                fileInfos={fileInfos}
                closeHandler={() => {
                  setFile(false);
                  setFileInfos([]);
                }}
              />
            ) : null}
          </div>
          <button className="send-btn">보내기</button>
        </div>
      </div>
    </div>
  );
}
