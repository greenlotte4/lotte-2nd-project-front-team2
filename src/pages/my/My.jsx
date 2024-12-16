import React, { useEffect, useRef, useState } from 'react'
import '@/pages/my/My.scss'
import MyAside from '@/components/my/MyAside.jsx';
import { useNavigate, useParams } from "react-router-dom";
import { MyPlanModal } from '../../components/my/PlanModal';
import axiosInstance from '@/services/axios.jsx'
import { useQuery } from '@tanstack/react-query';
import useUserStore from '../../store/useUserStore';

const profileURL = 'http://3.35.170.26:90/profileImg/';

export default function MyMain() {

  const params = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(65)
  const [menuActive, setMenuActive] = useState("")
  const user = useUserStore(state => state.user);

  useEffect(() => {
    if (params.page) {
      setMenuActive(params.page); // e.g., 'my' from /my or other params
    }else{
      setMenuActive("")
    }
  }, [params.page]);

  const getUserAPI = async () => {
    if (!user?.uid) {
      throw new Error("유저 정보가 없습니다.");
    }
    const resp = await axiosInstance.get('/api/my/user');
    console.log("유저 데이터 조회 "+JSON.stringify(resp.data));
    return resp.data;
  }

  const { data: userData, isError: userError, isLoading: userLoading } = useQuery({
    queryKey: [`${user.uid}`],
    queryFn: getUserAPI,
    enabled: !!user?.uid,
  })

  const paymentHandler = (event) => {
    event.preventDefault();
    navigate("/my/payment")
  }

  const profileModify = (e) => {
    e.preventDefault();
    navigate("/my/modify");
  }
  
  const [plan, setPlan] = useState(false);
  const upgradePlan = (event) => {
      event.preventDefault();
      setPlan(true);
  }
  const showMoreRef = useRef();
  const planClose = () => {
      setPlan(false)
  }

  return (
    <div id='my-main-container'>
      <MyAside />
      <section className='my-main-main'>
        <article className='my-profile flex flex-col justify-center'>
          <div className='flex flex-row justify-left items-center p-10 ml-[30px]'>
            {userLoading ? (
              <div className='w-[200px] h-[200px] bg-white drop-shadow-lg flex items-center justify-center overflow-hidden rounded-full'>
                <p>로딩 중...</p>
              </div>
            ) : userError ? (
              <p>데이터를 불러오는 데 실패했습니다.</p>
            ) : (
              <div className='w-[200px] h-[200px] bg-white drop-shadow-lg flex items-center justify-center overflow-hidden rounded-full'>
                <img
                  className='w-full h-full object-cover flex items-center between-center'
                  src={userData?.profileImgPath ? `${profileURL}${userData.profileImgPath}` : '/images/default-profile.png'}
                  alt="프로필 이미지" 
                />
              </div>
            )}
            <div className='flex flex-col ml-[40px]'>
              <h3 className='text-lg mb-3 font-light text-gray-500'>
                {userData?.name||''}
                ({userData?.levelString||'직급미정'})
              </h3>

              <div className='speech-bubble border py-[20px] px-[40px] flex items-center'>
                <span>{userData?.profileMessage||''}</span>
              </div>
            </div>
          </div>
          <div className='profile'>
            <div className='myinfo border relative h-[450px] p-[20px] mr-10'>
              <h2 className='text-lg mb-2 ml-2 text-gray-500 my-sub-title'>나의 프로필</h2>
              {userLoading ? (
                <p>로딩 중...</p>
              ) : userError ? (
                <p>데이터를 불러오는 데 실패했습니다.</p>
              ) : (
              <div >
                <table className='myinfo-table mt-[30px]'>
                  <tbody>
                    <tr className='my-tr'>
                      <th className='my-th'>이름  </th>
                      <td className='my-td'>{userData?.name||''}</td>
                    </tr>
                    <tr className='my-tr'>
                      <th className='my-th'>회사명 </th>
                      <td className='my-td'>{userData?.companyName||''}</td>
                    </tr>
                    <tr className='my-tr'>
                      <th className='my-th'>부서</th>
                      <td className='my-td'>{userData?.department || '등록된 부서가 없습니다.'}</td>
                    </tr>
                    <tr className='my-tr'>
                      <th className='my-th'>직급</th>
                      <td className='my-td'>{userData?.levelString || ''}</td>
                    </tr>
                    <tr className='my-tr'>
                      <th className='my-th'>이메일</th>
                      <td className='my-td'>{userData?.email || ''}</td>
                    </tr>
                    <tr className='my-tr'>
                      <th className='my-th'>전화번호</th>
                      <td className='my-td'>{userData?.hp || ''}</td>
                    </tr>
                    <tr className='my-tr'>
                      <th className='my-th'>국가</th>
                      <td className='my-td'>{userData?.country || ''}</td>
                    </tr>
                    <tr className='my-tr'>
                      <th className='my-th'>주소</th>
                      <td className='my-td'>{userData?.addr1 ? `${userData.addr1} ${userData.addr2 || ''}` : ''}</td>
                    </tr>
                  </tbody>
                </table>
                <button onClick={profileModify}
                className='btn-profile bg-indigo-500 mt-20 float-right text-white  absolute bottom-[20px] right-[20px]'>프로필 수정</button>
              </div>
              )}
            </div>
            <div className='current-plan relative border p-[20px]  h-[450px] '>
              <h2 className='text-lg text-gray-600 my-sub-title'>나의 구독정보</h2>
              <div className='flex justify-between items-center  mt-[30px]'>
                <img className='plan-img' src="/images/current-plan-standard.png" alt="plan-icon" />
                <div className='flex items-end'>
                  <span className='text-indigo-500'>$</span>
                  <h2 className='text-4xl text-indigo-500'>49</h2>
                  <span className='font-extralight '>/month</span>
                </div>
              </div>
              <ul className='ml-[20px] mt-[30px]'>
                <li className='plan-exp'> 기본 플랜</li>
                <li className='plan-exp'> 최대 100명 협업</li>
                <li className='plan-exp'>10GB 드라이브 사용</li>
              </ul>
              <div>
                <div className='flex justify-between mt-[30px]'>
                  <span className='font-light'>Days</span>
                  <span className='text-gray-500'>{`${progress}%`}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill bg-indigo-400" style={{width: `${progress}%`}}></div>
                </div>
                <span className='text-sm text-gray-500'>4일 후 만료</span>
              
              </div>
              <button onClick={upgradePlan} className='btn-profile border border-indigo-500 text-indigo-800 absolute bottom-[20px] right-[203px]'>플랜 업그레이드</button>
              <button onClick={paymentHandler} className='btn-profile  bg-indigo-500 text-white absolute bottom-[20px] right-[20px]'>결제정보등록</button>
            </div>
          </div>
        </article>
        <div className='plan-modal'>
                <MyPlanModal
                    isOpen={plan}
                    onClose={planClose}
                    text="요금제 변경"
                    showMoreRef={showMoreRef}
                />
        </div>
      </section>
    </div>
  )
}
