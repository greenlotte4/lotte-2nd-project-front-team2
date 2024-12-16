import React, { useEffect, useRef, useState } from 'react'
import '@/pages/home/Home.scss'
import adminProfile from '@/assets/admin-profile.png'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore';
import axiosInstance from '@/services/axios.jsx'
import CustomAlert from '../../components/Alert';
import { useQuery } from '@tanstack/react-query';
import useUserStore from '../../store/useUserStore';

const profileURL = 'http://3.35.170.26:90/profileImg/';

export default function Home() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(80);
  const [isActive, setIsActive] = useState(true); // 페이지 활성화 상태 관리
  const user = useUserStore((state)=> state.user);

  // const timeRef = useRef(null); // 시간 DOM 참조
  // const dateRef = useRef(null); // 시간 DOM 참조
  // const currentDate = new Date();
  // const formattedDate = new Intl.DateTimeFormat('ko-KR', {
  //   timeZone: 'Asia/Seoul',
  //   year: 'numeric',
  //   month: '2-digit',
  //   day: '2-digit',
  //   weekday: 'short'
  // }).format(currentDate);

  // const dateParts = formattedDate.split('.');
  // const finalDate = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
  // const weekday = dateParts[3].trim(); 

  const decodeAccessToken = useAuthStore((state)=>state.decodeAccessToken);
  const getAccessToken = useAuthStore((state)=>state.getAccessToken);
  
  const [alert, setAlert] = useState({message : '', type: '', isOpen: false, onClose: false})
  const closeAlert = () =>{
    setAlert({ message: '', type: '', isOpen: false, onClose: false });
  }

  const todayAttendanceAPI = async () => {
    const resp = await axiosInstance.get('/api/attendance/today');
    console.log("오늘 근태 "+JSON.stringify(resp.data))
    return resp.data;
  }

  const [currentDateTime, setCurrentDateTime] = useState({ date: '', time: '' });

  const updateDateTime = () => {
    const now = new Date();

    // 날짜 포맷팅 (예: 2024-12-16 월요일)
    const formattedDate = new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
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
    });
  };

  useEffect(() => {
    const timer = setInterval(updateDateTime, 1000);
    updateDateTime(); // 초기값 설정
    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);
  
  const { data, error, isLoading, isError } = useQuery({
    queryKey: [`attendance-${user.uid}`],
    queryFn: todayAttendanceAPI,
    enabled: Boolean(user?.uid),
  });
  
  const getUserAPI = async () => {
    if (!user?.uid) {
      throw new Error("유저 정보가 없습니다.");
    }
    const resp = await axiosInstance.get('/api/my/user');
    console.log("유저 데이터 조회 "+JSON.stringify(resp.data));
    return resp.data;
  }

  const { data: userData, isError: userError, isLoading: userLoading } = useQuery({
    queryKey: [`user-${user.uid}`],
    queryFn: getUserAPI,
    enabled: Boolean(user?.uid),
  });


  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const goToWorkHandler = async (e) => {
    e.preventDefault();
    if(confirm("출근하시겠습니까?")){
      try{
        const resp = await axiosInstance.post('/api/attendance/checkIn', null);
        console.log("출근하기! "+resp.data)
        refetch();
        setAlert({message: `${resp.data} \n출근이 완료되었습니다.`,type: 'success',isOpen: true, onClose: false,})
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
    if(confirm("퇴근하시겠습니까?")){
      try{
        const resp = await axiosInstance.post('/api/attendance/checkOut', null);
        console.log("퇴근하기! "+resp.data)
        refetch();
        setAlert({message: `${resp.data} \n 퇴근완료! `,type: 'success',isOpen: true, onClose: false,})
      }catch(err){
        console.log("에러 "+JSON.stringify(err.response.data))
        setAlert({message: `${err.response.data}`,type: 'warning',isOpen: true,onClose: false,})
      }
    }else{
      return;
    }
  }

    return (
      <div id='home-container'>
        <section className='admin-index-top'>
        <CustomAlert
              type={alert.type}
              message={alert.message}
              isOpen={alert.isOpen}
              onClose={closeAlert}
            />
          <article className='home-top-left border'>
            <h2 className='text-2xl'>Project</h2>
            <div className='w-full h-full flex justify-around'>
              <div className='home-project'>
                <span className='text-sm text-gray-400 font-extralight flex justify-end'>Nov.18.2024</span>
                <h2 className='text-xl'>프로젝트1</h2>
                <div className='mt-[20px]'>
                  <div className='project-inbox'>
                    <p className='project-title'>프로젝트 세부내역</p>
                    <p className='project-content'>상세설명</p>
                  </div>
                  <div className='project-inbox'>
                    <p className='project-title'>프로젝트 세부내역</p>
                    <p className='project-content'>상세설명</p>
                  </div>
                  <div className='project-inbox'>
                    <p className='project-title'>프로젝트 세부내역</p>
                    <p className='project-content'>상세설명</p>
                  </div>
                </div>
                <div className='flex justify-end text-sm text-gray-700 text-extralight'> 80%</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: `${progress}%`}}></div>
                </div>
              </div>
              <div className='home-project'>
                <span className='text-sm text-gray-400 font-extralight flex justify-end'>Nov.18.2024</span>
                <h2 className='text-xl'>프로젝트1</h2>
                <div className='mt-[20px]'>
                  <div className='project-inbox'>
                    <p className='project-title'>프로젝트 세부내역</p>
                    <p className='project-content'>상세설명</p>
                  </div>
                  <div className='project-inbox'>
                    <p className='project-title'>프로젝트 세부내역</p>
                    <p className='project-content'>상세설명</p>
                  </div>
                  <div className='project-inbox'>
                    <p className='project-title'>프로젝트 세부내역</p>
                    <p className='project-content'>상세설명</p>
                  </div>
                </div>
                <div className='flex justify-end text-sm text-gray-700 text-extralight'> 80%</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: `${progress}%`}}></div>
                </div>
              </div>
              <div className='home-project'>
                <span className='text-sm text-gray-400 font-extralight flex justify-end'>Nov.18.2024</span>
                <h2 className='text-xl'>프로젝트1</h2>
                <div className='mt-[20px]'>
                  <div className='project-inbox'>
                    <p className='project-title'>프로젝트 세부내역</p>
                    <p className='project-content'>상세설명</p>
                  </div>
                  <div className='project-inbox'>
                    <p className='project-title'>프로젝트 세부내역</p>
                    <p className='project-content'>상세설명</p>
                  </div>
                  <div className='project-inbox'>
                    <p className='project-title'>프로젝트 세부내역</p>
                    <p className='project-content'>상세설명</p>
                  </div>
                </div>
                <div className='flex justify-end text-sm text-gray-700 text-extralight'> 80%</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: `${progress}%`}}></div>
                </div>
              </div>
            </div>
          </article>
          <article className='home-top-right'>
            <div className='home-my flex border'>
              <div className='my-left flex flex-col justify-between'>
                <div>
                  <p className='gray'>welcome Yeonhwa Park</p>
                  <p style={{fontSize:'20px'}}>근무 중</p>
                </div>
                <span>{userData?.profileMessage||''}</span>
                <div className='grid grid-cols-2 gap-3 w-full '>
                  {/* <button onClick={(e) => {e.preventDefault(); navigate("/my/approval");}}
                    className='btn-home mr-2'
                    >결재현황
                    <img className='ml-2' src="/images/home-my-btn-arrow.png" alt="allow" />
                  </button> */}
                  <button onClick={(e) => {e.preventDefault(); navigate("/my/attendance");}} 
                    className='btn-home'
                    >출퇴근현황
                    <img className='ml-2' src="/images/home-my-btn-arrow.png" alt="allow" />
                  </button>
                  <button onClick={(e) => {e.preventDefault(); navigate("/my");}} 
                    className='btn-home'
                    >마이페이지
                    <img className='ml-2' src="/images/home-my-btn-arrow.png" alt="allow" />
                  </button>
                </div>
              </div>
              <div className='my-right'>
                <div className='w-[150px] h-[150px] bg-white drop-shadow-lg flex items-center justify-center overflow-hidden rounded-full'>
                  <img
                    className='w-full h-full object-cover flex items-center between-center'
                    src={userData?.profileImgPath ? `${profileURL}${userData.profileImgPath}` : '/images/default-profile.png'}
                    alt="profile-img" 
                  />
                </div>
              </div>
              
            </div>
            <div className='home-commute border'>
            <div className='flex flex-col items-center h-[80px]'>
              <span className='font-light'>{currentDateTime.date}</span> {/* 현재 날짜 */}
              {/* <span className='text-xs font-extralight'>현재시각 (UTC/GMT +09:00) Asia/Seoul</span> */}
              <p className='relative bottom-5'>{currentDateTime.time}</p> {/* 현재 시간 */}
            </div>
              <div className='commute-inbox flex justify-center'>
                {userLoading  ? (
                    <p>로딩 중...</p>
                ) : userError ? (
                    <p>데이터를 불러오는 데 실패했습니다.</p>
                ) : (
                <>
                <div className='commute-check flex items-center mr-10'>
                  <div className='checktime flex flex-col'>
                    <span className='text-lg w-full h-full text-center flex items-center justify-center text-gray-600'>
                      출근시간</span>
                    <span className='text-2xl w-full h-full text-center text-gray-600 font-extralight'>
                    {data?.checkInTime||'-'}</span>
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
          </article>
        </section>
        <section className='home-index-bot'>
          <div className='home-bot border'>
            <h2 className='text-2xl mb-10'>Notice</h2>
            <div className='border rounded-lg flex flex-col py-2 px-5 mt-1'>
              <div className='flex justify-between'>
                <p>이번 달 대체공휴일 공지</p>
                <span className='text-gray-400 font-extralight'>2024.11.18</span>
              </div>
              <p className='text-right'>전체공지</p>
            </div>
            <div className='border rounded-lg flex flex-col py-2 px-5 mt-1'>
              <div className='flex justify-between'>
                <p>이번 달 대체공휴일 공지</p>
                <span className='text-gray-400 font-extralight'>2024.11.18</span>
              </div>
              <p className='text-right'>전체공지</p>
            </div>
            <div className='border rounded-lg flex flex-col py-2 px-5 mt-1'>
              <div className='flex justify-between'>
                <p>이번 달 대체공휴일 공지</p>
                <span className='text-gray-400 font-extralight'>2024.11.18</span>
              </div>
              <p className='text-right'>전체공지</p>
            </div>
            <button className='btn-home float-right mt-[20px]'>전체보기<img className='ml-2' src="/images/home-my-btn-arrow.png" alt="allow" /></button>
          </div>
          <div className='home-bot border'>
            <h2 className='text-2xl mb-10'>Schedule</h2>
            <div>
              <p>오늘 <span>(2024.11.18)</span></p>
              <div className='mt-1 border rounded-lg py-1 px-3'>
                <p>일정 1 </p>
                <p className='schedule-content'>일정상세</p>
              </div>
              <div className='mt-1 border rounded-lg py-1 px-3'>
                <p>일정 1 </p>
                <p className='schedule-content'>일정상세</p>
              </div>
            </div>
            <div className='mt-2'>
              <p>다음 주</p>
              <div className='mt-1 border rounded-lg py-1 px-3'>
                <p>일정 1 </p>
                <p className='schedule-content'>일정상세</p>
              </div>
            </div>
          </div>
          <div className='home-bot border'>
            <h2 className='text-2xl'>Calendar</h2>
          </div>
        </section>
      </div>
    );
}