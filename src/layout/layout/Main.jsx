import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '@/layout/sidebar/Sidebar'
import "@/layout/layout/Main.scss"
import Footer from '../footer/Footer';
import MainIndex from '../../pages';
import _ from "lodash";
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '../../services/axios';


export default function Main() {
  const location = useLocation('');
  const [chat, setChat] = useState(false);
  const [alarm, setAlarm] = useState(false);
  const [cnt , setCnt] = useState(0);
  const [alarmId, setAlarmId] = useState(null);
  const [name, setName] = useState(null);

  const navi = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const fetchAllAlarm = async ({pageParam}) => {
    try {
        const response = await axiosInstance.get(`/api/alarm?page=${pageParam}`)
        console.log(response.data)
        return response.data
    } catch (err){
        return err
    }
  }

  const {
    data : alarmCnt,
    isLoading : isLoadingAlarmCnt,
    isError : isErrorAlarmCnt,
    refetch : refetchAlarmCnt
  } = useQuery({
    queryKey : ['alarm-cnt'],
    queryFn : async () => {
      try {
        const resp = await axiosInstance.get("/api/alarm/cnt")
        return resp.data
      } catch (err) {
        return err
      }
    },
    enabled : true
  })

  useEffect(()=>{
    if(!isLoadingAlarmCnt && !isErrorAlarmCnt){
      setCnt(alarmCnt)
    }
  },[alarmCnt])

  const {
    data: alarmData,
    isLoading: isLoadingAlarm,
    isError: isErrorAlarm,
    refetch : refetchAlarm,
    fetchNextPage : fetchNextPageAlarm,  // 다음 페이지를 가져오는 함수
    hasNextPage : hasNextPageAlarm,    // 다음 페이지가 있는지 확인하는 값
    isFetchingNextPage : isFetchingNextPageAlarm,  // 다음 페이지를 fetching 중인지 확인하는 값
  } = useInfiniteQuery({
    queryKey: ['alarm'],  // 쿼리 키는 그대로 유지
    queryFn: fetchAllAlarm,
    initialPageParam : 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNextPage) {
          return null;
      }
      if (lastPage.currentPage < lastPage.totalPages) {
          return lastPage.currentPage + 1;
      }
      return null;
    },
    select: (data) => {
        const alarmData = data.pages.flatMap((page) => page.alarms);
        return { ...data, pages: [{ ...data.pages[0], alarms: alarmData }] };
    },
    enabled: alarm,
  });

  const patchMutation = useMutation({
    mutationFn : async () => {
      try {
        const resp = await axiosInstance.patch(`/api/alarm/status?id=${alarmId}`)
        return resp.data
      } catch (err) {
        return err
      }
    },
    onSuccess : (data) => {
      refetchAlarm();
      refetchAlarmCnt();
      setAlarm(false);
    },
    onError : (err) => {

    },
  })

  useEffect(() => {
    if (alarmId !== null && !patchMutation.isLoading) {
      patchMutation.mutate(); // alarmId가 있을 때만 mutation 실행
    }
  }, [alarmId, patchMutation.isLoading]);

  const patchAndLink = async (e,type,id) => {
    if(type==1){
      navi("/calendar")
    }
    setAlarmId(id);
  }

  const observer = useRef();
  const lastAlarmRef = useCallback((node) => {
      if (isFetchingNextPageAlarm) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPageAlarm) {
        fetchNextPageAlarm(); 
      }
      });
      if (node) observer.current.observe(node);
  }, [isFetchingNextPageAlarm, hasNextPageAlarm, fetchNextPageAlarm]);

  const {
    data : userName,
    isLoading : isLoadingUserName,
    isError : isErrorUserName
  } = useQuery({
    queryKey : ['user-name'],
    queryFn : async () => {
      try {
        const resp = await axiosInstance.get("/api/user/name")
        console.log(resp.data)
        return resp.data
      } catch (err) {
        return err;
      }
    },
    enabled : true,
    retry : false,
  })
  
  useEffect(()=>{
    if(!isLoadingUserName && !isErrorUserName && userName != null){
      setName(userName)
    }
  },[userName,isLoadingUserName,isErrorUserName])

  return (
    <>
    {location.pathname !== "/user/login" && location.pathname !== "/" && (
      <>
      <header className=''>
      <div className='header h-[50px] w-[1920px] mx-auto  flex justify-between pt-[10px]'>
        <div className={`${isCollapsed ? 'collapsed' : 'expanded'} side-header`} >
          <div className='flex gap-[5px] cursor-pointer hover:opacity-80 ml-[20px]' onClick={()=>navi("/")}>
            <img src='/images/plantry_logo.png' className='w-[45px] h-[45px]'></img>
            <div className='flex items-center font-bold text-[24px] font-purple'>PLANTRY</div>
          </div>
        </div>
        <div className={`${isCollapsed ? 'collapsed' : 'expanded'} w-full side-content-header flex justify-end items-center px-[30px]`}>
          <div className='flex justify-end gap-[13px] items-center'>
            <div><img src='/images/dumy-profile.png' className='w-[45px] h-[45px]'></img></div>
            {name && 
              <div className='flex items-center text-[12px]'>
                {name}님 안녕하세요.
              </div>
            }
            
            <div>
              <img src='/images/header-alarm.png' className='w-[30px] h-[30px] opacity-60 cursor-pointer hover:opacity-40' onClick={()=>setAlarm(!alarm)}></img>
              {cnt != 0 &&
                <div className='bg-red-400 w-[15px] h-[15px] absolute top-[-3px] right-[30px] text-white flex items-center justify-center rounded-md text-[12px]'>{cnt}</div>
              }
              
            </div>
          </div>
        </div>
      </div>
      </header>
      <div className="main-layout">
        <div className="main-content">
          <Sidebar  isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}  />
          <div className={`content ${isCollapsed ? "sidebar-collapsed" : ""}`}>
              {alarm && 
              <div className='absolute top-[5px] right-[35px] z-[1000] border bg-white w-[200px] h-[250px] flex flex-col overflow-scroll scrollbar-none alarms'>
                {isLoadingAlarm ? (<p className='text-[12px]'>로딩중...</p>) : isErrorAlarm ? (<p className='text-[12px]'>에러...</p>) : Array.isArray(alarmData.pages[0].alarms)&&alarmData.pages[0].alarms.length>0 ? 
                  alarmData.pages[0].alarms.map((v)=>{return(
                    <div key={v.id} className='cursor-pointer hover:bg-gray-200 p-[10px] px-[20px]' onClick={(e)=>patchAndLink(e,v.type,v.id)}> 
                      <div className='flex justify-between'>
                        {v.type == 1 &&
                          <img src='/images/sidebar-schedule.png' className='w-[15px] h-[15px]'></img>
                        }
                        <div className='text-[12px]'>{v.createAt}</div>
                      </div>
                      <div className='text-[12px] font-bold'>{v.title}</div>
                      <div className='text-[12px] overflow-hidden max-h-[20px]'>{v.content}</div>
                    </div>
                  )}) : (<p>알림이 없습니다.</p>)
                }
                {hasNextPageAlarm && (
                <div ref={lastAlarmRef} className='text-center mt-4 overflow-scroll scrollbar-none'>
                    {isFetchingNextPageAlarm ? 'Loading more...' : 'Load more'}
                </div>
                  )}
                </div>
                }
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
        </>
      
    )}
    {(location.pathname === "/user/login" || location.pathname === "/") && (
      <>
        <Outlet />
        {location.pathname !== "/user/login" && <Footer />}
      </>
    )}
  </>
  )
}

