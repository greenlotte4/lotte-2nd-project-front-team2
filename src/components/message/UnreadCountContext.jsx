/* eslint-disable react/prop-types */
// src/contexts/UnreadCountContext.js
import { createContext, useState, useEffect, useCallback, useRef } from "react";
import { Client } from "@stomp/stompjs";
import axiosInstance from "../../services/axios";
import useUserStore from "../../store/useUserStore";

export const UnreadCountContext = createContext();

export const UnreadCountProvider = ({ children }) => {
  const [unreadCounts, setUnreadCounts] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [lastTimeStamp, setLastTimeStamp] = useState({});
  const [selectedRoomId, setSelectedRoomId] = useState();
  const [messageList, setMessageList] = useState([]);

  const [isConnected, setIsConnected] = useState(false);
  const [stompClient, setStompClient] = useState(null);

  const subscriptionRef = useRef(null);
  const shouldScrollToBottomRef = useRef(true);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const wsUrl = "ws://" + apiBaseUrl.replace("http://", "") + "/ws-chat";
  const uid = useUserStore((state) => state.user?.uid);
  const getWebSocketHeaders = async () => {
    const accessToken = axiosInstance.defaults.headers.Authorization;
    return {
      Authorization: accessToken || "",
    };
  };
  useEffect(() => {
    if (uid === undefined) {
      return;
    }
    const initializeStompClient = async () => {
      const headers = await getWebSocketHeaders();
      const client = new Client({
        brokerURL: wsUrl,
        connectHeaders: headers,
        debug: function (str) {
          console.log(`[STOMP DEBUG]: ${str}`);
        },
        reconnectDelay: 5000, // 재연결 시도 간격 (밀리초)
        onConnect: () => {
          console.log("WebSocket connected");
          setIsConnected(true);

          // 읽지 않은 메시지 수 전용 큐 구독
          client.subscribe(`/topic/notifications/${uid}`, (message) => {
            if (message.body) {
              const data = JSON.parse(message.body);

              if (data.type === "unreadCount") {
                setUnreadCounts((prevCounts) => ({
                  ...prevCounts,
                  [data.chatRoomId]: data.unreadCount,
                }));
                console.log("전파 받은 안읽은 수 : ", data.unreadCount);
              } else if (data.type === "lastMessage") {
                setLastMessages((prevMessages) => ({
                  ...prevMessages,
                  [data.chatRoomId]: data.lastMessage,
                }));
                setLastTimeStamp((prevTimeStamp) => ({
                  ...prevTimeStamp,
                  [data.chatRoomId]: data.lastTimeStamp,
                }));
              }
            }
          });
        },
        onStompError: (frame) => {
          console.error("STOMP Error:", frame.headers["message"]);
        },
      });
      updateSubscriptions(client);

      client.activate();
      setStompClient(client);
    };

    initializeStompClient();

    // 클린업: 컴포넌트 언마운트 시 클라이언트 비활성화
    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [wsUrl, uid]);

  const updateSubscriptions = useCallback(
    (client) => {
      if (selectedRoomId) {
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }
        // 새로운 구독 설정
        subscriptionRef.current = client.subscribe(
          `/topic/chat/${selectedRoomId}`,
          (message) => {
            try {
              const response = JSON.parse(message.body);
              setMessageList((prev) => [...prev, response]);
              shouldScrollToBottomRef.current = true;
            } catch (error) {
              console.error("Failed to parse message:", error);
            }
          }
        );
        console.log("현재 구독", subscriptionRef.current);
      }
    },
    [selectedRoomId, setMessageList]
  );

  return (
    <UnreadCountContext.Provider
      value={{
        unreadCounts,
        setUnreadCounts,
        lastMessages,
        setLastMessages,
        isConnected,
        lastTimeStamp,
        setLastTimeStamp,
      }}
    >
      {children}
    </UnreadCountContext.Provider>
  );
};
