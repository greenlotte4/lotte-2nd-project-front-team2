import React, { useState } from 'react'
import '@/pages/my/My.scss'
import { Link, useNavigate } from 'react-router-dom'

export default function MyModify() {
    const navigate = useNavigate();

  const [deactive , setDeactive] = useState(0);
  const handleCheckboxChange = (event) => {
    setDeactive(event.target.checked ? 1 : 0); // 체크 상태에 따라 값 설정
  };
  const cancelHandler = (event) => {
    event.preventDefault();
    navigate("/my")
  }

  return <>
    <div id='my-modify-container'>
        <section className='my-modify1'>
            {/* <h2 className='text-2xl font-light'>My profile</h2> */}
            <form className='my-modify-form'>
                <div className='upload-photo flex items-center'>
                    <img className='user-img' src="/images/user_face_icon.png" alt="user-face" />
                    <div className='relative top-5 left-10'>
                        <input type="text" className='my-nick-inp mb-10 font-light text-gray-600' value="yeonwha****" />
                        <div>
                            <button className='btn-profile bg-indigo-500 text-white mr-10'>새 프로필 등록</button>
                            <button className='btn-profile border border-red-400 text-red-400'>RESET</button>
                        </div>
                        <span className='text-sm text-gray-400 font-light'>JPG, GIF 혹은 PNG 등록 가능, 10MB 지원</span>
                    </div>
                </div>
                <table className='w-full'>
                    <tbody>
                        <tr>
                            <td className='flex mt-10'>
                                <div className='flex flex-col w-1/2'>
                                    <span className='text-xs text-gray-500 ml-10'>성</span>
                                    <input type="text" className='border my-modify-input' />
                                </div>
                                <div className='flex flex-col w-1/2'>
                                    <span className='text-xs text-gray-500 ml-10'>이름</span>
                                    <input type="text" className='border my-modify-input' />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className='flex mt-10'>
                                <div className='flex flex-col w-full'>
                                    <span className='text-xs text-gray-500 ml-10'>이메일</span>
                                    <div className='flex '>
                                        <input type="text" className='border my-modify-input w-1/2' />
                                        {/* <span className='h-full text-gray-500 text-2xl mr-10'>@</span>                             */}
                                        <select className='my-modify-select text-gray-500 w-1/2'>
                                            <option className='text-gray-500' value="">직접 입력</option>
                                            <option className='text-gray-500' value="">@ naver.com</option>
                                            <option className='text-gray-500' value="">@ gmail.com</option>
                                            <option className='text-gray-500' value="">@ daum.net</option>
                                        </select>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className='flex mt-10'>
                                <div className='flex flex-col w-full'>
                                    <span className='text-xs text-gray-500 ml-10'>전화번호</span>
                                    <div className='flex items-center'>
                                        <input type="text" className='border w-full my-modify-input' />
                                        <span className='mr-10'>-</span><input type="text" className='border w-full my-modify-input' />
                                        <span className='mr-10'>-</span><input type="text" className='border w-full my-modify-input' />
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className='flex mt-10'>
                                <div className='flex flex-col w-1/2'>
                                    <span className='text-xs text-gray-500 ml-10'>국가</span>
                                    <input type="text" className='border my-modify-input' />
                                </div>
                                <div className='flex flex-col w-1/2'>
                                    <span className='text-xs text-gray-500 ml-10'>거주지역</span>
                                    <input type="text" className='border my-modify-input' />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className='flex mt-10'>
                                <div className='flex flex-col w-full'>
                                    <span className='text-xs text-gray-500 ml-10'>상세주소</span>
                                    <input type="text" className='border my-modify-input' />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className='flex float-right mt-[50px]'>
                    <button className='btn-profile border border-indigo-500 text-indigo-700 mr-10'>비밀번호 수정</button>
                    <button className='btn-profile bg-indigo-500 text-white mr-10'>마이프로필 수정</button>
                    <button className='btn-profile border text-gray-500' onClick={cancelHandler}>취소</button>
                </div>
            </form>
        </section>
        <section className='my-modify2'>
            <article className='my-del-account flex flex-col justify-between'>
                <h2 className='sub-title text-lg'>Delete Account</h2>
                <div className='flex flex-col justify-start h-full'>
                    <label><input type="checkbox" className='mt-[30px] mr-10' onChange={handleCheckboxChange}/> 계정을 비활성화하고 싶습니다.</label>
                    {deactive===1&& 
                    <div className='mt-[30px]'>
                        <span className='text-xs ml-10'>먼저 비밀번호를 확인하셔야 합니다.</span>
                        <div className='flex items-center '>
                            <input type="password" className='delete-inp mr-10' />
                            <button className='btn-delete bg-indigo-500 text-white' >확인</button>
                        </div>
                    </div>
                    }
                </div>
                <button className='btn-profile border text-gray-500 w-full'>계정 비활성화</button>
            </article>
            <article className='my-social'>
                <h2 className='sub-title text-lg'>Social Account</h2>
                <span className='text-sm text-gray-500'>Plantry와 소셜 계정을 연동할 수 있습니다.</span>
                <ul className='mt-[30px]'>
                    <li className='flex justify-between items-center border p-2 rounded-lg mt-10'>
                        <div className='flex'>
                            <img src="/images/kakao-icon-box.png" alt="icon" className='icon-size-50 rounded-lg mr-10'/>
                            <div>
                                <p className='flex'>Kakao Talk <img className='ml-10' src="/images/Link-icon.png" alt="link" /></p>
                                <span>연결된 계정의 이메일주소</span>
                            </div>
                        </div>
                        <img src="/images/gold_star.png" alt="star" className='icon-size-25 mr-10'/>
                    </li>
                    <li className='flex justify-between items-center border p-2 rounded-lg mt-10'>
                        <div className='flex'>
                            <img src="/images/google-icon-box.png" alt="icon" className='icon-size-50 rounded-lg mr-10'/>
                            <div>
                                <p className='flex'>Google <img className='ml-10' src="/images/LinkOff-icon.png" alt="link" /></p>
                                <span>연결된 계정의 이메일주소</span>
                            </div>
                        </div>
                        <img src="/images/gray_star.png" alt="star" className='icon-size-25 mr-10'/>
                    </li>
                    <li className='flex justify-between items-center border p-2 rounded-lg mt-10'>
                        <div className='flex'>
                            <img src="/images/naver-icon-box.png" alt="icon" className='icon-size-50 rounded-lg mr-10'/>
                            <div>
                                <p className='flex'>Naver <img className='ml-10' src="/images/LinkOff-icon.png" alt="link" /></p>
                                <span>연결된 계정의 이메일주소</span>
                            </div>
                        </div>
                        <img src="/images/gray_star.png" alt="star" className='icon-size-25 mr-10'/>
                    </li>
                    <li className='flex justify-between items-center border p-2 rounded-lg mt-10'>
                        <div className='flex'>
                            <img src="/images/Facebook_icon-box.png" alt="icon" className='icon-size-50 rounded-lg mr-10'/>
                            <div>
                                <p className='flex'>Facebook <img className='ml-10' src="/images/LinkOff-icon.png" alt="link" /></p>
                                <span>연결된 계정의 이메일주소</span>
                            </div>
                        </div>
                        <img src="/images/gray_star.png" alt="star" className='icon-size-25 mr-10'/>
                    </li>
                </ul>
            </article>
        </section>
    </div>
  </>
};