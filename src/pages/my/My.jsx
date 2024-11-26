import React, { useEffect, useState } from 'react'
import '@/pages/my/My.scss'
import MyAside from '@/components/my/MyAside.jsx';
import { useNavigate, useParams } from "react-router-dom";


export default function MyMain() {

  const params = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(65)
  const [menuActive, setMenuActive] = useState("")

  useEffect(() => {
    if (params.page) {
      setMenuActive(params.page); // e.g., 'my' from /my or other params
    }else{
      setMenuActive("")
    }
  }, [params.page]);
  


  
  const profileModify = (e) => {
    e.preventDefault();
    navigate("/my/modify");
  }

  return (
    <div id='my-main-container'>
      <MyAside />
      <section className='my-main-main'>
        <article className='my-profile flex flex-col justify-center'>
          <div className='flex flex-row justify-left items-center p-10 ml-[30px]'>
            <img className='profile-img' src="/images/user_face_icon.png" alt="user-face-icon" />
            <div className='flex flex-col ml-[40px]'>
              <h3 className='text-lg mb-3 font-light text-gray-500'>yeonwha****</h3>
              <div className='speech-bubble drop-shadow-lg py-[20px] px-[40px] flex items-center'>
                <span>안녕하세요. 개발팀 박연화입니다.<br/> 어쩌고</span>
              </div>
            </div>
          </div>
          <div className='profile'>
            <div className='myinfo border relative h-[450px] p-[20px] mr-10'>
              <h2 className='text-lg mb-2 ml-2 text-gray-500 my-sub-title'>나의 프로필</h2>
              <div >
                <table className='myinfo-table mt-[30px]'>
                  <tbody>
                    <tr className='my-tr'>
                      <th className='my-th'>이름  </th>
                      <td className='my-td'>박연화</td>
                    </tr>
                    <tr className='my-tr'>
                      <th className='my-th'>회사명 </th>
                      <td className='my-td'>Plantry</td>
                    </tr>
                    <tr className='my-tr'>
                      <th className='my-th'>부서 </th>
                      <td className='my-td'>개발팀</td>
                    </tr>
                    <tr className='my-tr'>
                      <th className='my-th'>직급 </th>
                      <td className='my-td'>박연화</td>
                    </tr>
                    <tr className='my-tr'>
                      <th className='my-th'>이메일 </th>
                      <td className='my-td'>ppyyf@naver.com</td>
                    </tr>
                    <tr className='my-tr'>
                      <th className='my-th'>전화번호 </th>
                      <td className='my-td'>010-1234-1234</td>
                    </tr>
                    <tr className='my-tr'>
                      <th className='my-th'>국가/지역 </th>
                      <td className='my-td'>대한민국 / 부산</td>
                    </tr>
                    <tr className='my-tr'>
                      <th className='my-th'>주소 </th>
                      <td className='my-td'> 없음</td>
                    </tr>
                  </tbody>
                </table>
                <button onClick={profileModify}
                className='btn-profile bg-indigo-500 mt-20 float-right text-white  absolute bottom-[20px] right-[20px]'>프로필 수정</button>
              </div>
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
                <button className='btn-profile  bg-indigo-500 text-white absolute bottom-[20px] right-[20px]'>결제정보등록</button>
                <button className='btn-profile border border-indigo-500 text-indigo-800 absolute bottom-[20px] right-[193px]'>등록한 결제정보</button>
              </div>
          </div>
        </article>
      </section>
    </div>
  )
}
