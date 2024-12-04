import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import axiosInstance from '@/services/axios.jsx'
import CustomAlert from '../Alert';
import useWebSocket from '../../util/useWebSocket';

export default function EventClickConfirm({isOpen, onclose,selectedId}) {
   
    const queryClient = useQueryClient();
    const prevData = queryClient.getQueryData(['calendar-date']);
    const calendarNames = queryClient.getQueryData(['calendar-name'])
    const [selectedData, setSelectedData] = useState();
    const [calendarId, setCalendarId] = useState();
    const [title,setTitle] = useState('');
    const [sdate,setSdate] = useState('');
    const [edate,setEdate] = useState('');
    const [location, setLocation] = useState("");
    const [importance, setImportance] = useState(1);
    const [alert,setAlert] = useState(1);
    const [memo, setMemo] = useState("");
    const [customAlert, setCustomAlert] = useState(false);
    const [customAlertType, setCustomAlertType] = useState("");
    const [customAlertMessage, setCustomAlertMessage] = useState("");
    const { sendWebSocketMessage } = useWebSocket({});
    const [prevId, setPrevId] = useState();

    useEffect(() => {
        if (selectedData && typeof selectedData === 'object') {
            setTitle(selectedData.title)
            setSdate(selectedData.start)
            setEdate(selectedData.end)
            setLocation(selectedData.location)
            setImportance(selectedData.importance)
            setAlert(selectedData.alert)
            setMemo(selectedData.memo)
            setCalendarId(selectedData.sheave)
            setPrevId(selectedData.sheave)
        }
    }, [selectedData]);
    
    useEffect(() => {
        if (selectedId && Array.isArray(prevData)) {
            const selectedItem = prevData.find(v => v.id == selectedId);  // 배열에서 첫 번째로 일치하는 아이템을 찾음
            if (selectedItem) {
                setSelectedData(selectedItem); // 객체 형태로 설정
            } else {
                setSelectedData(null); // 해당 ID가 없으면 null로 설정
            }
        }
    }, [selectedId, prevData]);

    const deleteMutation = useMutation({

        mutationFn : async () => {
            const response = await axiosInstance.delete(`/api/calendar/content?id=${selectedId}`, {

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
            sendWebSocketMessage(messagedata, '/app/calendar/contents/delete');
            setTimeout(()=>{
                setCustomAlert(false);
                onclose();
            },1000)
        },
        onError: (error) => {
            setCustomAlert(true)
            setCustomAlertType("error")
            setCustomAlertMessage(error)

            setTimeout(()=>{
                setCustomAlert(false);
                onclose();
            },1000)
        },
    })

    const deleteCalendar = async () => {
        try {
            await deleteMutation.mutateAsync();
        } catch (err){
            setCustomAlert(true)
            setCustomAlertType("error")
            setCustomAlertMessage("서버접속 실패!!")

            setTimeout(()=>{
                setCustomAlert(false)
            },1000)
        }
    }

    const putCalendarMutation = useMutation({
        mutationFn : async () => {
            const response = await axiosInstance.put("/api/calendar/content",{
                title,
                sdate,
                edate,
                calendarId : selectedId,
                sheave : calendarId,
                location,
                importance,
                alert,
                memo,
            })
            return response.data
        },
        onError: (err) => {
            setCustomAlert(true)
            setCustomAlertType("error")
            setCustomAlertMessage(err)
            
            setTimeout(()=>{
                setCustomAlert(false)
            },1000)
        },
        onSuccess: (data) => {
            setCustomAlert(true)
            setCustomAlertType("success")
            setCustomAlertMessage(data.message)
            const messagedata = {
                calendarId,
                prevId
            }
            sendWebSocketMessage(messagedata, '/app/calendar/contents/put2');
            setTimeout(()=>{
                setCustomAlert(false)
                onclose();
            },1000)
        }
    })

    const putCalendarHandler = async () =>{
        try {
            await putCalendarMutation.mutateAsync();
        } catch (err){
            setCustomAlert(true)
            setCustomAlertType("error")
            setCustomAlertMessage("서버접속 실패!!")

            setTimeout(()=>{
                setCustomAlert(false)
            },1000)
        }
    }

    if(!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-custom-fixed">
            <div className="bg-white z-40 rounded-2xl shadow-lg w-[800px] modal-custom-width max-h-[800px] overflow-scroll scrollbar-none">
                <div className="display-flex mb-8 py-3.5 px-12 bg-white border-b rounded-t-2xl z-10 sticky top-0">
                    <span className="text-xl font-bold">일정 상세보기</span>
                    <button
                        onClick={onclose}
                        className="text-xl float-right display-block font-bold text-gray-600 hover:text-gray-900"
                    >
                        X
                    </button>
                </div>
                <div className=" mx-12">
                    <div className="flex gap-8 mb-4 justify-start">
                        <span className="w-20 h-[40px]">제목</span>
                        <div>
                            <input onChange={(e)=>setTitle(e.target.value)} value={title} className="h-[40px] w-[250px] border rounded-md px-2"></input>
                        </div>
                    </div>
                    <div className="flex gap-8 justify-start mb-4">
                        <span className="w-20 h-[40px]">날짜/시간</span>
                        <div className="flex gap-3 items-center">
                            <input value={sdate} onChange={(e)=>setSdate(new Date(e.target.value).toLocaleString('sv-SE'))} className='h-[40px] w-[200px]' type="datetime-local"></input> ~ <input value={edate} onChange={(e)=>setEdate(new Date(e.target.value).toLocaleString('sv-SE'))} className='h-[40px] w-[200px]' type="datetime-local"></input>
                        </div>
                    </div>
                    <div className="flex gap-8 mb-4 justify-start">
                        <span className="w-20 h-[40px]">켈린더</span>
                        <div>
                            {
                                (!Array.isArray(calendarNames) || calendarNames.length === 0)
                                    ?
                                    (
                                        <ul>등록된 캘린더가 없습니다...</ul>
                                    ) :
                                    (
                                        <ul>
                                            <select value={calendarId} onChange={(e)=>setCalendarId(e.target.value)} className="h-[40px] w-[120px] outline-none border rounded-md text-center">
                                                <option value={0}>달력선택</option>
                                                {calendarNames.map(v=>{
                                                    return (
                                                        <option key={v.id} value={Number(v.id)}>{v.name}</option>

                                                    )
                                                })}
                                            </select>
                                        </ul>
                                    )
                            }

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

                </div>
                <div className='flex py-8 px-8 justify-end gap-4 items-center'>
                    <button onClick={putCalendarHandler} className='bg-purple w-[110px] hover:opacity-80 py-4 text-sm rounded-md white'>수정하기</button>
                    <button
                        className="bg-purple w-[110px] py-4 text-sm rounded-md white hover:opacity-60 cursor-pointer"
                        onClick={deleteCalendar}
                    >
                        삭제
                    </button>
                </div>
            </div>
            <CustomAlert
                type={customAlertType} message={customAlertMessage} isOpen={customAlert}
            />
        </div>
    )
}
