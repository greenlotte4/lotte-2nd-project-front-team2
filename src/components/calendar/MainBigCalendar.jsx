import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/services/axios.jsx'
import DateChangerModal from './DateChangerModal';
import CustomAlert from '../Alert';
import ClickDateModal from './ClickDateModal';
import EventClickConfirm from './EventClickConfirm';
import useWebSocket from '../../util/useWebSocket';

const MainBigCalendar = ({calendarDate,isLoadingCalendarDate,isErrorCalendarDate}) => {
    const [dateChanger, setDateChanger] = useState(false);
    const [oldData, setOldData] = useState({})
    const [putData, setPutData] = useState({});
    const [alert, setAlert] = useState(false);
    const [customAlert,setCustomAlert] = useState(false);
    const [customAlertType,setCustomAlertType] = useState("")
    const [customAlertMessage,setCustomAlertMessage] = useState("")
    const [clickDateModal, setClickDateModal] = useState(false);
    const [clickedDate, setClickedDate] = useState("");
    const [eventClickConfirm, setEventClickConfirm] = useState(false);
    const [selectedId, setSelectedId] = useState(0);
    const [selectedGroupId,setSelectedGroupId] = useState(0)
    const queryClient = useQueryClient();
    const { sendWebSocketMessage } = useWebSocket({});

    const dropEvent = (e) => {
        setOldData({
            title : e.event.title,
            contentId : e.event.id,
            startDate : new Date(e.event.start).toLocaleString('sv-SE'),
            endDate : new Date(e.event.end).toLocaleString('sv-SE')
        })
        setPutData({
            title: e.event.title,
            contentId: e.event.id,
            startDate : new Date(e.event.start).toLocaleString('sv-SE'),
            endDate : new Date(e.event.end).toLocaleString('sv-SE')
        });
    }

    useEffect(() => {
        if (putData && putData.contentId) { 
            mutation.mutateAsync();
            sendWebSocketMessage(putData, '/app/calendar/contents/put');
        }
    }, [putData]);

    const mutation = useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.put('/api/calendar/contents', putData, {
                
            });
            return response.data;
        },
        onSuccess: (data) => {
            setCustomAlert(true)
            setCustomAlertType("success")
            setCustomAlertMessage(data)
            
            setTimeout(() => {
                setCustomAlert(false);
            }, 500);
        },
        onError: (error) => {
            console.error("Error updating user", error);
        },
    });

    
    const closeDateChanger = () => {setDateChanger(false)}
    // 날짜 클릭 이벤트 처리
    const handleDateClick = (info) => {
        setClickedDate(info.dateStr)
        setClickDateModal(true)
    };

    const handleEventClick = (info) => {
        setEventClickConfirm(true)
        setSelectedId(info.event.id)
        setSelectedGroupId(info.event.gId)
        console.log(info.event)
    };
        if(isLoadingCalendarDate){
        return <p>로딩중입니다...</p>
    }

    if(isErrorCalendarDate){
        return <p>{calendarDate}</p>
    }
  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin,timeGridPlugin]}
        events={calendarDate}
        selectable={true}
        editable={true}
        dragging={true}
        aspectRatio={3}
        expandRows={true}
        dayMaxEvents={3}
        contentHeight="auto"
        timezone="local"
        buttonText={{
            prev: '이전',
            next: '다음',
            today: '오늘',
            dayGridMonth: '월간달력',
            dayGridWeek: '주간달력',
        }}
        
        eventDisplay='block'
        headerToolbar= {{
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
        }}
        dateClick={handleDateClick}  
        eventClick={handleEventClick}
        datesSet={(dateInfo) => {
            const dayCells = document.querySelectorAll('.fc-daygrid-day');
            dayCells.forEach((cell) => {
              cell.style.height = '100px';  
              cell.style.minHeight = '100px';
              cell.style.maxHeight = '100px';
            });
        }}
        eventDrop={dropEvent}
      />
      <CustomAlert 
        type={customAlertType}
        message={customAlertMessage}
        isOpen={customAlert}
      />
      <ClickDateModal 
        onclose={()=>setClickDateModal(false)}
        confirm={clickDateModal}
        clickedDate = {clickedDate}
      />
      <EventClickConfirm 
        clickedDate={clickedDate}
        onclose={()=>setEventClickConfirm(false)}
        isOpen={eventClickConfirm}
        selectedId={selectedId}
        selectedGroupId={selectedGroupId}
      />
      </>
  );
};

export default MainBigCalendar;
