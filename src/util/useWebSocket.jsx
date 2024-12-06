import { useEffect, useState, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import axiosInstance from "@/services/axios.jsx";

const useWebSocket = ({
  initialDestination,
  initialMessage,
  initialCalendarId,
  initialUserId,
}) => {
  const [destination, setDestination] = useState(initialDestination);
  const [sendMessage, setSendMessage] = useState(initialMessage);
  const [calendarIds, setCalendarIds] = useState(initialCalendarId || []);
  const [isConnected, setIsConnected] = useState(false);
  const [receiveMessage, setReceiveMessage] = useState([]);
  const [userId, setUserId] = useState(initialUserId);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const wsUrl = "ws://" + apiBaseUrl.replace("http://", "") + "/ws-calendar";

  const [stompClient, setStompClient] = useState(null);

  const getWebSocketHeaders = async () => {
    const accessToken = await axiosInstance.defaults.headers.Authorization;
    return {
      Authorization: accessToken || "",
    };
  };

  const initializeStompClient = useCallback(async () => {
    const headers = await getWebSocketHeaders();
    const client = new Client({
      brokerURL: wsUrl,
      connectHeaders: headers,
      debug: function (str) {},
      reconnectDelay: 5000,
      heartbeatIncoming: 10000, // 서버에서 보내는 heart-beat 간격
      heartbeatOutgoing: 10000, // 클라이언트가 보내는 heart-beat 간격
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

  const updateSubscriptions = (client) => {
    if (calendarIds && calendarIds.length > 0) {
      calendarIds.forEach((calendarId) => {
        client.subscribe(`/topic/calendar/${calendarId}`, (message) => {
          try {
            const response = JSON.parse(message.body);
            console.log(response);
            setReceiveMessage(response);
          } catch (error) {
            console.error("Failed to parse message:", error);
          }
        });
      });
    }

    if (userId) {
      client.subscribe(`/topic/calendar/user/${userId}`, (message) => {
        try {
          const response = JSON.parse(message.body);
          console.log(response);
          setReceiveMessage(response);
        } catch (error) {
          console.error("Failed to parse user message:", error);
        }
      });
    }

    if (destination && sendMessage) {
      client.publish({
        destination,
        body: sendMessage,
      });
    }
  };

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
  }, [calendarIds, userId, isConnected, stompClient]);

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

  const updateCalendarIds = (newIds) => {
    setCalendarIds(newIds);
  };

  const updateUserId = (newId) => {
    setUserId(newId);
  };

  return {
    stompClient,
    setDestination,
    setSendMessage,
    setCalendarIds,
    calendarIds,
    isConnected,
    receiveMessage,
    sendWebSocketMessage,
    updateCalendarIds,
    updateUserId,
    initializeStompClient,
  };
};

export default useWebSocket;
