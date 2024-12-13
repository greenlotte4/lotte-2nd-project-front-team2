import { useCallback, useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import axiosInstance from '@/services/axios.jsx';


const useProjectData  = (projectId) => {
    const [boardData, setBoardData] = useState(null);
    const [isConnected, setIsConnected] = useState(false); // WebSocket 연결 상태
    const [stompClient, setStompClient] = useState(null); // STOMP 클라이언트 인스턴스

    // HTTP GET으로 초기 데이터 가져오기
    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                const response = await axiosInstance.get(`/api/project/${projectId}`);
                setBoardData(response.data); // 받은 데이터로 boardData 설정
            } catch (error) {
                console.error('Error fetching board data:', error);
            }
        };
        fetchBoardData();
    }, [projectId]);


    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const wsUrl = "ws://" + apiBaseUrl.replace("http://", "") + "/ws-project";

    // WebSocket 연결 헤더 가져오기
    const getWebSocketHeaders = async () => {
        const accessToken = await axiosInstance.defaults.headers.Authorization;
        return {
            Authorization: accessToken || '',
        };
    };

    // STOMP 클라이언트 초기화
    useEffect(() => {
        const initializeStompClient = async () => {
            const headers = await getWebSocketHeaders();

            const client = new Client({
                brokerURL: wsUrl,
                connectHeaders: headers,
                debug: (str) => console.log("WebSocket Debug Log:", str),
                reconnectDelay: 5000, // 5초마다 재연결 시도
                onConnect: () => {
                    console.log('WebSocket connected');
                    setIsConnected(true);

                    client.subscribe(`/topic/project/${projectId}/update`, (message) => {
                        const eventData = JSON.parse(message.body);
                        handleBoardEvent(eventData); // 메시지 처리
                    });
                },
                onStompError: (frame) => {
                    console.error('STOMP Error:', frame.headers['message']);
                },
            });

            setStompClient(client);
            client.activate();
        };

        initializeStompClient();

        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, [projectId]);

    const sendWebSocketMessage = useCallback((message, destination) => {
        if (isConnected && stompClient) {
            stompClient.publish({
                destination: destination, // 동적으로 변경되는 목적지
                body: JSON.stringify(message), // 전송할 메시지
            });
        } else {
            console.error('WebSocket is not connected');
        }
    }, [isConnected, stompClient]);  // stompClient와 isConnected만 의존성 배열에 포함



    // WebSocket 메시지 처리 함수
    const handleBoardEvent = (eventData) => {
        if (!eventData || !eventData.type || !eventData.payload) {
            console.warn('Invalid event data received:', eventData);
            return;
        }
        const { type, payload } = eventData;
    
        switch (type) {
            case 'TASK_ADDED': {
                console.log('TASK_ADDED');
                setBoardData((prevData) => {
                    const updatedColumns = prevData.columns.map((col) => {
                        if (col.id !== payload.columnId) return col;
            
                        if (!col.tasks.some(task => task.id === payload.id)) {
                            return { ...col, tasks: [...col.tasks, payload] };
                        }
                        return col;
                    });
            
                    return { ...prevData, columns: updatedColumns };
                });
                break;
            }
            case 'SUBTASK_ADDED': {
                console.log('SUBTASK_ADDED')
                setBoardData((prevData) => {
                      const updatedColumns = prevData.columns.map((col) => {
                        if (col.id !== payload.columnId) return col;
                  
                        return {
                          ...col,
                          tasks: col.tasks.map((task) => {
                            if (task.id !== payload.taskId) return task;
                  
                            return {
                              ...task,
                              subTasks: [
                                ...(task.subTasks||[]),
                                { id: payload.id, isChecked: payload.isChecked, name: payload.name },
                              ],
                            };
                          }),
                        };
                      });
                  
                      return { ...prevData, columns: updatedColumns };
                    });
                break;
            }
    
            case 'TASK_UPDATED': {
                console.log('TASK_UPDATED')
                setBoardData((prevData) => {
                    const updatedColumns = prevData.columns.map((col) => {
                        if (col.id !== payload.columnId) return col;
    
                        const updatedTasks = col.tasks.map((existingTask) =>
                            existingTask.id === payload.id ? { ...existingTask, ...payload } : existingTask
                        );
                        return { ...col, tasks: updatedTasks };
                    });
    
                    return { ...prevData, columns: updatedColumns };
                });
                break;
            }
    
            case 'TASK_DELETED': {
                const { taskId, columnIndex } = payload;
    
                console.log('TASK_DELETED')
                setBoardData((prevData) => {
                    const updatedColumns = prevData.columns.map((col, idx) => {
                        if (idx !== columnIndex) return col;
    
                        const filteredTasks = col.tasks.filter((task) => task.id !== taskId);
                        return { ...col, tasks: filteredTasks };
                    });
    
                    return { ...prevData, columns: updatedColumns };
                });
                break;
            }
            case 'COLUMN_DELETED': {
                setBoardData((prevData) => {
                    const updatedColumns = prevData.columns.filter((col) => col.id !== payload);
                    return { ...prevData, columns: updatedColumns };
                  });
                break;
            }
            case 'SUBTASK_DELETED': {
                const { taskId, columnIndex } = payload;
    
                console.log('TASK_DELETED')
                setTask((prevTask) => ({
                    ...prevTask,
                    subTasks: prevTask.subTasks.filter((_, i) => i !== index),
                  }));
                setBoardData();
                break;
            }
    
            default:
                console.warn(`Unhandled event type: ${type}`);
        }
    };


    return {
        boardData, // 화면에 보여줄 데이터
        sendWebSocketMessage
    };
};

export default useProjectData ;
