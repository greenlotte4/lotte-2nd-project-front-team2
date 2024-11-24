
import { Link, useNavigate } from "react-router-dom";


export default function ResultPw() {

  const navigate = useNavigate();

    return (
      <div className='find-container'>
        <div className='login-form'>
          <div className="flex justify-between items-start">
            <div>
              <p className='text-3xl font-extralight'>FIND YOUR</p>
              <p className='text-3xl ml-[60px] font-extralight'>ACCOUNT</p>
            </div>
            <Link to="/user/login">
                <img src="/images/Logo_font.png" alt="logo" className="w-[110px] h-[35px]" />
            </Link>
          </div>
          <div className="flex mt-[50px]">
              <div className="border border-indigo-500 resultIdPw text-indigo-800">비밀번호 재설정</div>
            </div>
          <div className='inp-box'>
              <div className='sub-title mt-[40px] ml-[10px]'>
                <h2 className='text-lg font-light'> 인증이 완료되었습니다.</h2>
                <p className='text-sm font-extralight'>새로운 비밀번호를 입력해 비밀번호를 재설정하세요.</p>
              </div>
              <input type='text' placeholder='새 비밀번호를 입력해주세요.'
              className="find-inp-lg mt-[30px] text-sm font-light" ></input>
              <input type='text' placeholder='새 비밀번호를 다시 입력해주세요.'
              className="find-inp-lg mt-[30px] text-sm font-light" ></input>
              <p className="text-xs font-light ml-1 mt-1">영문, 숫자 포함 8자리 이상</p>
              
            
              <button onClick={(e)=>{e.preventDefault; navigate("/user/login");}} className="bg-indigo-500 w-full h-[60px] rounded-lg text-white mt-20">확인</button>
          </div>
        </div>
      </div>
    )
}
