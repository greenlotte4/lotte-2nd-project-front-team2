import '@/pages/user/Login.scss';
import CustomInput from '@/components/Input';
import { CustomButton } from '@/components/Button';
import { CustomGubun } from '@/components/Gubun';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState(''); // 선택된 플랜 이름 저장
  const navigate = useNavigate();

  const handlePlanSelection = (planName) => {
    setSelected(planName); // 선택된 플랜 이름 설정
  };

    return (
      <form>
        <div className='register-container'>
          <div className='login-form'>
            <div className="flex justify-between items-start">
              <p className='text-3xl font-extralight'>REGISTER</p>
              <Link to="/user/login">
                <img src="/images/Logo_font.png" alt="logo" className="w-[110px] h-[35px]" />
              </Link>
            </div>
            {count === 0 &&
                <div className='inp-box'>
                <div className='flex justify-between'>
                  <div className='flex items-center mt-5'>
                    <img className='register-icon mr-3' src="/images/Base-Step-Elements.png" alt="O" />
                    <h1 className='text-3xl mr-2'>01</h1>
                    <div className='flex flex-col relative bottom-1'>
                      <p className='text-md relative top-1'>Account</p>
                      <span className='text-2xs text-gray-500'>Account Details</span>
                    </div>
                  </div>
                  <div className='flex items-center mt-5'>
                    <img className='register-icon mr-3 opacity-20' src="/images/Base-Step-Elements.png" alt="O" />
                    <h1 className='text-3xl mr-2'>02</h1>
                    <div className='flex flex-col relative bottom-1'>
                      <p className='text-md relative top-1'>Personal</p>
                      <span className='text-2xs text-gray-500'>Enter Infomation</span>
                    </div>
                  </div>
                  <div className='flex items-center mt-5'>
                    <img className='register-icon mr-3 opacity-20' src="/images/Base-Step-Elements.png" alt="O" />
                    <h1 className='text-3xl mr-2'>03</h1>
                    <div className='flex flex-col relative bottom-1'>
                      <p className='text-md relative top-1'>Billing</p>
                      <span className='text-2xs text-gray-500'>Payment Details</span>
                    </div>
                  </div>
                </div>
                  <div className='sub-title'>
                    <h2 className='text-xl'>Account Infomation</h2>
                    <p className='text-sm'>이메일 계정 인증으로 Plantry를 시작하세요.</p>
                  </div>
                  <p className='text-xs guide-text mt-3'>이메일 인증 메일이 발송되었습니다.</p>
                  <input type='text' placeholder='이메일을 입력해 주세요.'
                  className="signup-input-lg" ></input>
                  {/* <div className='flex justify-between items-center'>
                    <input type='text' placeholder='인증번호를 입력해 주세요.'
                    className="signup-input-md mt-10" ></input>
                    <button className='btn-confirm mt-10'>확인</button>
                  </div> */}
                  <input type='text' placeholder='아이디를 입력해 주세요.'
                  className="signup-input-lg mt-10" ></input>
                  <div className='flex justify-between '>
                    <input type='text' placeholder='비밀번호를 입력해 주세요.'
                    className="xl-inp mr-1 mt-10" ></input>
                    <input type='text' placeholder='비밀번호를 한 번 더 입력해 주세요.'
                    className="xl-inp mt-10" ></input>
                  </div>
                  <div className='flex justify-between reg-btn'>
                    <button className='btn-prev' onClick={() => navigate("/user/terms")}>이전</button>
                    <button className='btn-next' onClick={() => {setCount(count + 1);}}>다음</button>
                  </div>
                </div>
              
            }
      {count === 1 &&
          <div className='inp-box'>
          <div className='flex justify-between'>
            <div className='flex items-center mt-5'>
              <img className='register-icon mr-3 opacity-20' src="/images/Base-Step-Elements.png" alt="O" />
              <h1 className='text-3xl mr-2'>01</h1>
              <div className='flex flex-col relative bottom-1'>
                <p className='text-md relative top-1'>Account</p>
                <span className='text-2xs text-gray-500'>Account Details</span>
              </div>
            </div>
            <div className='flex items-center mt-5'>
              <img className='register-icon mr-3' src="/images/Base-Step-Elements.png" alt="O" />
              <h1 className='text-3xl mr-2'>02</h1>
              <div className='flex flex-col relative bottom-1'>
                <p className='text-md relative top-1'>Personal</p>
                <span className='text-2xs text-gray-500'>Enter Infomation</span>
              </div>
            </div>
            <div className='flex items-center mt-5'>
              <img className='register-icon mr-3 opacity-20' src="/images/Base-Step-Elements.png" alt="O" />
              <h1 className='text-3xl mr-2'>03</h1>
              <div className='flex flex-col relative bottom-1'>
                <p className='text-md relative top-1'>Billing</p>
                <span className='text-2xs text-gray-500'>Payment Details</span>
              </div>
            </div>
          </div>
            <div className='sub-title'>
              <h2 className='text-xl'>Personal Infomation</h2>
              <p className='text-sm'>유저 정보를 기입해주세요.</p>
            </div>
            <div className='flex justify-between custom-mt-20'>
              <input type='text' placeholder='성'
              className="xl-inp mr-1 mt-10" ></input>
              <input type='text' placeholder='이름'
              className="xl-inp mt-10" ></input>
            </div>
            <input type='text' placeholder='전화번호'
            className="signup-input-lg mt-10" ></input>
            <div className='flex justify-between '>
              <input type='text' placeholder='도시명'
              className="xl-inp mr-1 mt-10" ></input>
              <select name="country" className="xl-inp mt-10">
                <option value="">대한민국</option>
                <option value="">미국</option>
                <option value="">중국</option>
                <option value="">일본</option>
                <option value="">대만</option>
                <option value="">프랑스</option>
                <option value="">영국</option>
                <option value="">가나</option>
                <option value="">필리핀</option>
                <option value="">캐나다</option>
              </select>
            </div>
            <input type='text' placeholder='주소(선택)'
            className="signup-input-lg mt-10" ></input>
            <div className='flex justify-between reg-btn'>
              <button className='btn-prev' onClick={() => {setCount(count-1);}}>이전</button>
              <button className='btn-next' onClick={() => {setCount(count+1);}}>다음</button>
            </div>
          </div>
          }
          {count === 2 &&
              <div className="inp-box">
              <div className='flex justify-between'>
                <div className='flex items-center mt-5'>
                  <img className='register-icon mr-3 opacity-20' src="/images/Base-Step-Elements.png" alt="O" />
                  <h1 className='text-3xl mr-2'>01</h1>
                  <div className='flex flex-col relative bottom-1'>
                    <p className='text-md relative top-1'>Account</p>
                    <span className='text-2xs text-gray-500'>Account Details</span>
                  </div>
                </div>
                <div className='flex items-center mt-5'>
                  <img className='register-icon mr-3 opacity-20' src="/images/Base-Step-Elements.png" alt="O" />
                  <h1 className='text-3xl mr-2'>02</h1>
                  <div className='flex flex-col relative bottom-1'>
                    <p className='text-md relative top-1'>Personal</p>
                    <span className='text-2xs text-gray-500'>Enter Infomation</span>
                  </div>
                </div>
                <div className='flex items-center mt-5'>
                  <img className='register-icon mr-3' src="/images/Base-Step-Elements.png" alt="O" />
                  <h1 className='text-3xl mr-2'>03</h1>
                  <div className='flex flex-col relative bottom-1'>
                    <p className='text-md relative top-1'>Billing</p>
                    <span className='text-2xs text-gray-500'>Payment Details</span>
                  </div>
                </div>
              </div>
                <div className="sub-title">
                  <h2 className="text-xl">Select Plan</h2>
                  <p className="text-sm">Plantry의 이용 플랜을 선택해주세요.</p>
                </div>
                <div className="flex justify-between mt-10">
                  {/* Company Plan */}
                  <label
                    className={`planbox-label ${selected === 'Company' ? 'selected' : ''}`}
                    onClick={() => handlePlanSelection('Company')}
                  >
                    <div
                      className={`border planbox flex flex-col items-center ${
                        selected === 'Company' ? 'border-indigo-500' : 'border-indigo-200'
                      }`}
                    >
                      <h3 className="text-lg mt-10">Company</h3>
                      <p className="text-xs text-gray-500 custom-mt-20">회사에서 구독했어요</p>
                      <p className="text-xs text-gray-500 mt-2">Plantry 회사코드를</p>
                      <p className="text-xs text-gray-500 mt-2"> 입력해야 해요.</p>
                      <input
                        name="plan"
                        type="radio"
                        className="custom-mt-30"
                        checked={selected === 'Company'}
                        readOnly
                      />
                    </div>
                  </label>

                  {/* Basic Plan */}
                  <label
                    className={`planbox-label ${selected === 'Basic' ? 'selected' : ''}`}
                    onClick={() => handlePlanSelection('Basic')}
                  >
                    <div
                      className={`border planbox flex flex-col items-center ${
                        selected === 'Basic' ? 'border-indigo-500' : 'border-indigo-200'
                      }`}
                    >
                      <h3 className="text-lg mt-10">Basic</h3>
                      <p className="text-xs text-gray-500 mt-10">무료 플랜</p>
                      <p className="text-xs text-gray-500">5GB 드라이브 사용</p>
                      <p className="text-xs text-gray-500">10명 초대 가능</p>
                      <div className="flex items-end mt-10">
                        <div className="flex items-start">
                          <p className="text-sm text-indigo-500 mr-1">$</p>
                          <p className="text-3xl text-indigo-500">0</p>
                        </div>
                        <p className="text-sm">/month</p>
                      </div>
                      <input
                        name="plan"
                        type="radio"
                        className="mt-10"
                        checked={selected === 'Basic'}
                        readOnly
                      />
                    </div>
                  </label>

                  {/* Standard Plan */}
                  <label
                    className={`planbox-label ${selected === 'Standard' ? 'selected' : ''}`}
                    onClick={() => handlePlanSelection('Standard')}
                  >
                    <div
                      className={`border planbox flex flex-col items-center ${
                        selected === 'Standard' ? 'border-indigo-500' : 'border-indigo-200'
                      }`}
                    >
                      <h3 className="text-lg mt-10">Standard</h3>
                      <p className="text-xs text-gray-500 mt-10">기본 플랜</p>
                      <p className="text-xs text-gray-500">10GB 드라이브 사용</p>
                      <p className="text-xs text-gray-500">100명 초대 가능</p>
                      <div className="flex items-end mt-10">
                        <div className="flex items-start">
                          <p className="text-sm text-indigo-500 mr-1">$</p>
                          <p className="text-3xl text-indigo-500">49</p>
                        </div>
                        <p className="text-sm">/month</p>
                      </div>
                      <input
                        name="plan"
                        type="radio"
                        className="mt-10"
                        checked={selected === 'Standard'}
                        readOnly
                      />
                    </div>
                  </label>

                  {/* Enterprise Plan */}
                  <label
                    className={`planbox-label ${selected === 'Enterprise' ? 'selected' : ''}`}
                    onClick={() => handlePlanSelection('Enterprise')}
                  >
                    <div
                      className={`border planbox flex flex-col items-center ${
                        selected === 'Enterprise' ? 'border-indigo-500' : 'border-indigo-200'
                      }`}
                    >
                      <h3 className="text-lg mt-10">Enterprise</h3>
                      <p className="text-xs text-gray-500 mt-10">업그레이드 플랜</p>
                      <p className="text-xs text-gray-500">100GB 드라이브 사용</p>
                      <p className="text-xs text-gray-500">인원 제한 없음</p>
                      <div className="flex items-end mt-10">
                        <div className="flex items-start">
                          <p className="text-sm text-indigo-500 mr-1">$</p>
                          <p className="text-3xl text-indigo-500">499</p>
                        </div>
                        <p className="text-sm">/month</p>
                      </div>
                      <input
                        name="plan"
                        type="radio"
                        className="mt-10"
                        checked={selected === 'Enterprise'}
                        readOnly
                      />
                    </div>
                  </label>
                </div>
                {
                  selected === 'Company' && 
                  <>
                    <p className='text-sm custom-mt-30'>Plantry에서 제공한 회사코드를 입력해주세요.</p>
                    <input type='text' placeholder='회사코드 입력'
                    className="signup-input-lg mt-10" ></input>
                  </>
                }
                {
                  selected === 'Enterprise' && 
                  <>
                  <p className='text-sm custom-mt-30'>회사 정보를 입력해주세요.</p>
                    <input type='text' placeholder='회사명을 입력해주세요.'
                    className="signup-input-lg mt-10" ></input>
                    <input type='text' placeholder='결제할 카드의 번호를 입력해주세요.'
                    className="signup-input-lg mt-10" ></input>
                    <div className='flex justify-between mt-10'>
                      <input type='text' placeholder='카드 별명'
                      className="card-inp1 mr-1" ></input>
                      <input type='text' placeholder='만료일'
                      className="card-inp2 mr-1" ></input>
                      <input type='text' placeholder='CVC번호'
                      className="card-inp2 mr-1" ></input>
                    </div>
                  </>
                }
                
                <div className="flex justify-between reg-btn mt-10">
                  <button
                    className="btn-prev"
                    onClick={(e) => {
                      e.preventDefault();
                      setCount(count - 1);
                    }}
                  >
                    이전
                  </button>
                  <button className="btn-next" type="submit">완료</button>
                </div>
              </div>
          }
          </div>
        </div>
      </form>
    );
};
