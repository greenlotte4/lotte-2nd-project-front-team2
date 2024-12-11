import { useEffect, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import axiosInstance from '@/services/axios.jsx';

const useWebSocketProgress = ({ initialDestination, initialMessage, initialFolderId, initialUserId}) => {
    const [destination, setDestination] = useState(initialDestination);
    const [sendMessage, setSendMessage] = useState(initialMessage);
    const [folderId, setFolderId] =  useState(initialFolderId);
    const [userId,setUserId] = useState(initialUserId);
    const [isConnected, setIsConnected] = useState(false);
    const [progress, setProgress] = useState(0);
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
                subscribeToTopics(client);
            },
            onStompError: (frame) => {
                console.log("STOMP Error:", frame);
            },
        });
        setStompClient(client);
    }, [wsUrl]);
    

    const subscribeToTopics = (client) => {
        // 진행률 구독
        client.subscribe(`/topic/progress/uploads/${userId}`, (message) => {
            try {
                const progress = parseInt(message.body, 10); // Parse integer progress
                if (!isNaN(progress)) {
                    console.log('Received upload progress:', progress);
                    setProgress(progress); // Update the progress state
                } else {
                    console.warn('Invalid progress data received:', message.body);
                }
            } catch (error) {
                console.error('Failed to process progress message:', error);
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
    const ProgresssendMessage = useCallback((destination, body) => {
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


    useEffect(() => {
        if (stompClient && isConnected) {
            subscribeToTopics(stompClient);
        }
    }, [folderId, userId, isConnected, stompClient]);

    const updateFolderId = (newFolderId) =>{
        setFolderId(newFolderId);
    }
    const updateUserId = (newUserId)=>{
        setUserId(newUserId);
    }
    

    return {
        isConnected,
        progress,
        sendMessage,
        updateUserId,
        updateFolderId,
        initializeStompClient
    };
};

export default useWebSocketProgress;
