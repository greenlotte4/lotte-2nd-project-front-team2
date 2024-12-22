import React, { useEffect, useRef, useState } from 'react'
import '@/pages/home/Home.scss'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/services/axios.jsx'
import { useQuery } from '@tanstack/react-query';
import useUserStore from '../../store/useUserStore';
import HomeCalendar from '../../components/home/HomeCalendar';
import HomeAttendance from '../../components/home/HomeAttendance';
import HomeSchedule from '../../components/home/HomeSchedule';
import HomeProject from '../../components/home/HomeProject';
import HomeNotice from '../../components/home/HomeNotice';
import HomePage from '../../components/home/HomePage';

const profileURL = 'http://3.35.170.26:90/profileImg/';

export default function Home() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true); // 페이지 활성화 상태 관리
  const user = useUserStore((state)=> state.user);
  const role = user.role;

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


    return (
      <div id='home-container'>
        <section className='admin-index-top'>
          <article className='home-top-left border'>
            <h2 className='text-2xl'>Project</h2>
            <HomeProject/>
          </article>
          <article className='home-top-right'>
            <div className='home-my flex border'>
              <div className='my-left flex flex-col justify-between'>
                <div>
                  <p className='gray'>WELCOME {userData?.name||''}</p>
                  <p style={{fontSize:'20px'}}>근무 중</p>
                </div>
                <span>{userData?.profileMessage||''}</span>
                <div className='grid grid-cols-2 gap-3 w-full '>
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
              <HomeAttendance/>
            </div>
          </article>
        </section>
        <section className='home-index-bot'>
          <div className='home-bot2 border' >
            {role === 'USER' ? (
              <HomePage/>
            ) : (
              <HomeNotice/>
            )}
          </div>
          <div className='home-bot border'>
            <HomeSchedule/>
          </div>
          <div className='home-bot border'>
            <HomeCalendar/>
          </div>
        </section>
      </div>
    );
}