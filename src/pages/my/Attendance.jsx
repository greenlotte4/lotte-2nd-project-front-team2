import React from 'react'
import '@/pages/my/My.scss'
import MyAside from '../../components/my/MyAside'
import AttendanceChart from '../../components/my/AttendanceChart'
import axiosInstance from '@/services/axios.jsx'
import { useQuery } from '@tanstack/react-query';
import useUserStore from '../../store/useUserStore';

export default function MyAttendance() {

  const user = useUserStore((state)=> state.user);
  const todayAttendanceAPI = async () => {
    const resp = await axiosInstance.get('/api/attendance/today');
    console.log("오늘 근태 "+JSON.stringify(resp.data))
    return resp.data;
  }
  
  const { data, error, isLoading, isError } = useQuery({
    queryKey: [`${user.uid}`],  // 캐싱에 사용할 키
    queryFn: todayAttendanceAPI,  // 데이터를 가져오는 함수
    staleTime: 1000 * 60 * 5,  // 5분 동안 데이터가 신선하다고 간주
    cacheTime: 1000 * 60 * 60, // 10분 후에 캐시가 만료되도록 설정
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  
  return (
    <div id='my-attendance-container'>
      <MyAside/>
      <section className='my-attendance-main'>
        <article className='py-[30px] px-[50px] w-full'>
          <ul className='bg-indigo-50 flex rounded-xl h-[150px] mt-10'>
            <li className='flex flex-col border border-indigo-200 px-[20px] py-[10px] w-1/4 rounded-l-xl'>
              <h3 className='text-sm'>오늘</h3>
              <div className='w-full flex justify-around items-center mt-[15px]'>
                  <div className='checktime flex flex-col w-[80px]'>
                    <span className='text-md w-full h-full text-center'>출근</span>
                    <span className='text-lg w-full h-full text-center text-gray-600 font-light mt-2'>
                    {data.checkInTime}</span>
                  </div>
                  <img src='/images/arrowRight.png' alt='allow' className='icon-size-25'></img>
                  <div className='checktime flex flex-col w-[80px]'>
                    <span className='text-md w-full h-full text-center'>퇴근</span>
                    <span className='text-lg w-full h-full text-center text-gray-600 font-light mt-2'>
                    {data.checkOutTime}</span>
                  </div>
                </div>
            </li>
            <li className='flex flex-col border border-indigo-200 px-[20px] py-[10px] w-1/4'>
              <h3 className='text-sm'>연차일수</h3>
              <div className='w-full mt-[30px] flex justify-center items-end'>
                <span className=' text-3xl text-gray-700'>15</span>
                <span className='ml-2 text-sm'>일</span>
              </div>
            </li>
            <li className='flex flex-col border border-indigo-200 px-[20px] py-[10px] w-1/4'>
              <h3 className='text-sm'>초과근무</h3>
              <div className='w-full mt-[30px] flex justify-center items-end'>
                <span className=' text-3xl text-gray-700'>20</span>
                <span className='ml-2 text-sm'>시간</span>
              </div>
            </li>
            <li className='flex flex-col border border-indigo-200 px-[20px] py-[10px] w-1/4 rounded-r-xl'>
              <h3 className='text-sm'>출근누락</h3>
              <div className='w-full mt-[30px] flex justify-center items-end'>
                <span className=' text-3xl text-gray-700'>1</span>
                <span className='ml-2 text-sm'>회</span>
              </div>
            </li>
          </ul>
        </article>
        <article className='attend-arti py-[30px] px-[50px]'>
          <h2>출퇴근현황</h2>
          <div className='att-search mt-10 py-[10px] px-[30px]'>
            <h2 className='text-gray-500 ml-10'>Search Filters</h2>
            <div className='flex justify-between'>
              <div className='flex justify-between items-end w-[770px]'>
                <div className='border flex justify-between rounded-lg h-[40px] w-[250px]'>
                  <div className='flex justify-center items-center border-r w-2/5 font-light'>기간</div>
                  <select className='w-3/5 rounded-lg search-sel indent-4'>
                    <option value="" className='search-sel'>1주</option>
                    <option value="" className='search-sel'>2주</option>
                    <option value="" className='search-sel'>1개월</option>
                  </select>
                </div>
                <div className='flex items-center justify-between border rounded-lg pr-2 w-[500px]'>
                  <div className='flex'>
                    <input type="date" className="indent-2 font-light rounded-lg h-[40px] w-[200px]" />
                  </div>
                  -
                  <div className='flex'>
                    <input type="date" className="indent-2 font-light rounded-lg h-[40px] w-[200px]" />
                  </div>
                </div>
              </div>
              <div className='flex items-end'>
                <label className='flex items-center mr-[20px] text-sm'><input type="checkbox" className='mr-1'/>초과근무 포함</label>
                <button className='bg-indigo-500 flex justify-around items-center h-[40px] rounded-lg w-[120px] px-5 text-white'>
                  <span>검색</span>
                  <img className='' src="/images/white-my-btn-arrow.png" alt="allow" />
                </button>
              </div>
            </div>
          </div>
          <div className='att-graph mt-[20px] p-[10px]'>
            <AttendanceChart/>
          </div>
        </article>
      </section>
    </div>
  )
}
