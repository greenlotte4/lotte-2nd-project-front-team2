import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import '@/pages/my/My.scss'
import { Link, useNavigate } from 'react-router-dom'
import { MyModal } from '@/components/my/Modal';
import axiosInstance from '@/services/axios.jsx'
import CustomAlert from '../../components/Alert';
import useUserStore from '../../store/useUserStore';

export default function MyModify() {
    const navigate = useNavigate();
    const user = useUserStore((state) => state.user);
    const [deactive , setDeactive] = useState(0);
    const [file, setFile] = useState(null); // 선택한 파일 상태
    const [selectedFileName, setSelectedFileName] = useState(""); //선택한 파일의 이름
    const [uploadStatus, setUploadStatus] = useState(null); // 업로드 결과 상태
    const [alert, setAlert] = useState({message : '', type: '', isOpen: false, onClose: false})
    const closeAlert = () =>{
    setAlert({ message: '', type: '', isOpen: false, onClose: false });
    }
    
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

    const handleCheckboxChange = (event) => {
        setDeactive(event.target.checked ? 1 : 0); // 체크 상태에 따라 값 설정
    };
    const cancelHandler = (event) => {
        event.preventDefault();
        navigate("/my")
    }
  
    // 파일 선택 핸들러
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if(selectedFile){
            setSelectedFileName(selectedFile.name);
            setFile(selectedFile);
        }
    };

    // 프로필 업로드 핸들러
    const profileUploadHandler = async (event) => {
        event.preventDefault();
        if (!file) {
            alert('업로드할 파일을 선택하세요.');
            return;
        }
        console.log("파일 전송 전 "+file);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axiosInstance.post('/api/my/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true, // 인증 정보 포함
            });
            console.log(response.data);
            if (response.status === 200) {
                setUploadStatus('success');
                setAlert({message: '프로필 이미지가 성공적으로 업로드되었습니다.', isOpen: true, type:'success', onClose: false})
                setSelectedFileName("JPG, GIF 혹은 PNG 등록 가능, 10MB 지원")
                window.location.reload();
                // alert('프로필 이미지가 성공적으로 업로드되었습니다.');
            } else {
                setUploadStatus('error');
                setAlert({message: '업로드 중 오류가 발생했습니다.', isOpen: true, type:'error', onClose: false})
                // alert('업로드 중 오류가 발생했습니다.');
            }
        } catch (error) {
            setUploadStatus('error');
            console.error('업로드 실패:', error);
            setAlert({message: '업로드 중 오류가 발생했습니다. 다시 시도해 주세요.', isOpen: true, type:'error', onClose: false})
            // alert('업로드 중 오류가 발생했습니다.');
        }
    };
    
    const [pass, setPass] = useState(false);
    const modifyPass = (event) => {
        event.preventDefault();
        setPass(true);
    }
    const passClose = () => {
        setPass(false)
    }

  return <>
    <div id='my-modify-container'>
        <section className='my-modify1 border'>
            <CustomAlert
                type={alert.type}
                message={alert.message}
                isOpen={alert.isOpen}
                onClose={closeAlert}
            />
            {/* <h2 className='text-2xl font-light'>My profile</h2> */}
            <form className='my-modify-form'>
                {userLoading ? (
                    <p>로딩 중...</p>
                    ) : userError ? (
                    <p>데이터를 불러오는 데 실패했습니다.</p>
                    ) : (<>
                    <div className='upload-photo flex items-center'>
                        <div className='w-[200px] h-[200px] bg-white drop-shadow-lg flex items-center justify-center overflow-hidden rounded-full'>
                            <img
                            className='w-full h-full object-cover flex items-center between-center'
                            src={userData?.profileImgPath ? `http://3.35.170.26:90/profileImg/${userData.profileImgPath}` : '/images/default-profile.png'}
                            alt="프로필 이미지" 
                            />
                        </div>
                    <div className='relative top-5 left-10'>
                        <input type="text" className='my-nick-inp mb-10 font-light text-gray-600' 
                            value={userData?.uid || ''}
                            readOnly
                        />
                        <input type="file" id='file' 
                            onChange={handleFileChange}
                            className='hidden-inp'
                            />
                        <div className='flex'>
                            <label for="file" className='mr-10'>
                                <div  className='rounded-md h-[40px] flex items-center justify-center bg-indigo-500 text-white w-[185px]'>
                                    새 프로필 업로드
                                </div>
                            </label>
                            <button onClick={profileUploadHandler}
                            className='rounded-md h-[40px] flex items-center justify-center border border-indigo-500 text-indigo-700 w-[150px]'
                            >프로필 등록</button>
                            {/* <button className='btn-profile border border-red-400 text-red-400'>RESET</button> */}
                        </div>
                        <span className='text-sm text-gray-400 font-light'>
                            {selectedFileName || "JPG, GIF 혹은 PNG 등록 가능, 10MB 지원"}
                        </span>
                    </div>
                </div>
                <table className='w-full'>
                    <tbody>
                        <tr>
                            <td className='flex mt-10'>
                                <div className='flex flex-col w-1/2'>
                                    <span className='text-xs text-gray-500 ml-10'>성</span>
                                    <input type="text" className='border my-modify-input'
                                    value={userData?.name || ''}
                                    />
                                </div>
                                <div className='flex flex-col w-1/2'>
                                    <span className='text-xs text-gray-500 ml-10'>이름</span>
                                    <input type="text" className='border my-modify-input'
                                    value={userData?.name || ''}
                                     />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className='flex mt-10'>
                                <div className='flex flex-col w-full'>
                                    <span className='text-xs text-gray-500 ml-10'>이메일</span>
                                    <div className='flex '>
                                        <input type="text" className='border my-modify-input w-1/2'
                                        value={userData?.email || ''}
                                        />
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
                                        <input type="text" className='border w-full my-modify-input' 
                                        value={userData?.hp || ''}
                                        />
                                        <span className='mr-10'>-</span><input type="text" className='border w-full my-modify-input'
                                        value={userData?.hp || ''}
                                        />
                                        <span className='mr-10'>-</span><input type="text" className='border w-full my-modify-input'
                                        value={userData?.hp || ''}
                                        />
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className='flex mt-10'>
                                <div className='flex flex-col w-1/2'>
                                    <span className='text-xs text-gray-500 ml-10'>주소지</span>
                                    <input type="text" className='border my-modify-input' 
                                    value={userData?.addr1 || ''}/>
                                </div>
                                <div className='flex flex-col w-1/2'>
                                    <span className='text-xs text-gray-500 ml-10'>상세주소</span>
                                    <input type="text" className='border my-modify-input'
                                    value={userData?.addr2 || ''} />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className='flex mt-10'>
                                <div className='flex flex-col w-full'>
                                    <span className='text-xs text-gray-500 ml-10'>국가</span>
                                    <input type="text" className='border my-modify-input' 
                                    value={userData?.country || ''}
                                    />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className='flex float-right mt-[50px]'>
                    <button onClick={modifyPass} className='btn-profile border border-indigo-500 text-indigo-700 mr-10'>비밀번호 수정</button>
                    <button className='btn-profile bg-indigo-500 text-white mr-10'>마이프로필 수정</button>
                    <button className='btn-profile border text-gray-500' onClick={cancelHandler}>취소</button>
                </div>
                </>)}
            </form>
        </section>
        <section className='my-modify2'>
            <article className='my-del-account flex flex-col justify-between border'>
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
            <article className='my-social border'>
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
            <div className='pass-modal'>
                <MyModal
                    isOpen={pass}
                    onClose={passClose}
                    text="비밀번호 변경"
                />
            </div>

        </section>
    </div>
  </>
};