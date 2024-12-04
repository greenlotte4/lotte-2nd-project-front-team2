import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import CustomAlert from '../Alert';
import GetAddressModal from './GetAddressModal';
import axiosInstance from '@/services/axios.jsx'
import useWebSocket from '../../util/useWebSocket';
import { Client } from '@stomp/stompjs';
import { useCalenderNameStore } from '../../store/zustand';

export default function DeleteAndModifyCalendarModal({isOpen, onClose,selectedCalendar}) {

    const queryClient = useQueryClient();
    const [customAlert, setCustomAlert] = useState(false);
    const [customAlertType, setCustomAlertType] = useState("");
    const [customAlertMessage, setCustomAlertMessage] = useState("");
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');
    const [color,setColor] = useState('');
    const [colors,setColors] = useState(["red","blue","green","purple","yellow","orange"])
    const usedColors = queryClient.getQueryData(['calendar-name']) || [];
    const [filteredColors, setFilteredColors] = useState([]);
    const [isFiltering, setIsFiltering] = useState(false);
    const [openAddress,setOpenAddress] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const { sendWebSocketMessage } = useWebSocket({});
    const [selectedCalendarId, setSelectedCalendarId] = useState();

    useEffect(() => {
        if (Array.isArray(usedColors) && usedColors.length > 0) {
            const filtered = colors.filter(v => {
                return !usedColors.some(used => used.color === v) || v === selectedCalendar.color;
            });
        setFilteredColors(filtered);
        setIsFiltering(true);
        }
    }, [usedColors, colors]);

    useEffect(()=>{
        if(selectedCalendar && typeof selectedCalendar === 'object'){
            setName(selectedCalendar.name)
            setStatus(selectedCalendar.status)
            setColor(selectedCalendar.color)
            setSelectedCalendarId(selectedCalendar.id)
        }
    },[selectedCalendar])
    
    const {data : selectedUsersData, isLoading : isLoadingSelectedUsers, isError : isErrorSelectedUsers } = useQuery({
        queryKey : ['group-users-calendar',selectedCalendar],
        queryFn : async () => {
            try {
                const resp = await axiosInstance.get("/api/calendar/users?id="+selectedCalendar.id)
                return resp.data
            } catch (err) {
                return err
            }
        },
        enabled: selectedCalendar.id != 0,
        retry : 1,
    })

    useEffect(() => {
        if (Array.isArray(selectedUsersData) && selectedUsersData.length > 0) {
            setSelectedUsers(selectedUsersData);
        }
    }, [selectedUsersData]);
    

    const cancleSelectedUsersHandler = (e,user) => {
        setSelectedUsers((prev)=>{
            return prev.filter((selectedUser) => selectedUser.id !== user.id);
        })
    }

    const putCalendarMutation = useMutation({
        mutationFn : async () => {
            try {
                const resp = await axiosInstance.put("/api/calendar",{
                    users : selectedUsers,
                    name,
                    status,
                    color,
                    id : selectedCalendar.id
                })
                return resp.data
            } catch (err) {
                return err;
            }
        },
        onSuccess : (data) => {
            setCustomAlert(true)
            setCustomAlertMessage(data)
            setCustomAlertType("success")

            sendWebSocketMessage(selectedCalendarId,'/app/calendar/update'); // "update" 메시지 전송
            setTimeout(() => {
                setCustomAlert(false)
                onClose();
            }, 1000);
        },
        onError : (err) => {
            setCustomAlert(true)
            setCustomAlertMessage(err)
            setCustomAlertType("error")
            
            setTimeout(() => {
                setCustomAlert(false)
            }, 1000);
        }
    })

    const deleteCalendarMutation = useMutation({
        mutationFn : async () => {
            try {
                const resp = await axiosInstance.delete("/api/calendar?id="+selectedCalendar.id)
                return resp.data
            } catch (err) {
                return err;
            }
        },
        onSuccess : (data) => {
            setCustomAlert(true)
            setCustomAlertMessage(data)
            setCustomAlertType("success")

            // queryClient.setQueryData(['calendar-date'])
            sendWebSocketMessage(selectedCalendarId,'/app/calendar/delete'); 
            setTimeout(() => {
                setCustomAlert(false)
                onClose();
            }, 1000);
        },
        onError : (err) => {
            setCustomAlert(true)
            setCustomAlertMessage(err)
            setCustomAlertType("error")

            setTimeout(() => {
                setCustomAlert(false)
            }, 1000);
        }
    })

    const putCalendarHandler = async () => {
        try {
            await putCalendarMutation.mutateAsync();
        } catch (err) {
            setCustomAlert(true)
            setCustomAlertMessage(err)
            setCustomAlertType("error")

            setTimeout(() => {
                setCustomAlert(false)
            }, 1000);
        }
    }

    const deleteCalendarHandler = async () => {
        try {
            await deleteCalendarMutation.mutateAsync();
        } catch (err) {
            setCustomAlert(true)
            setCustomAlertMessage(err)
            setCustomAlertType("error")

            setTimeout(() => {
                setCustomAlert(false)
            }, 1000);
        }
    }


    if(!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-custom-fixed">
        <CustomAlert 
            type={customAlertType} message={customAlertMessage} isOpen={customAlert}
        />
        <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-[800px] modal-custom-width max-h-[800px] overflow-scroll scrollbar-none">
        
            <div className="display-flex mb-8 py-3.5 px-12 bg-white border-b rounded-t-2xl z-10 sticky top-0">
                <span className="text-xl font-bold">{selectedCalendar.name}</span>
                <button 
                onClick={onClose}
                className="text-xl float-right display-block font-bold text-gray-600 hover:text-gray-900"
                >
                X
                </button>
            </div>
            <div className='mx-12'>
                <div className="flex gap-8 mb-4 justify-start">
                    <span className="w-[100px] h-[40px]">제목</span>
                    <div>
                    <input onChange={(e)=>setName(e.target.value)} value={name} className="h-[40px] w-[250px] border rounded-md px-2 outline-none"></input>
                    </div>
                </div>
                <div className='flex gap-8 mb-4 justify-start'>
                    <span className='w-[100px] h-[40px]'>기본캘린더</span>
                    <select value={status} onChange={(e)=>setStatus(e.target.value)} className='h-[40px] w-[250px] border rounded-md px-2 outline-none'>
                    <option value={0}>속성 선택</option>
                    <option value={1}>설정</option>
                    <option value={2}>설정안함</option>
                    </select>
                </div>
                <div className='flex gap-8 mb-4 justify-start'>
                    <span className='w-[100px] h-[40px]'>캘린더색상</span>
                    <select value={color} onChange={(e) => setColor(e.target.value)} className='h-[40px] w-[250px] border rounded-md px-2 outline-none'>
                        {(!Array.isArray(usedColors) || usedColors.length === 0) ? (
                            colors.map(v => {
                                return <option key={v} value={v}>{v}</option>;
                            })
                        ) : isFiltering ? (
                            filteredColors.length === 0 ? (
                                <option>색상 없음</option>
                            ) : (
                                filteredColors.map(c => {
                                    return <option key={c} value={c}>{c}</option>;
                                })
                            )
                        ) : (
                            <option>로딩중...</option>
                        )}
                    </select>
                </div>
                <div className='flex gap-8 mb-4 justify-start'>
                    <span className='w-[100px] h-[40px]'>공유인원</span>
                    <button onClick={()=>setOpenAddress(true)} className='border w-[100px] h-[40px] rounded-lg'>주소록</button>
                </div>
                <div className="flex gap-8 mb-4 justify-start max-h-[200px] overflow-scroll scrollbar-none">
                    <span className="w-[100px] h-[40px] sticky top-0">참여자목록</span>
                    <div>
                        <ul>
                            {
                                (isLoadingSelectedUsers)
                                ?
                                (
                                    <li>로딩중...</li>
                                )
                                :
                                (isErrorSelectedUsers)
                                ?
                                (
                                    <li>로딩에 실패했습니다...</li>
                                )
                                :
                                (!(Array.isArray(selectedUsers))&&selectedUsers.length==0)
                                ?
                                (
                                    <li>참여인원이 없습니다...</li>
                                )
                                :
                                (
                                    selectedUsers.map((v)=>{
                                    return (
                                    <li key={v.id} className='cursor-pointer hover:bg-purple-200'>
                                        <div className='flex justify-between px-[10px]'>
                                            <div className='flex'>
                                                <img src='/images/admin-profile.png' className='w-[50px] h-[50px] mr-[10px]'></img>
                                                <div className='flex flex-col'>
                                                    <div className='flex w-[200px]'>
                                                        <div className='mr-[10px]'>{v.name}</div>
                                                        <div className='text-gray-400'>{v.level}</div>
                                                    </div>
                                                    <div className='w-[150px] mr-[30px] text-gray-400 text-[12px]'>{v.email}</div>
                                                </div>
                                                <div className='flex items-center w-[200px]'>
                                                    {v.group}
                                                </div>
                                            </div>
                                            <div className='flex items-center'>
                                                <button onClick={(e)=>{cancleSelectedUsersHandler(e,v)}} className='text-[20px] text-gray-400 font-bold'>X</button>
                                            </div>
                                        </div>
                                    </li>
                                    )})
                                )
                            }
                        </ul>
                    </div>
                </div>
                <div className='flex py-8 justify-end gap-4 items-center'>
                    <button onClick={putCalendarHandler} className='bg-purple w-[110px] hover:opacity-80 py-4 text-sm rounded-md white'>수정하기</button>
                    <button 
                    className="bg-purple w-[110px] py-4 text-sm rounded-md white hover:opacity-60 cursor-pointer"
                    onClick={deleteCalendarHandler}
                    >
                    삭제
                    </button>
                </div>
            </div>
            <GetAddressModal 
                isOpen={openAddress}
                onClose={()=>setOpenAddress(false)}
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
                cancleSelectedUsersHandler={cancleSelectedUsersHandler}
            />
        </div>
        
    </div>
  )
}
