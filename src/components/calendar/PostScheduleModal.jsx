import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import axiosInstance from '@/services/axios.jsx'
import CustomAlert from '../Alert';
import useWebSocket from '../../util/useWebSocket';

export default function PostScheduleModal({ isOpen, onClose, children , text,oldData ,today ,setToday }) {

    const [title,setTitle] = useState("");
    const [sdate,setSdate] = useState('');
    const [edate, setEdate] = useState('');
    const [calendarId,setCalendarId] = useState(0);
    const [location, setLocation] = useState("");
    const [importance, setImportance] = useState(1);
    const [alert,setAlert] = useState(1);
    const [memo, setMemo] = useState("");
    const [customAlert, setCustomAlert] = useState(false);
    const [customAlertType, setCustomAlertType] = useState("");
    const [customAlertMessage, setCustomAlertMessage] = useState("");
    const queryClient = useQueryClient();
    const calendarName = queryClient.getQueryData(['calendar-name']);
    const { sendWebSocketMessage } = useWebSocket({});
    useEffect(() => {
      if (today) {
        // sdate는 today를 기준으로 설정
        setSdate(new Date(today).toLocaleString('sv-SE'));
  
        // edate는 today에 1시간을 더한 시간으로 설정
        const dateWithAddedHour = new Date(today);
        dateWithAddedHour.setHours(dateWithAddedHour.getHours() + 1);
        setEdate(dateWithAddedHour.toLocaleString('sv-SE'));
      }
    }, [today]);

    useEffect(()=>{
      if(oldData){
        setTitle(oldData.title)
        setSdate(oldData.startDate)
        setEdate(oldData.endDate)
        setCalendarId(oldData.contentId)
      }
    },[oldData])

    const mutation = useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.post('/api/calendar/content', {
                title,
                sdate,
                edate,
                calendarId,
                location,
                importance,
                alert,
                memo,
            });
            return response.data;
        },
        onSuccess: (data) => {
          setCustomAlert(true)
          setCustomAlertType("success")
          setCustomAlertMessage(data.message)
          
          const messagedata = {
            calendarId,
          }
          sendWebSocketMessage(messagedata, '/app/calendar/contents/post');
          setTimeout(() => {
            setCustomAlert(false);
            onClose();  
          }, 1000);
          
        },
        onError: (error) => {
            console.error("Error updating user", error);
        },
    });
    
    const postCalendar = async () => {
        try {
            await mutation.mutateAsync(); 
        } catch (error) {
            console.error("Error in mutation", error);
        }
    };
    if(!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-custom-fixed">
      <CustomAlert 
        type={customAlertType} message={customAlertMessage} isOpen={customAlert}
      />
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-[800px] modal-custom-width max-h-[800px] overflow-scroll scrollbar-none">
        <div className="display-flex mb-8 py-3.5 px-12 bg-white border-b rounded-t-2xl z-10 sticky top-0">
            <span className="text-xl font-bold">{text}</span>
            <button 
            onClick={onClose}
            className="text-xl float-right display-block font-bold text-gray-600 hover:text-gray-900"
            >
            X
            </button>
        </div>
        <div className="mx-12">
        <div className="flex gap-8 mb-4 justify-start">
              <span className="w-20 h-[40px]">제목</span>
              <div>
                <input onChange={(e)=>setTitle(e.target.value)} value={title} className="h-[40px] w-[250px] border rounded-md px-2"></input>
              </div>
            </div>
            <div className="flex gap-8 justify-start mb-4">
              <span className="w-20 h-[40px]">날짜/시간</span>
              <div className="flex gap-3 items-center">
                <input value={sdate} onChange={(e)=>setSdate(new Date(e.target.value).toLocaleString('sv-SE'))} className='h-[40px] w-[118px]' type="datetime-local"></input> ~ <input value={edate} onChange={(e)=>setEdate(new Date(e.target.value).toLocaleString('sv-SE'))} className='h-[40px] w-[118px]' type="datetime-local"></input>
              </div>
            </div>
            <div className="flex gap-8 mb-4 justify-start">
              <span className="w-20 h-[40px]">켈린더</span>
              <div>
                <select value={calendarId} onChange={(e)=>setCalendarId(e.target.value)} className="h-[40px] w-[120px] outline-none border rounded-md text-center">
                  <option>달력선택</option>
                  {calendarName && calendarName.map(v => {
                    return (
                      <option key={v.id} value={v.id}>{v.name}</option>

                    )
                  })}
                </select>
              </div>
            </div>
            <div className="flex gap-8 mb-4 justify-start">
              <span className="w-20 h-[40px]">장소</span>
              <div>
                <input value={location} onChange={(e)=>setLocation(e.target.value)} className="h-[40px] w-[200px] border rounded-md px-2"></input>
              </div>
            </div>
            <div className="flex gap-8 mb-4 justify-start">
              <span className="w-20 h-[40px]">중요도</span>
              <div>
                <select value={importance} onChange={(e)=> setImportance(e.target.value)} className="h-[40px] text-center w-[100px] outline-none border rounded-md">
                  <option value={1}>낮음</option>
                  <option value={2}>보통</option>
                  <option value={3}>높음</option>
                </select>
              </div>
            </div>
            <div className="flex gap-8 mb-4 justify-start">
              <span className="w-20 h-[40px]">알림</span>
              <div>
                <select value={alert} onChange={(e)=>setAlert(e.target.value)} className="h-[40px] text-center w-[100px] outline-none border rounded-md">
                  <option value={1}>낮음</option>
                  <option value={2}>보통</option>
                  <option value={3}>높음</option>
                </select>
              </div>
            </div>
            <div className="flex gap-8 mb-8 justify-start">
              <span className="w-20 h-[30px]">메모</span>
              <div>
                <textarea value={memo} onChange={(e)=>setMemo(e.target.value)} className="h-[120px] w-[380px] border rounded-md resize-none px-2"></textarea>
              </div>
            </div>
            <div className="flex justify-end mb-12">
              {text === '일정 등록' &&
                <button onClick={postCalendar} className="bg-purple px-6 py-4 text-xs rounded-md white">등록하기</button>
              }
              {text === '일정 수정' &&
                <button className='bg-purple px-6 py-4 text-sm rounded-md white'>수정하기</button>
              }
            </div>
        </div>
        </div>
    </div>
  )
}


