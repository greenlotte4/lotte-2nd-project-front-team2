/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import "@/pages/message/Message.scss";
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import MessageToolTip from "../../components/message/MessageToolTip";
import InviteModal from "../../components/message/InviteModal";
import ShowMoreModal from "../../components/message/ShowMoreModal";
import AttachFileModal from "../../components/message/AttachFileModal";
import ProfileModal from "../../components/message/ProfileModal";
import axiosInstance from "../../services/axios";
import useChatWebSocket from "../../util/useChatWebSocket";
import { useMutation } from "@tanstack/react-query";
import useUserStore from "../../store/useUserStore";
import { UnreadCountContext } from "../../components/message/UnreadCountContext";
import { debounce } from "lodash";

export default function Message() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(false);
  const [option, setOption] = useState(2);
  const [search, setSearch] = useState(false);
  const [moreFn, setMoreFn] = useState(false);
  const [file, setFile] = useState(false);
  const [fileInfos, setFileInfos] = useState([]);
  const [roomData, setRoomData] = useState([]);
  const [roomInfo, setRoomInfo] = useState({});
  const [messageList, setMessageList] = useState([]);

  const uid = useUserStore((state) => state.user.uid);

  const fileRef = useRef();
  const profileRef = useRef();
  const inviteRef = useRef();
  const showMoreRef = useRef();

  const openHandler = () => {
    setIsOpen(true);
  };
  const closeHandler = () => {
    setIsOpen(false);
    setOption(2);
  };
  const profileHandler = () => {
    setProfile(!profile);
  };
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
    inviteRef,
  };

  const searchHandler = () => {
    setSearch(!search);
  };

  const moreFnHandler = () => {
    setMoreFn(!moreFn);
  };

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
      // 파일 크기 제한 (16MB)
      const maxSize = 16 * 1024 * 1024; // 16MB
      const oversizedFiles = selectedFiles.filter(
        (file) => file.size > maxSize
      );
      if (oversizedFiles.length > 0) {
        alert("파일 크기는 최대 16MB를 초과할 수 없습니다.");
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
        })
        .catch((err) => {
          console.error(err);
          alert("파일을 읽는 중 오류가 발생했습니다.");
        });
      setFile(true);
    }
  };

  const frequentHandler = useCallback(
    async (e, room) => {
      e.preventDefault();
      const newFavoriteStatus = room.chatRoomFavorite === 0 ? 1 : 0;

      const jsonData = {
        id: room.id,
        chatRoomFavorite: newFavoriteStatus,
      };
      try {
        await axiosInstance
          .patch("/api/message/frequentRoom", jsonData)
          .then((resp) => console.log(resp.data));

        setRoomData((prevRooms) =>
          prevRooms.map((r) =>
            r.id === room.id ? { ...r, chatRoomFavorite: newFavoriteStatus } : r
          )
        );
      } catch (error) {
        console.error(error);
      }
    },
    [setRoomData]
  );

  useEffect(() => {
    if (!uid) return;

    const fetchChatRooms = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/api/message/room/${uid}`);
        console.log(response);

        if (response.data === "") {
          setIsLoading(false);
          return;
        } else {
          const rooms = response.data;
          // 각 채팅방에 대해 읽지 않은 메시지 수를 가져옵니다.
          const roomsWithUnread = await Promise.all(
            rooms.map(async (room) => {
              const unreadResponse = await axiosInstance.get(
                "/api/message/unreadCount",
                {
                  params: { uid, chatRoomId: room.id },
                }
              );
              console.log("unreadResponse : ", unreadResponse);

              return {
                ...room,
                unreadCount: unreadResponse.data.count,
                lastMessage: unreadResponse.data.content,
                lastTimeStamp: unreadResponse.data.timeStamp,
              };
            })
          );
          console.log("초기 채팅방 로드 : ", roomsWithUnread);

          setRoomData(roomsWithUnread);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("채팅방 호출 오류:", error);
      }
    };
    fetchChatRooms();
  }, [uid, isOpen]);

  const selectRoomHandler = (e, roomId) => {
    e.preventDefault();
    if (selectedRoomId === roomId) {
      return;
    }

    markAsRead();

    setHasMore(true); // 채팅방 변경 시 hasMore를 true로 초기화
    setSelectedRoomId(roomId);
    localStorage.removeItem("roomId");
    localStorage.setItem("roomId", roomId);
  };

  useEffect(() => {
    const roomId = localStorage.getItem("roomId");
    if (!roomId) return;
    setSelectedRoomId(roomId);
  }, []);

  //==========================================▼웹소켓 연결과 채팅 전송===================================================

  const [input, setInput] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // 읽지 않은 메시지 수
  const shouldScrollToBottomRef = useRef(false);
  const chatContainerRef = useRef(null);
  const lastTimeStampRef = useRef(null);
  const stompClientRef = useRef(null);
  const isInitialLoadRef = useRef(true); // 초기 로드 플래그
  const isLoadingOlderMessagesRef = useRef(false);
  const isNewMessageRef = useRef(false);
  const inputRef = useRef(null);
  const previousScrollHeightRef = useRef(0);
  const systemMessageRef = useRef(null);
  const scrollToSystemRef = useRef(false);

  const {
    unreadCounts,
    setUnreadCounts,
    lastMessages,
    setLastMessages,
    lastTimeStamp,
    setLastTimeStamp,
    selectedRoomId,
    setSelectedRoomId,
  } = useContext(UnreadCountContext);

  useEffect(() => {
    setRoomData((prevRoomData) =>
      prevRoomData.map((room) => ({
        ...room,
        unreadCount: unreadCounts[room.id] ?? room.unreadCount,
        lastMessage: lastMessages[room.id] ?? room.lastMessage,
        lastTimeStamp: lastTimeStamp[room.id] ?? room.lastTimeStamp,
      }))
    );
  }, [unreadCounts, lastMessages, lastTimeStamp]);

  const { mutate } = useMutation({
    mutationFn: async (inputText) => {
      if (inputText.trim() === "") return null;

      const timestamp = new Date();
      const utcTimestamp = new Date(
        timestamp.getTime() - timestamp.getTimezoneOffset() * 60000
      );

      const newMessage = {
        roomId: selectedRoomId,
        status: 1,
        type: "MESSAGE",
        content: inputText,
        sender: uid,
        timeStamp: utcTimestamp,
      };
      console.log("newMessage : ", newMessage);

      try {
        const resp = await axiosInstance.post(
          "/api/message/saveMessage",
          newMessage
        );
        return resp.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: (newMessage) => {
      if (newMessage) {
        sendWebSocketMessage(newMessage, "/app/chat.sendMessage");
        setInput(""); // 입력 필드 초기화
        shouldScrollToBottomRef.current = true; // 스크롤 이동 플래그 설정
      }
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  const formatTime = (timeStamp) => {
    const date = new Date(timeStamp);

    const formatter = new Intl.DateTimeFormat("ko-KR", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return formatter.format(date);
  };

  const handleSendMessage = () => {
    mutate(input);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      mutate(input);
    }
  };

  // 사용자가 채팅방을 읽었다고 표시
  const markAsRead = async () => {
    if (!selectedRoomId || !uid) return;
    try {
      const data = {
        sender: uid,
        roomId: selectedRoomId,
      };
      await axiosInstance.post("/api/message/markAsRead", data);
      setRoomData((prevData) =>
        prevData.map((room) =>
          room.id === selectedRoomId ? { ...room, unreadCount: 0 } : room
        )
      );
    } catch (error) {
      console.error("읽음 상태 업데이트 실패:", error);
    }
  };

  const {
    stompClient,
    isConnected,
    updateMembers,
    updateuid,
    sendWebSocketMessage,
    updateSubscriptions,
  } = useChatWebSocket({
    selectedRoomId,
    setMessageList,
    setUnreadCount,
    chatContainerRef,
    shouldScrollToBottomRef,
    setRoomData,
    uid,
    markAsRead,
  });

  const [members, setMembers] = useState();

  // 초기 로드 및 채팅방 변경 시 메시지 로드
  useEffect(() => {
    if (selectedRoomId) {
      console.log("Selected Room ID changed:", selectedRoomId);
      // 메시지 목록 초기화
      setMessageList([]);
      lastTimeStampRef.current = null;
      isInitialLoadRef.current = true;

      // 메시지 로드
      loadMessages().then(() => {
        // 초기 로드 후 스크롤을 맨 아래로 설정
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        }
        isInitialLoadRef.current = false;
      });

      // 채팅방 정보 가져오기
      axiosInstance
        .get(`/api/message/roomInfo/${selectedRoomId}`)
        .then((resp) => {
          setRoomInfo(resp.data);
          setMembers([...resp.data.members, resp.data.leader]);
        })
        .catch((error) => {
          console.error("Error fetching room info:", error);
        });

      // 읽음 처리 후 언리드 카운트 가져오기
      markAsRead()
        .then(() => {
          console.log("markAsRead completed.");
        })
        .then(() => {
          console.log("fetchUnreadCount completed.");
        })
        .catch((error) => {
          console.error("Mark as read or fetch unread count failed:", error);
        });
    }
  }, [selectedRoomId]);

  // 메시지 로드 함수
  const loadMessages = useCallback(async () => {
    if (loading || !hasMore || !selectedRoomId) {
      console.log(
        "loadMessages aborted: loading =",
        loading,
        ", hasMore =",
        hasMore,
        ", chatRoomId =",
        selectedRoomId
      );
      return;
    }
    setLoading(true);
    isLoadingOlderMessagesRef.current = true;

    try {
      const params = lastTimeStampRef.current
        ? {
            chatRoomId: selectedRoomId,
            uid: uid,
            before: lastTimeStampRef.current, // 이전 메시지 로드 시 before 파라미터 사용
          }
        : { chatRoomId: selectedRoomId, uid: uid };

      // 이전 스크롤 높이 저장 (오래된 메시지를 로드할 때 사용)
      const container = chatContainerRef.current;
      if (container && lastTimeStampRef.current) {
        previousScrollHeightRef.current = container.scrollHeight;
      }

      const response = await axiosInstance.get("/api/message/getMessage", {
        params,
      });

      const newMessages = response.data.messages;

      if (newMessages.length > 0) {
        // 기존 메시지와 중복되지 않도록 필터링
        setMessageList((prev) => {
          const existingMessageIds = new Set(prev.map((msg) => msg.id));
          const filteredNewMessages = newMessages.filter(
            (msg) => !existingMessageIds.has(msg.id)
          );
          return [...filteredNewMessages, ...prev];
        });
        // 마지막으로 로드한 메시지의 타임스탬프 설정
        lastTimeStampRef.current =
          newMessages[newMessages.length - 1].timeStamp;
      }
      setHasMore(response.data.hasMore);

      // 초기 로드 시 시스템 메시지로 스크롤 이동 또는 최하단으로 스크롤
      if (isInitialLoadRef.current && newMessages.length > 0) {
        const hasUnread = newMessages.some((msg) => msg.status === 2);
        if (hasUnread) {
          scrollToSystemRef.current = true;
          shouldScrollToBottomRef.current = false; // 자동 스크롤 방지
        } else {
          shouldScrollToBottomRef.current = true; // 최하단으로 스크롤
        }
        isInitialLoadRef.current = false;
      }

      // 새로운 메시지가 로드된 경우 (이전 메시지가 아닌 새로운 메시지 추가)
      if (!lastTimeStampRef.current && newMessages.length > 0) {
        shouldScrollToBottomRef.current = true;
      }
    } catch (error) {
      console.error("메시지 로드 실패:", error);
      alert("메시지 로드에 실패했습니다. 다시 시도해주세요."); // 사용자에게 에러 피드백 제공
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, selectedRoomId, uid]);

  // 새로운 메시지가 추가될 때 최하단으로 스크롤
  useEffect(() => {
    if (shouldScrollToBottomRef.current) {
      const container = chatContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
      shouldScrollToBottomRef.current = false;
    }
  }, [messageList]);

  // 스크롤 이벤트 핸들러 (디바운싱 적용)
  const handleScroll = useCallback(
    debounce(() => {
      const container = chatContainerRef.current;
      if (container.scrollTop === 0 && hasMore && !loading) {
        previousScrollHeightRef.current = container.scrollHeight;
        shouldScrollToBottomRef.current = false;
        loadMessages();
      }
    }, 200),
    [hasMore, loading, loadMessages]
  );

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useLayoutEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    if (isInitialLoadRef.current) {
      // 초기 로드 이후에는 이미 스크롤이 설정되었으므로 무시
      return;
    }

    const unreadMessageIndex = messageList.findIndex((msg) => msg.status === 2);
    if (unreadMessageIndex !== -1) {
      if (scrollToSystemRef.current && systemMessageRef.current) {
        systemMessageRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        scrollToSystemRef.current = false;
        shouldScrollToBottomRef.current = false; // 스크롤 이동 후 자동 스크롤 방지
      }
    }

    // 이전 메시지를 로드한 후 스크롤 위치 유지
    if (isLoadingOlderMessagesRef.current && previousScrollHeightRef.current) {
      const newScrollHeight = container.scrollHeight;
      const scrollDifference =
        newScrollHeight - previousScrollHeightRef.current;
      container.scrollTop = scrollDifference;
      previousScrollHeightRef.current = 0;
      isLoadingOlderMessagesRef.current = false;
    }
  }, [messageList]);

  const processedMessages = processMessages(messageList, uid);

  //================================================================================================

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
              <ProfileModal
                profileHandler={profileHandler}
                profileRef={profileRef}
              />
            ) : null}
            <MessageToolTip tooltip={"프로필 보기"} />
          </div>

          <div className="search">
            <img className="searchImg" src="../images/image.png" alt="" />
            <input type="text" placeholder="Search..." onChange={null} />
          </div>
        </div>
        <div className="list frequent">
          <h3>즐겨찾기</h3>
          <div className="rooms">
            {isLoading ? <div>Loading...</div> : null}
            {roomData && roomData.length > 0 ? (
              roomData
                .filter((room) => room.chatRoomFavorite === 1)
                .map((room) => (
                  <div
                    className={`room ${
                      selectedRoomId === room.id ? "selected" : null
                    }`}
                    key={room.id}
                    onClick={(e) => selectRoomHandler(e, room.id)}
                  >
                    <img
                      className="profile"
                      src="../images/sample_item1.jpg"
                      alt=""
                    />
                    <div className="name_preview">
                      <div className="name">
                        <span>{room.chatRoomName}</span>
                        <img
                          className="frequentImg"
                          src="../images/gold_star.png"
                          alt=""
                          onClick={(e) => frequentHandler(e, room)}
                        />
                      </div>
                      <div className="preview">{room.lastMessage}</div>
                    </div>
                    <div className="date_unRead">
                      <span className="date">
                        {formatTime(room.lastTimeStamp)}
                      </span>
                      {room.unreadCount ? (
                        <div className="unReadCnt">
                          <span>{room.unreadCount}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))
            ) : (
              <div className="noRoom">대화방이 존재하지 않습니다.</div>
            )}
          </div>
        </div>

        <div className="list">
          <h3>대화방</h3>
          <div className="rooms">
            {isLoading ? <div>Loading...</div> : null}
            {roomData && roomData.length > 0 ? (
              roomData
                .filter((room) => room.chatRoomFavorite === 0)
                .map((room) => (
                  <div
                    className={`room ${
                      selectedRoomId === room.id ? "selected" : null
                    }`}
                    key={room.id}
                    onClick={(e) => selectRoomHandler(e, room.id)}
                  >
                    <img
                      className="profile"
                      src="../images/sample_item1.jpg"
                      alt=""
                    />
                    <div className="name_preview">
                      <div className="name">
                        <span>{room.chatRoomName}</span>
                        <img
                          className="frequentImg"
                          src="../images/gray_star.png"
                          alt=""
                          onClick={(e) => frequentHandler(e, room)}
                        />
                      </div>
                      <div className="preview">
                        <span>{room.lastMessage}</span>
                      </div>
                    </div>
                    <div className="date_unRead">
                      <span>{formatTime(room.lastTimeStamp)}</span>
                      {room.unreadCount ? (
                        <div className="unReadCnt">
                          <span>{room.unreadCount}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))
            ) : (
              <div className="noRoom">대화방이 존재하지 않습니다.</div>
            )}
          </div>
        </div>
        {isOpen == true ? <InviteModal {...propsObject} /> : null}
        <div className="create">
          <button className="create-btn" onClick={openHandler}>
            <img src="/images/message-createRoom.png" alt="" />
            대화방 생성
          </button>
        </div>
      </div>
      {selectedRoomId ? (
        <div className="view">
          <div className="others">
            <div className="profile_name_preview">
              <img
                className="profile"
                src="../images/sample_item1.jpg"
                alt=""
              />
              <div className="chatRoomName">
                <span>{roomInfo.chatRoomName}</span>
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

              {moreFn == true ? (
                <ShowMoreModal
                  moreFnHandler={moreFnHandler}
                  showMoreRef={showMoreRef}
                  uid={uid}
                  selectedRoomId={selectedRoomId}
                />
              ) : null}
              <img
                className="searchImg"
                src="../images/More.png "
                alt=""
                onClick={moreFnHandler}
              />
            </div>
          </div>
          <div
            className="messages"
            ref={chatContainerRef}
            onScroll={handleScroll}
          >
            {loading && <div className="chatLoading">로딩 중...</div>}
            {!hasMore && (
              <div className="system-message">이전 메시지가 없습니다.</div>
            )}
            {messageList && messageList.length > 0
              ? processedMessages.map((message) => {
                  if (message.status === 2) {
                    return (
                      <React.Fragment key={`fragment-${message.id}`}>
                        <div ref={systemMessageRef} className="system-message">
                          여기부터 읽지 않은 메시지
                        </div>
                        <div
                          className={
                            message.isOwnMessage
                              ? "my-message_profile"
                              : "others-messages"
                          }
                          key={message.id}
                        >
                          <div
                            className={
                              message.isOwnMessage
                                ? "my-messages_readTime"
                                : "others-messages_readTime"
                            }
                          >
                            <div
                              className={
                                message.isOwnMessage
                                  ? "my-message"
                                  : "others-message"
                              }
                            >
                              {message.content}
                            </div>
                            {message.isLast ? (
                              <div className="readTime">
                                {formatTime(message.timeStamp)}
                              </div>
                            ) : null}
                          </div>
                          {message.isFirst ? (
                            <div className="profileDiv">
                              <img
                                className="message-profile"
                                src="../images/sample_item1.jpg"
                                alt=""
                              />
                            </div>
                          ) : (
                            <div className="profileDiv"></div>
                          )}
                        </div>
                      </React.Fragment>
                    );
                  }
                  return (
                    <div
                      className={
                        message.isOwnMessage
                          ? "my-message_profile"
                          : "others-messages"
                      }
                      key={message.id}
                    >
                      <div
                        className={
                          message.isOwnMessage
                            ? "my-messages_readTime"
                            : "others-messages_readTime"
                        }
                      >
                        <div
                          className={
                            message.isOwnMessage
                              ? "my-message"
                              : "others-message"
                          }
                        >
                          {message.content}
                        </div>
                        {message.isLast ? (
                          <div className="readTime">
                            {formatTime(message.timeStamp)}
                          </div>
                        ) : null}
                      </div>
                      {message.isFirst ? (
                        <div className="profileDiv">
                          <img
                            className="message-profile"
                            src="../images/sample_item1.jpg"
                            alt=""
                          />
                        </div>
                      ) : (
                        <div className="profileDiv"></div>
                      )}
                    </div>
                  );
                })
              : null}
          </div>
          <div className="send-message">
            <div className="input_fileIcon">
              <input
                className="message-input"
                type="text"
                placeholder="메시지를 입력해주세요"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e)}
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
            <button
              className="send-btn"
              onClick={(e) => handleSendMessage(e)}
              disabled={!isConnected}
            >
              보내기
            </button>
          </div>
          {chatContainerRef.current &&
          chatContainerRef.current.scrollTop !=
            chatContainerRef.current.scrollHeight ? (
            <img
              src="/images/arrow-down.png"
              className="scrollDownBtn"
              onClick={() => {
                // 마지막 메시지 요소를 부드럽게 스크롤
                const lastMessage = chatContainerRef.current.lastElementChild;
                lastMessage?.scrollIntoView({
                  behavior: "smooth",
                  block: "end",
                });
              }}
            />
          ) : null}
          {unreadCount > 0 && (
            <div className="unread-count">
              {unreadCount}개의 읽지 않은 메시지가 있습니다.
            </div>
          )}
        </div>
      ) : (
        <div className="view noChat">
          <img src="/images/message-IconPurple.png" alt="" />
          <span>대화방을 생성하거나 선택하여 대화를 시작해보세요.</span>
        </div>
      )}
    </div>
  );
}

const processMessages = (messages, currentuid) => {
  if (!messages) return [];

  return messages.map((message, index) => {
    const previousMessage = messages[index - 1];
    const nextMessage = messages[index + 1];

    // 이전 메시지와 현재 메시지의 발신자가 다른 경우
    const isFirst =
      !previousMessage || previousMessage.sender !== message.sender;

    let isLast = false;

    if (!nextMessage) {
      // 마지막 메시지인 경우
      isLast = true;
    } else {
      const sameSender = nextMessage.sender === message.sender;

      const currentTime = new Date(message.timeStamp);
      const nextTime = new Date(nextMessage.timeStamp);

      // 현재 메시지와 다음 메시지의 분 단위가 다른지 확인
      const minuteChanged = currentTime.getMinutes() !== nextTime.getMinutes();

      // isLast는 다음 메시지의 발신자가 다르거나, 분 단위가 변경된 경우에 true
      isLast = !sameSender || minuteChanged;
    }

    return {
      ...message,
      isFirst,
      isLast,
      isOwnMessage: message.sender === currentuid,
    };
  });
};
