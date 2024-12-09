// /* eslint-disable react-hooks/exhaustive-deps */
import { Client } from "@stomp/stompjs";
import { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "../services/axios";

const useChatWebSocket = ({
  initialMembers,
  initialUserId,
  selectedRoomId,
  setMessageList,
  setUnreadCount,
  chatContainerRef,
  shouldScrollToBottomRef,
}) => {
  const [members, setmembers] = useState(initialMembers || []);
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState(initialUserId);
  const clientRef = useRef(null);
  const subscriptionRef = useRef(null);
  const isSubscribed = useRef(false); // 중복 구독 방지용

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const wsUrl = "ws://" + apiBaseUrl.replace("http://", "") + "/ws-chat";

  const [stompClient, setStompClient] = useState(null);

  const getWebSocketHeaders = async () => {
    const accessToken = axiosInstance.defaults.headers.Authorization;
    return {
      Authorization: accessToken || "",
    };
  };

  const initializeStompClient = useCallback(async () => {
    const headers = await getWebSocketHeaders();
    const client = new Client({
      brokerURL: wsUrl,
      connectHeaders: headers,
      debug: function (str) {
        console.log(`[STOMP DEBUG]: ${str}`);
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        updateSubscriptions(client);
      },
      onStompError: (frame) => {
        console.log("STOMP Error:", frame);
      },
    });
    setStompClient(client);
  }, [wsUrl]);

  const updateSubscriptions = useCallback(
    (client) => {
      if (selectedRoomId) {
        // 새로운 구독 설정
        subscriptionRef.current = client.subscribe(
          `/topic/chat/${selectedRoomId}`,
          (message) => {
            try {
              const response = JSON.parse(message.body);
              setMessageList((prev) => [...prev, response]);
              shouldScrollToBottomRef.current = true;
              // 읽지 않은 메시지 수 업데이트
              if (document.hidden) {
                // 사용자가 현재 창을 보고 있지 않으면
                setUnreadCount((prev) => prev + 1);
              }
            } catch (error) {
              console.error("Failed to parse message:", error);
            }
          }
        );
      }
    },
    [selectedRoomId, setMessageList]
  );

  useEffect(() => {
    if (!stompClient) {
      initializeStompClient();
    } else {
      stompClient.activate();
    }

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [stompClient, initializeStompClient]);

  useEffect(() => {
    if (stompClient && isConnected) {
      updateSubscriptions(stompClient);
    }
  }, [selectedRoomId, isConnected, stompClient, updateSubscriptions]);

  const sendWebSocketMessage = useCallback(
    (message, path) => {
      if (isConnected && stompClient) {
        stompClient.publish({
          destination: path,
          body: JSON.stringify(message),
        });
      } else {
        console.error("WebSocket is not connected");
      }
    },
    [stompClient, isConnected]
  );

  const updateMembers = (newIds) => {
    setmembers(newIds);
  };

  const updateUserId = (newId) => {
    setUserId(newId);
  };

  return {
    stompClient,
    setmembers,
    members,
    isConnected,
    sendWebSocketMessage,
    updateMembers,
    updateUserId,
    initializeStompClient,
    updateSubscriptions,
  };
};

export default useChatWebSocket;
