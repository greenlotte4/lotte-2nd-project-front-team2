import React, { useEffect, useRef, useState } from 'react'
import { useCalenderNameStore } from '../../store/zustand';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/services/axios.jsx'
import PostScheduleModal from './PostScheduleModal';
import DeleteScheduleConfirm from './DeleteScheduleConfirm';
import CustomAlert from '../Alert';

export default function ClickDateModal({confirm,onclose,clickedDate}) {
    const queryClient = useQueryClient();
    const calendarNames = queryClient.getQueryData(['calendar-name'])
    const [today, setToday] = useState();
    const [calendarNameState, setCalendarNameState] = useState([])
    const [modal,setModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [customAlert, setCustomAlert] = useState(false);
    const [customAlertType, setCustomAlertType] = useState("");
    const [customAlertMessage, setCustomAlertMessage] = useState("");
    useEffect(() => {
        if (clickedDate) {
            setToday(clickedDate);
        }
    }, [clickedDate]);

    useEffect(()=>{
        if(calendarNames){
            setCalendarNameState(calendarNames)
        }
    },[calendarNames])

    const {data : tasksData , isLoading : isLoadingTasksData }
        = useQuery({
        queryKey : ['calendar-content-morning',clickedDate],
        queryFn : async () => {
            const response = await axiosInstance.get(`/api/calendar/content/name/morning?today=${clickedDate}`)
            return response.data
        },
        retry : false,
        refetchOnWindowFocus: false,
        enabled : !!clickedDate
    })

    const {data : tasksData2 , isLoading : isLoadingTasksData2 }
        = useQuery({
        queryKey : ['calendar-content-afternoon',clickedDate],
        queryFn : async () => {
            const response = await axiosInstance.get(`/api/calendar/content/name/afternoon?today=${clickedDate}`)
            return response.data
        },
        retry : false,
        refetchOnWindowFocus: false,
        enabled : !!clickedDate
    })

    const mutation = useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.delete(`/api/calendar/content?id=${deleteId}`, {

            });
            return response.data;
        },
        onSuccess: (data) => {
            setCustomAlert(true)
            setCustomAlertType("success")
            setCustomAlertMessage(data.message)
            queryClient.invalidateQueries(['calendar-content-morning',today])
            queryClient.invalidateQueries(['calendar-content-afternoon',today])
            queryClient.setQueryData(['calendar-date'], (prevData) => {
                return prevData.filter((v) => v.id !== data.id);
            });
            setTimeout(()=>{
                setCustomAlert(false);
            },1000)
            setDeleteConfirm(false);
        },
        onError: (error) => {
            setCustomAlert(false)
            setCustomAlertType("error")
            setCustomAlertMessage(error)
            setTimeout(()=>{
                setCustomAlert(false);
            },1000)
            setDeleteConfirm(false);
        },
    });

    const deleteCalendar = async () => {
        try {
            await mutation.mutateAsync();
        } catch (error) {
            console.error("Error in mutation", error);
        }
    };

    useEffect(() => {
        setCalendarNameState(calendarNames)
    }, []);

    if(!confirm) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-custom-fixed">
            <div className="bg-white z-40 rounded-2xl shadow-lg w-[1000px] modal-custom-width max-h-[900px] overflow-scroll scrollbar-none px-[30px]">
                <>
                    <div className="flex justify-between py-5 border-b rounded-t-2xl z-10 mb-[20px]">
                        <div className='flex flex-col gap-[10px] justify-center'>
                            <span className="text-[22px] font-bold">일일 플래너</span>
                            <span>{clickedDate}</span>
                        </div>
                        <button
                            className="text-[18px] display-block font-bold text-gray-600 hover:text-red-500"
                            onClick={onclose}
                        >
                            X</button>
                    </div>
                    <div className='mb-[20px]'>
                        <span className='pl-[30px] font-[10px]'>오전 06 : 00 ~ 오후 12 : 00</span>
                    </div>
                    <div className='border-t'></div>
                    <div className='flex border-b mb-[20px] border-l'>
                        <div className='w-1/2 p-[10px] pl-[20px]'>
                            <div className='mb-[20px] opacity-70 text-[18px]'>캘린더</div>
                            {
                                (!Array.isArray(calendarNameState) || calendarNameState.length === 0)
                                    ? (
                                        <ul>
                                            등록된 캘린더가 없습니다.
                                        </ul>
                                    )
                                    : (
                                        <ul>
                                            {calendarNameState.map(v=>{
                                                return (
                                                    <li key={v.id} className={`mb-[10px] flex items-center gap-[10px]`}>
                                                        <div className={`bg-${v.color}-200 w-[20px] h-[20px]`}></div>
                                                        <div className='text-[15px] opacity-80'>{v.name}</div>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    )
                            }
                        </div>
                        <div className='w-1/2 p-[10px] border-l min-h-[250px] border-r'>
                            <div className='mb-[20px] opacity-70 text-[18px]'>등록된 일정</div>
                            {
                                (isLoadingTasksData)
                                    ? (
                                        <ul>로딩중...</ul>
                                    ) :
                                    (!Array.isArray(tasksData) || tasksData.length === 0)
                                        ?
                                        (
                                            <ul>등록된 일정이 없습니다...</ul>
                                        ) :
                                        (
                                            <ul>
                                                {tasksData.map(v=>{
                                                    return (
                                                        <li onClick={()=>{setDeleteConfirm(true);setDeleteId(v.id)}} key={v.id} className={`mb-[10px] flex items-center gap-[10px] cursor-pointer`}>
                                                            <div className={`bg-${v.color}-200 w-[20px] h-[20px]`}></div>
                                                            <div className='text-[15px]'>{v.stime}</div>
                                                            <div className='text-[15px] opacity-80'>{v.name}</div>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        )
                            }
                        </div>
                    </div>
                    <div className='mb-[20px]'>
                        <span className='ml-[30px] font-[10px]'>오후 12 : 00 ~ 오후 06 : 00</span>
                    </div>
                    <div className='border-t'></div>
                    <div className='flex border-b mb-[30px] border-l'>
                        <div className='w-1/2 p-[10px] pl-[20px]'>
                            <div className='mb-[20px] opacity-70 text-[18px]'>캘린더</div>
                            {
                                (!Array.isArray(calendarNameState) || calendarNameState.length === 0)
                                    ? (
                                        <ul>
                                            등록된 캘린더가 없습니다.
                                        </ul>
                                    )
                                    : (
                                        <ul>
                                            {calendarNameState.map(v=>{
                                                return (
                                                    <li key={v.id} className={`mb-[10px] flex items-center gap-[10px]`}>
                                                        <div className={`bg-${v.color}-200 w-[20px] h-[20px]`}></div>
                                                        <div className='text-[15px] opacity-80'>{v.name}</div>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    )
                            }
                        </div>
                        <div className='w-1/2 p-[10px] border-l min-h-[250px] border-r'>
                            <div className='mb-[20px] opacity-70 text-[18px]'>등록된 일정</div>
                            {
                                (isLoadingTasksData2)
                                    ? (
                                        <ul>로딩중...</ul>
                                    ) :
                                    (!Array.isArray(tasksData2) || tasksData2.length === 0)
                                        ?
                                        (
                                            <ul>등록된 일정이 없습니다...</ul>
                                        ) :
                                        (
                                            <ul>
                                                {tasksData2.map(v=>{
                                                    return (
                                                        <li onClick={()=>{setDeleteConfirm(true); setDeleteId(v.id);}} key={v.id} className={`mb-[10px] flex items-center gap-[10px] cursor-pointer`}>
                                                            <div className={`bg-${v.color}-200 w-[20px] h-[20px]`}></div>
                                                            <div className='text-[15px]'>{v.stime}</div>
                                                            <div className='text-[15px] opacity-80'>{v.name}</div>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        )
                            }
                        </div>
                    </div>
                    <div className='mb-[30px] flex justify-end'>
                        <button onClick={()=>setModal(true)} className='rounded-lg bg-purple white w-[120px] h-[40px] hover:opacity-80'>새일정추가</button>
                    </div>
                    <PostScheduleModal
                        isOpen={modal}
                        onClose={()=>setModal(false)}
                        text="일정 등록"
                        today={today}
                        setToday={setToday}
                    />
                    <DeleteScheduleConfirm
                        onClose={()=>setDeleteConfirm(false)}
                        isOpen={deleteConfirm}
                        deleteCalendar={deleteCalendar}
                    />
                    <CustomAlert
                        type={customAlertType} message={customAlertMessage} isOpen={customAlert}
                    />
                </>
            </div>
        </div>
    )
}
