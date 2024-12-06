import { useEffect, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import axiosInstance from '@/services/axios.jsx';

const useWebSocketPage = ({ pageId, userId}) => {
    const [isConnected, setIsConnected] = useState(false);
    const [editorContent, setEditorContent] = useState(null);
    const [collaborators, setCollaborators] = useState([]);
    const [stompClient, setStompClient] = useState(null);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const wsUrl = "ws://" + apiBaseUrl.replace("http://", "") + "/ws-editor";

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
        // 페이지 내용 구독
        client.subscribe(`/topic/page/${pageId}`, (message) => {
            try {
                const response = JSON.parse(message.body);
                console.log('Received page update:', response);
                setEditorContent(response.content);
            } catch (error) {
                console.error("Failed to parse page message:", error);
            }
        });

        // 협업자 상태 구독
        client.subscribe(`/topic/page/${pageId}/collaborators`, (message) => {
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
    const sendEditorUpdate = useCallback((content) => {
        if (isConnected && stompClient) {
            stompClient.publish({
                destination: `/app/page/${pageId}/update`,
                body: JSON.stringify({
                    pageId,
                    userId,
                    content,
                    timestamp: new Date().toISOString()
                }),
            });
        } else {
            console.error('WebSocket is not connected');
        }
    }, [stompClient, isConnected, pageId, userId]);

    // 커서 위치 업데이트 전송
    const sendCursorPosition = useCallback((position) => {
        if (isConnected && stompClient) {
            stompClient.publish({
                destination: `/app/page/${pageId}/cursor`,
                body: JSON.stringify({
                    pageId,
                    userId,
                    position,
                    timestamp: new Date().toISOString()
                }),
            });
        }
    }, [stompClient, isConnected, pageId, userId]);

    return {
        isConnected,
        editorContent,
        collaborators,
        sendEditorUpdate,
        sendCursorPosition,
        initializeStompClient
    };
};

export default useWebSocketPage;
