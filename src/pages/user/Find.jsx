import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export default function Find() {

  const navigate = useNavigate();
  const [type, setType] = useState(0);

  const pwHandler = (e) => {
    e.preventDefault();
    navigate("/user/resultPw");
  }
  const idHandler = (e) => {
    e.preventDefault();
    navigate("/user/resultId");
  }

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
          <div className='inp-box'>
            <div className="flex mt-[50px]">
              <div className={` ${type === 0 ? 'bg-indigo-500 findIdPw text-white' : 'border border-indigo-500 findIdPw text-indigo-800'}`} onClick={() => setType(0)}>아이디찾기</div>
              <div className={` ${type === 0 ? 'border border-indigo-500 findIdPw text-indigo-800' : 'bg-indigo-500 findIdPw text-white'}`}  onClick={() => setType(1)}>비밀번호찾기</div>
            </div>
            {type===0 && 
            <>
              <div className='sub-title mt-[40px] ml-[10px]'>
                <h2 className='text-lg font-light'>이메일 인증으로 찾기</h2>
                <p className='text-sm font-extralight'>등록된 이메일로 인증 후 계정 아이디를 확인하실 수 있습니다.</p>
              </div>
              <input type='text' placeholder='이름을 입력해주세요.'
              className="find-inp-lg mt-[30px] text-sm font-light" ></input>
              <div className="flex mt-[20px]">
                <input type='text' placeholder='이메일을 입력해주세요.'
                className="find-inp-md text-sm font-light" ></input>
                <button className="border rounded-lg border-indigo-500 ml-2 find-btn text-indigo-700">인증번호 전송</button>
              </div>
              <div className="flex mt-[20px]">
                <input type='text' placeholder='인증번호 숫자 6자리 입력'
                className="find-inp-md text-sm font-light" ></input>
                <button className="border rounded-lg border-indigo-500 ml-2 find-btn text-indigo-700">확인</button>
              </div>
              <p className="text-xs font-light ml-1">인증번호를 입력해주세요.</p>
              <button onClick={idHandler} className="bg-indigo-500 w-full h-[60px] rounded-lg text-white mt-20">다음</button>
            </>
            }
            {type === 1 &&
            <>
              <div className='sub-title mt-[40px] ml-[10px]'>
                <h2 className='text-lg font-light'>이메일 인증으로 찾기</h2>
                <p className='text-sm font-extralight'>등록된 이메일로 인증 후 비밀번호를 재설정해주세요.</p>
              </div>
              <input type='text' placeholder='아이디를 입력해주세요.'
              className="find-inp-lg mt-[30px] text-sm font-light" ></input>
              <div className="flex mt-[20px]">
                <input type='text' placeholder='이메일을 입력해주세요.'
                className="find-inp-md text-sm font-light" ></input>
                <button className="border rounded-lg border-indigo-500 ml-2 find-btn text-indigo-700">인증번호 전송</button>
              </div>
              <div className="flex mt-[20px]">
                <input type='text' placeholder='인증번호 숫자 6자리 입력'
                className="find-inp-md text-sm font-light" ></input>
                <button className="border rounded-lg border-indigo-500 ml-2 find-btn text-indigo-700">확인</button>
              </div>
              <p className="text-xs font-light ml-1">인증번호를 입력해주세요.</p>
              <button className="bg-indigo-500 w-full h-[60px] rounded-lg text-white mt-20" onClick={pwHandler}>다음</button>
            </>
            }
            
          </div>
        </div>
      </div>
    )
}
