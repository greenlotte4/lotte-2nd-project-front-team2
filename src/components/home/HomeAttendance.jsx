import { useEffect, useState } from "react";
import axiosInstance from '@/services/axios.jsx'
import { useQuery } from "@tanstack/react-query";
import useUserStore from '../../store/useUserStore';
import CustomAlert from "../Alert";

const HomeAttendance = () => {

    const [checkIn, setCheckIn] = useState('')
    const user = useUserStore((state)=> state.user);

    const [alert, setAlert] = useState({message : '', type: '', isOpen: false, onClose: false})
    const closeAlert = () =>{
    setAlert({ message: '', type: '', isOpen: false, onClose: false });
    }
    

    const [currentDateTime, setCurrentDateTime] = useState({ date: '', time: '', weekday: '' });
    const updateDateTime = () => {
    const now = new Date();

    // 날짜 포맷팅 (예: 2024-12-16 월요일)
    const formattedDate = new Intl.DateTimeFormat('ja-JP', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(now);

    const weekday = new Intl.DateTimeFormat('ko-KR', {
        weekday: 'short',
    }).format(now);

    // 시간 포맷팅 (예: 16:22:22)
    const formattedTime = [
        now.getHours().toString().padStart(2, '0'),
        now.getMinutes().toString().padStart(2, '0'),
        now.getSeconds().toString().padStart(2, '0'),
    ].join(':');

    setCurrentDateTime({
        date: formattedDate,
        time: formattedTime,
        weekday: weekday,
    });
    };

    useEffect(() => {
    const timer = setInterval(updateDateTime, 1000);
    updateDateTime(); // 초기값 설정
    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
    }, []);


    const todayAttendanceAPI = async () => {
    const resp = await axiosInstance.get('/api/attendance/today');
    console.log("오늘 근태 "+JSON.stringify(resp.data))
    return resp.data;
    }

    const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [`attendance-${user.uid}`],
    queryFn: todayAttendanceAPI,
    enabled: Boolean(user?.uid),
    });

    
      const goToWorkHandler = async (e) => {
        e.preventDefault();
        if(confirm("출근하시겠습니까?")){
          try{
            const resp = await axiosInstance.post('/api/attendance/checkIn', null);
            if (!resp || !resp.data) {
                throw new Error("API 응답 데이터가 없습니다.");
            }

            // 알림 먼저 설정
            setAlert({
                message: `${resp.data} \n 출근이 완료되었습니다.`,
                type: 'success',
                isOpen: true,
                onClose: false,
            });

            await refetch();
          }catch(err){
            console.log("에러 "+JSON.stringify(err.response.data))
            setAlert({message: `${err.response.data}`,type: 'warning',isOpen: true,onClose: false,})
          }
        }else{
          return;
        }
      }
      const leaveWorkHandler = async (e) => {
        e.preventDefault();
        if (confirm("퇴근하시겠습니까?")) {
            try {
                const resp = await axiosInstance.post('/api/attendance/checkOut', null);
                if (!resp || !resp.data) {
                    throw new Error("API 응답 데이터가 없습니다.");
                }
    
                // 알림 먼저 설정
                setAlert({
                    message: `${resp.data} \n 퇴근완료! `,
                    type: 'success',
                    isOpen: true,
                    onClose: false,
                });
    
                await refetch();
            } catch (err) {
                console.log("에러 발생: ", err.response?.data || err.message || err);
                setAlert({
                    message: err.response?.data || "알 수 없는 오류가 발생했습니다.",
                    type: 'warning',
                    isOpen: true,
                    onClose: false,
                });
            }
        }
      };

    return (
        <>
            <div>
                <div className='clock flex flex-col items-center h-[80px]'>
                    <span className='font-light'>{`${currentDateTime.date} (${currentDateTime.weekday})`}</span>
                    {/* <span className='text-xs font-extralight'>현재시각 (UTC/GMT +09:00) Asia/Seoul</span> */}
                    <p className='relative bottom-5'>{currentDateTime.time}</p> 
                </div>
                <div className='commute-inbox flex justify-center'>
                    {isLoading  ? (
                        <p>로딩 중...</p>
                    ) : isError ? (
                        <p>데이터를 불러오는 데 실패했습니다.</p>
                    ) : (
                        <>
                    <div className='commute-check flex items-center mr-10'>
                        <div className='checktime flex flex-col'>
                        <span className='text-lg w-full h-full text-center flex items-center justify-center text-gray-600'>
                            출근시간</span>
                        <span className='text-2xl w-full h-full text-center text-gray-600 font-extralight'>
                        {data?.checkInTime||'-'}
                        {/* {checkIn} */}
                        </span>
                        </div>
                        <img src='/images/arrowRight.png' alt='allow' className='commute-allow'></img>
                        <div className='checktime flex flex-col'>
                        <span className='text-lg w-full h-full text-center flex items-center justify-center text-gray-600'>
                            퇴근시간</span>
                        <span className='text-2xl w-full h-full text-center text-gray-600 font-extralight'>
                        {data?.checkOutTime||'-'}</span>
                        </div>
                    </div>
                    <div className='flex flex-col justify-between w-[200px]'>
                        <button onClick={goToWorkHandler} className='btn-commute bg-indigo-500 text-white'>출근하기</button>
                        <button onClick={leaveWorkHandler} className='btn-commute border border-gray-300 text-gray-500 mt-10'>퇴근하기</button>
                    </div>
                    </>
                    )}
                </div>
            </div>
            <CustomAlert
                type={alert.type}
                message={alert.message}
                isOpen={alert.isOpen}
                onClose={closeAlert}
            />
        </>
    )
}
export default HomeAttendance;