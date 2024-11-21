import '@/pages/user/Login.scss';
import CustomInput from '@/components/Input';
import { CustomButton } from '@/components/Button';
import { CustomGubun } from '@/components/Gubun';

export default function Register() {
    return (
        <div className='register-container'>
        <div className='login-form'>
          <p className='font-xl'>REGISTER</p>
          <div className='flex'>
            <div className='flex items-center mt-5'>
              <img className='register-icon mr-3' src="/images/Base Step Elements.png" alt="O" />
              <h1 className='text-3xl mr-2'>01</h1>
              <div className='flex flex-col relative bottom-1'>
                <p className='text-md relative top-1'>Account</p>
                <span className='text-2xs text-gray-500'>Account Details</span>
              </div>
            </div>
            <div className='flex items-center mt-5'>
              <img className='register-icon mr-3 opacity-20' src="/images/Base Step Elements.png" alt="O" />
              <h1 className='text-3xl mr-2'>01</h1>
              <div className='flex flex-col relative bottom-1'>
                <p className='text-md relative top-1'>Account</p>
                <span className='text-2xs text-gray-500'>Account Details</span>
              </div>
            </div>
          </div>
          <div className='inp-box'>
            <div className='sub-title'>
              <h2 className='text-xl'>Account Infomation</h2>
              <p className='text-sm'>이메일 계정 인증으로 Plantry를 시작하세요.</p>
            </div>
            <p className='text-xs guide-text'>이메일 인증 메일이 발송되었습니다.</p>
            <input type='text' placeholder='이메일을 입력해 주세요.'
            className="signup-input" ></input>
            <input type='text' placeholder='아이디를 입력해 주세요.'
            className="signup-input mt-10" ></input>
            <div className='flex justify-between '>
              <input type='text' placeholder='비밀번호를 입력해 주세요.'
              className="xl-inp mr-1 mt-10" ></input>
              <input type='text' placeholder='비밀번호를 한 번 더 입력해 주세요.'
              className="xl-inp mt-10" ></input>
            </div>
            <div className='flex justify-between'>
              <button>이전</button>
              <button>다음</button>
            </div>
          </div>
        </div>
      </div>
    );
};