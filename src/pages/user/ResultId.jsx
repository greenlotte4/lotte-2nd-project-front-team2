
import { Link, useNavigate } from "react-router-dom";


export default function ResultId() {

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
          <div className="flex mt-[40px]">
              <div className="border border-indigo-500 resultIdPw text-indigo-800" >아이디 찾기</div>
            </div>
          <div className='inp-box'>
              <div className='sub-title mt-[50px] ml-[10px]'>
                <h2 className='text-lg font-light'>인증이 완료되었습니다.</h2>
                <h2 className='text-sm font-light'>등록된 이메일과 일치하는 아이디입니다.</h2>
              </div>
              <div className=" mt-[30px] rounded border border-gray-200 h-[150px] pt-[45px] ">
                <table>
                  <tr>
                    <th className="w-[180px]">아이디 : </th>
                    <td className="w-[200px] text-center">yeon****</td>
                  </tr>
                  <tr>
                    <th className="w-[180px]">가입일 : </th>
                    <td className="w-[200px] text-center">2024.11.18</td>
                  </tr>
                </table>
              </div>
            
              <button onClick={(e)=>{e.preventDefault; navigate("/user/login");}} className="bg-indigo-500 w-full h-[60px] rounded-lg text-white mt-20">확인</button>
          </div>
        </div>
      </div>
    )
}
