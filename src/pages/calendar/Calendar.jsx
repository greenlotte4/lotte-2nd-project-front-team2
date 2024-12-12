import React, { useEffect, useRef, useState } from 'react'
import '@/pages/calendar/Calendar.scss'
import MyCalendar from '../../components/Calendar'
import {CustomSearch} from '@/components/Search.jsx'
import { Modal } from '../../components/Modal'
import PostScheduleModal from '../../components/calendar/PostScheduleModal'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/services/axios.jsx'
import { useCalenderNameStore } from '../../store/zustand'
import MainBigCalendar from '../../components/calendar/MainBigCalendar'
import CalendarContentNameResponse from '../../components/calendar/loading/CalendarContentNameResponse'
import PostCalendarModal from '../../components/calendar/PostCalendarModal'
import DeleteAndModifyCalendarModal from '../../components/calendar/DeleteAndModifyCalendarModal'
import { Client } from '@stomp/stompjs'
import useWebSocket from '../../util/useWebSocket'
import { useAuthStore } from '../../store/useAuthStore'

export default function Calendar() {

    const [calendarId, setCalendarId] = useState(0);
    const [openPostCalendar, setOpenPostCalendar] = useState(false);
    const [openDeleteAndModifyCalendar, setOpenDeleteAndModifyCalendar] = useState(false);
    const [selectedCalendarIds, setSelectedCalendarIds] = useState([]);
    const [selectedColor, setSelectedColor] = useState({});
    const [triger, setTriger] = useState(false);
    const [selectedCalendar, setSelectedCalendar] = useState({
        id : 0,
        color : "",
        myid : 0,
        name : "",
        status : 0,
        userIds : []
    });
    const changeCalendar = (e, id, color) => {
        const colorClass = `bg-${color}-200`;
        const isSelected = e.target.classList.contains(colorClass);
    
        if (isSelected) {
            e.target.classList.remove(colorClass); // 기존 색상 제거
            setSelectedCalendarIds((prev) => prev.filter((item) => item !== id)); // 선택 해제
        } else {
            e.target.classList.add(colorClass); // 색상 추가
            setSelectedCalendarIds((prev) => [...prev, id]); // 선택 추가
        }
    
        setCalendarId(id);
    };
    const { stompClient, isConnected, receiveMessage , updateCalendarIds , updateUserId } = useWebSocket({
    });

    useEffect(()=>{        
        
    },[receiveMessage.update])

    useEffect(()=>{
        if(Array.isArray(receiveMessage.update)&&receiveMessage.update.length>0){
            queryClient.invalidateQueries(['calendar-name'])
            queryClient.invalidateQueries(['calendar-date'])
            queryClient.refetchQueries(['calendar-name']);
            queryClient.refetchQueries(['calendar-date']);
        }

        if(receiveMessage.delete && (receiveMessage.delete != 0)){
            queryClient.invalidateQueries(['calendar-name'])
            queryClient.invalidateQueries(['calendar-date'])
        }
        if (receiveMessage.post) {
            queryClient.invalidateQueries(['calendar-name'])
            queryClient.invalidateQueries(['calendar-date'])
            queryClient.invalidateQueries(['initial-ids'])
        }
        if(receiveMessage.contentsPut){
            queryClient.invalidateQueries(['calendar-date'])
            queryClient.invalidateQueries(['calendar-content-name'])
        }
        if(receiveMessage.put2=='put2'){
            queryClient.invalidateQueries(['calendar-date'])
            queryClient.invalidateQueries(['calendar-content-name'])
        }
        if(receiveMessage.contentDelete=='delete'){
            queryClient.invalidateQueries(['calendar-date'])
            queryClient.invalidateQueries(['calendar-content-name'])
        }
        if(receiveMessage.contentPost=='post'){
            queryClient.invalidateQueries(['calendar-date'])
            queryClient.invalidateQueries(['calendar-content-name'])
        }

    },[receiveMessage])

    const queryClient = useQueryClient();

    const openModal = () => {
        setOpenPostCalendar(true)
    }

    const calendarNames = useCalenderNameStore((state) => state.setCalendarNames);

    const {data : calendarName, isLoading : isLoadingCalendarName, isError : isErrorCalendarName, refetch : refetchCalendarName} = useQuery({
        queryKey : ['calendar-name'],
        queryFn : async () => {
            try {
                const response = await axiosInstance.get('/api/calendar/name')
                return response.data
            } catch(err){
                return err
            }
        },
        enabled : true,
        staleTime: 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        cacheTime : 5*1000*60
    })

    const {data : calendarContentName , isLoading : isLoadingCalendarContentName, isError : isErrorCalendarContentName} = useQuery({
        queryKey : ['calendar-content-name'],
        queryFn : async () => {
            try {
                const response = await axiosInstance.get(`/api/calendar/content/name/today`)
                return response.data;
            } catch (err) {
                return err;
            }
        },
        retry : 1,
        enabled : true,
        cacheTime : 5*1000*60
    })



    useEffect(()=>{
        if(calendarName && calendarName.length>0){
            calendarNames(calendarName);
            refetchCalendarName();
        }
    },[calendarName,refetchCalendarName])



    const {data : calendarDate, isLoading : isLoadingCalendarDate, isError : isErrorCalendarDate} = useQuery({
        queryKey : ['calendar-date'],
        queryFn : async () => {
            try {
                const response = await axiosInstance.get(`/api/calendar`)
                return response.data
            } catch(err){
                return err
            }
        },
        enabled : true,
        refetchOnWindowFocus: false,
        staleTime: 0,
        retry: 1,
        cacheTime : 5 * 60 * 1000,
        select: (data) => {
            if (selectedCalendarIds && selectedCalendarIds.length > 0 ) {
                return data.filter((item) => selectedCalendarIds.includes(item.sheave));
            }
            return [];
        },
    });

    const {data : initialIds , isLoading : isLoadingInitialIds, isError : isErrorInitialIds , refetch : refetchInitialIds} =
        useQuery({
            queryKey: ['initial-ids'],
            queryFn : async () => {
                try {
                    const resp = await axiosInstance.get("/api/calendar/groups")
                    return resp.data
                } catch (err) {
                    return err
                }
            },
            enabled : true,
            cacheTime : 5*1000*60

        })

    useEffect(()=>{
        refetchInitialIds();
    },[])

    useEffect(()=>{
        if(!isLoadingInitialIds && !isErrorInitialIds && initialIds){
            updateCalendarIds(initialIds.calendarIds)
            updateUserId(initialIds.userId)
        }
    },[initialIds])

    if(isErrorInitialIds&&isLoadingInitialIds){
        return null;
    }

    return (
        <div id='calendar-container'>
            <aside className='calendar-aside overflow-scroll flex flex-col scrollbar-none border'>
                <section className='mb-[120px]'>

                </section>
                <section className='mb-16'>
                    <div className='flex gap-4 mb-6'>
                        <img src='/images/calendar-schedule.png' />
                        <p className='text-sm font-bold'>일정 목록</p>
                    </div>
                    {
                        (isLoadingCalendarContentName)
                            ?
                            (
                                <ul>로딩중입니다...</ul>
                            )
                            :
                            (isErrorCalendarContentName)
                                ?
                                (
                                    <ul>서버접속에 실패했습니다...</ul>
                                )
                                :
                                (!Array.isArray(calendarContentName) || calendarContentName.length === 0)
                                    ? (
                                        <ul className="ml-6 mt-6 text-sm font-bold">
                                            등록된 일정이 없습니다...
                                        </ul>
                                    )
                                    : (
                                        <CalendarContentNameResponse calendarContentName={calendarContentName} />
                                    )
                    }
                </section>
                <section className='mb-8'>
                    <div className='flex gap-4'>
                        <img src='/images/calendar-mine.png' />
                        <p className='text-sm font-bold'>내 캘린더</p>
                    </div>
                    <ul className='text-gray-500 ml-6 mt-6 text-sm font-bold'>
                        {
                            (isLoadingCalendarName)
                                ?
                                (
                                    <li>로딩중입니다...</li>
                                )
                                :
                                (isErrorCalendarName)
                                    ?
                                    (
                                        <li>
                                            서버 접속에 실패했습니다...
                                        </li>
                                    )
                                    :
                                    ((!Array.isArray(calendarName)) || calendarName.length===0)
                                        ?
                                        (
                                            <li>등록된 캘린더가 없습니다...</li>
                                        )
                                        :
                                        (
                                            calendarName.map((v,i) => {
                                                const isSelected = selectedColor[v.id];
                                                return (
                                                    <li key={i}  className=' flex justify-between mr-[20px]'>
                                                         <div
                                                            onClick={(e) => {
                                                                // 색상 토글을 직접 상태에서 관리
                                                                const newSelectedColor = { ...selectedColor, [v.id]: !isSelected };
                                                                setSelectedColor(newSelectedColor); // 상태 업데이트

                                                                changeCalendar(e, v.id, v.color);
                                                                setSelectedCalendar(v);
                                                            }}
                                                            data-status={v.status}
                                                            data-color={v.color}
                                                            className={`mb-2 cursor-pointer w-[150px] pl-[10px] hover:text-purple-700 rounded-lg 
                                                                ${isSelected ? `bg-${v.color}-200` : ''}`} // 선택된 상태에 따라 색상 추가
                                                        >
                                                            • {v.name}
                                                        </div>
                                                        <img onClick={(e)=>{setOpenDeleteAndModifyCalendar(true);setSelectedCalendar(v);}} className='w-[16px] h-[16px] opacity-60 cursor-pointer hover:opacity-100' src='/images/calendar-setting.png'></img>
                                                    </li>
                                                )
                                            }))
                        }
                        <div className="23"></div>
                    </ul>
                </section>
                <section className='mt-auto flex flex-col gap-5'>
                    <button onClick={openModal} className='bg-blue white px-8 py-2 text-xl rounded-lg flex justify-center items-center'>캘린더 등록</button>
                </section>
            </aside>
            <section className='calendar-main border'>
                <section className='big-calendar mt-8 overflow-scroll max-h-[700px] w-[1080px] mx-auto scrollbar-none'>
                    <MainBigCalendar
                        calendarDate={calendarDate}
                        isLoadingCalendarDate={isLoadingCalendarDate}
                        isErrorCalendarDate={isErrorCalendarDate}
                    />
                </section>
                <PostCalendarModal
                    isOpen={openPostCalendar}
                    onClose={()=>{setOpenPostCalendar(false)}}
                />
                <DeleteAndModifyCalendarModal
                    isOpen={openDeleteAndModifyCalendar}
                    onClose={()=>setOpenDeleteAndModifyCalendar(false)}
                    selectedCalendar={selectedCalendar}
                />
            </section>

        </div>
    )
}
