import { useEffect, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import axiosInstance from '@/services/axios.jsx';

const useWebSocketProgress = ({ folderId, userId}) => {
    const [isConnected, setIsConnected] = useState(false);
    const [progress, setProgress] = useState(0);
    const [collaborators, setCollaborators] = useState([]);
    const [stompClient, setStompClient] = useState(null);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const wsUrl = "ws://" + apiBaseUrl.replace("http://", "") + "/ws-progress";

    const getWebSocketHeaders = async () => {
        const accessToken = await axiosInstance.defaults.headers.Authorization;
        return {
            Authorization: accessToken || '',
        };
    };

    const initializeStompClient = useCallback(async () => {
        const headers = await getWebSocketHeaders();
        const client = new Client({
            brokerURL: wsUrl,
            connectHeaders: headers,
            debug: function (str) {
                console.log(str);
            },
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Editor WebSocket connected');
                setIsConnected(true);
                subscribeToEditorTopics(client);
            },
            onStompError: (frame) => {
                console.log("STOMP Error:", frame);
            },
        });
        setStompClient(client);
    }, [wsUrl]);
    

    const subscribeToEditorTopics = (client) => {
        // 진행률 내용 구독
        client.subscribe(`/topic/progress/uploads/${userId}`, (message) => {
            try {
                const response = JSON.parse(message.body);
                console.log('Received page update:', response);
                setProgress(response.content);
            } catch (error) {
                console.error("Failed to parse progress message:", error);
            }
        });

        // 협업자 상태 구독
        client.subscribe(`/topic/page/${folderId}/collaborators`, (message) => {
            try {
                const response = JSON.parse(message.body);
                console.log('Collaborators update:', response);
                setCollaborators(response.collaborators);
            } catch (error) {
                console.error("Failed to parse collaborators message:", error);
            }
        });

        // 사용자별 알림 구독
        client.subscribe(`/topic/page/user/${userId}`, (message) => {
            try {
                const response = JSON.parse(message.body);
                console.log('User notification:', response);
                // 알림 처리 로직 추가
            } catch (error) {
                console.error("Failed to parse user message:", error);
            }
        });
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

    // 에디터 내용 변경사항 전송
    const sendMessage = useCallback((destination, body) => {
        if (isConnected && stompClient) {
            stompClient.publish({
                destination,
                body: JSON.stringify(body), // 서버에서 JSON 파싱 가능하도록 직렬화
            });
            console.log(`Message sent to ${destination}:`, body);
        } else {
            console.error('WebSocket is not connected');
        }
    }, [stompClient, isConnected]);
    

    return {
        isConnected,
        progress,
        collaborators,
        sendMessage,
        initializeStompClient
    };
};

export default useWebSocketProgress;
