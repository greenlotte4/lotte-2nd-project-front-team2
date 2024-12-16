import { useEffect, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import axiosInstance from '@/services/axios.jsx';

const usePageUsersSocket = ({ initialDestination, initialMessage , setReceiveUsers}) => {
    const [destination, setDestination] = useState(initialDestination);
    const [sendMessage, setSendMessage] = useState(initialMessage);
    const [isConnected, setIsConnected] = useState(false);
    const [receiveMessage, setReceiveMessage] = useState([]);
    const [pageId, setPageId] = useState();
    const [userId, setUserId] = useState();

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const wsUrl = "ws://" + apiBaseUrl.replace("http://", "") + "/ws-page";

    const [stompClient, setStompClient] = useState(null);

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
                console.log(str)
            },
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('WebSocket connected');
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
        if (userId) {
            client.unsubscribe(`/topic/page/user/${userId}`);
        }
    
        if (userId) {
            client.subscribe(`/topic/page/user/${userId}`, (message) => {
                try {
                    const response = JSON.parse(message.body);
                    console.log(response)
                    setReceiveUsers(response.message)
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
    }, [ userId, isConnected, stompClient]);

    const sendWebSocketMessage = useCallback((message, path) => {
        if (isConnected && stompClient) {
            stompClient.publish({
                destination: path,
                body: JSON.stringify(message),
            });
        } else {
            console.error('WebSocket is not connected');
        }
    }, [stompClient, isConnected]);

    const updateUserId = (newUser) => {
        setUserId(newUser);
    };

    return {
        stompClient,
        setDestination,
        setSendMessage,
        isConnected,
        receiveMessage,
        sendWebSocketMessage,
        updateUserId,
        initializeStompClient
    };
};

export default usePageUsersSocket;
