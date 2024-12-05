import '@/pages/user/Login.scss';
import CustomInput from '@/components/Input';
import { CustomButton } from '@/components/Button';
import { CustomGubun } from '@/components/Gubun';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';
import CustomAlert from '../../components/Alert';
import { useDaumPostcodePopup } from 'react-daum-postcode';

const scriptUrl = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
const baseURL = import.meta.env.VITE_API_BASE_URL;
const validateRules = {
  email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  domain: (email) => email.endsWith('.com') || email.endsWith('.net') || email.endsWith('.co.kr'),
  pwd: (pwd) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pwd),
  uid: (uid) => /^(?=.*[A-Za-z]{4,})(?=.*\d)[A-Za-z\d]+$/.test(uid),
  hp: (hp) => /^(010|011)\d{7,8}$/.test(hp),
  companyCode: (code) => /^[A-Za-z\d]+$/.test(code),
  firstName: (firstName) => /^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/u.test(firstName),
  lastName: (lastName) => /^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/u.test(lastName),
  card: (value) => value !== undefined && /^\d{4}$/.test(value),
  cvc : (cvc) => /^\d{3}$/.test(cvc),
};

validateRules.expiredDate = (expiredDate) => {
  // MM/YY 형식 검증
  const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!regex.test(expiredDate)) return false;
  
  const [month, year] = expiredDate.split('/').map(Number);
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;

  return (year > currentYear) || (year === currentYear && month >= currentMonth);
};

const initState = {
  uid:"",
  pwd:"",
  email:"",
  firstName:"",
  lastName:"",
  hp:"",
  country:"",
  addr1:"",
  addr2:"",
  grade:"",
  company:"",
  companyCode:"",
  cardNumber:"",
  cardNick:"",
  expiredDate:"",
  cvc:"",
  confirmPwd: "",
}

export default function Register() {

  const navigate = useNavigate();
  const [user, setUser] = useState({...initState});
  const [page1success, setPage1success] = useState(false);
  const [page2success, setPage2success] = useState(false);
  const [page3success, setPage3success] = useState(false);
  
  const [alert, setAlert] = useState({message : '', type: '', isOpen: false, onClose: false})
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState(''); // 선택된 플랜 이름 저장
  const [email, setEmail] = useState('');
  const [sendMail, setSendMail] = useState(false);
  const [code, setCode] = useState(''); // 입력한 인증번호 상태
  const [statusMessage, setStatusMessage] = useState({ message: '', type: '' }); // 메시지와 유형 상태 통합
  const [card, setCard] = useState({cardNum1: '', cardNum2: '', cardNum3: '', cardNum4: '',})
 
  // 각 페이지의 검증 상태를 관리
  const [validation1, setValidation1] = useState({
    email: true,
    uid: false,
    pwd: false,
  });
  const [validation2, setValidation2] = useState({
    firstName: false,
    lastName: false,
    hp: false,
  });
  const [validation3, setValidation3] = useState({
    company: false,
    cardNumber: false,
    expiredDate: false,
    cvc: false,
  });
  const [validationStandard, setValidationStandard] = 
  useState({cardNumber: false, expiredDate: false, cvc: false})
  
  useEffect(() => {
    if(validation1.email && validation1.uid && validation1.pwd){
      setPage1success(true);
    }
    if(validation2.firstName && validation2.lastName && validation2.hp){
      setPage2success(true);
    }
    if(validation3.cardNumber&& validation3.company && validation3.cvc && validation3.expiredDate){
      setPage3success(true);
    }
  }, [validation1, validation2,validation3]);
  
  const CardHandler = (e) => {
    const { name, value } = e.target;
  
    // 새로 입력된 값을 card 상태에 반영
    const updatedCard = { ...card, [name]: value };
    setCard(updatedCard);
  
    // 모든 카드 번호를 추출
    const { cardNum1, cardNum2, cardNum3, cardNum4 } = updatedCard;
  
    // 개별 필드가 4자리일 때 유효성 검사
    if (value.length === 4) {
      if (!validateRules.card(value)) {
        setStatusMessage({ message: `유효하지 않은 형식입니다.`, type: 'error' });
        return;
      }
    }
  
    // 모든 카드 번호가 입력되었는지 확인
    if (cardNum1.length === 4 && cardNum2.length === 4 && cardNum3.length === 4 && cardNum4.length === 4) {
      // 모든 카드 번호의 유효성을 검사
      if (
        validateRules.card(cardNum1) &&
        validateRules.card(cardNum2) &&
        validateRules.card(cardNum3) &&
        validateRules.card(cardNum4)
      ) {
        // 카드 번호를 하나의 문자열로 결합
        const fullCardNumber = `${cardNum1}-${cardNum2}-${cardNum3}-${cardNum4}`;
        setUser((prev) => ({ ...prev, cardNumber: fullCardNumber })); // 카드 번호 업데이트
        setValidation3((prev) => ({ ...prev, cardNumber: true })); // 유효성 상태 업데이트
        setStatusMessage({ message: ``, type: '' }); // 메시지 초기화
      } else {
        setStatusMessage({ message: `유효하지 않은 카드 번호입니다.`, type: 'error' });
        setValidation3((prev) => ({ ...prev, cardNumber: false })); // 유효성 상태 업데이트
      }
    } else {
      setStatusMessage({ message: ``, type: '' }); // 카드 번호가 모두 입력되지 않은 상태
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    
    if(user.grade===null||user.grade ===''){
      setAlert({
        message: '이용하실 플랜을 선택해주세요.',
        type: 'warning',
        isOpen: true,
        onClose: false,
      })
      return;
    }
    if(!page3success){
      setAlert({
        message: '입력된 정보를 다시 확인해주세요.',
        type: 'warning',
        isOpen: true,
        onClose: false,
      })
      return;
    }
    console.log("전송될 데이터 "+JSON.stringify(user));

  }
 
  const page1Handler = (event) => {
    event.preventDefault();
    if(!!page1success){
      setCount(count + 1);
      setStatusMessage({ message: ``, type: '' });
    }else{
      setAlert({
        message: '입력된 정보를 다시 확인해주세요.',
        type: 'warning',
        isOpen: true,
        onClose: false,
      })
    }
  }
  const page2Handler = (event) => {
    event.preventDefault();
    if(!!page2success){
      setCount(count + 1);
      setStatusMessage({ message: ``, type: '' });
    }else{
      setAlert({
        message: '입력된 정보를 다시 확인해주세요.',
        type: 'warning',
        isOpen: true,
        onClose: false,
      })
    }
  }
  
  const ChangeHandler = (e) => {
    e.preventDefault();
    const {name, value} = e.target;
    setUser({...user, [e.target.name]: e.target.value});
    console.log("체인지 핸들러 "+name, value);
    
    if(name === 'confirmPwd'){
      if (value !== user.pwd) {
        setStatusMessage({ message: `비밀번호가 일치하지 않습니다.`, type: 'error' });
        setValidation1((prev) => ({ ...prev, pwd: false }));
      } else {
        setStatusMessage({ message: `비밀번호가 일치합니다.`, type: 'success' });
        setValidation1((prev) => ({ ...prev, pwd: true }));
      }
      return;
    }

    // 유효성 검사 규칙이 없는 필드면 메시지 없이 바로 통과
    if (!validateRules[name]) {
      setStatusMessage({ message: ``, type: '' });
      setValidation3((prev) => ({ ...prev, [name]: true}));
      console.log("유효성 검사 없는 필드 "+JSON.stringify(validation3));
      return;
    }

    if(!validateRules[name]?.(value)){
      setStatusMessage({ message: `유효하지 않은 형식입니다.`, type: 'error' });
      return;
    }else{
      setStatusMessage({ message: ``, type: '' });
      setValidation2((prev) => ({ ...prev, firstName: true }));
      setValidation2((prev) => ({ ...prev, lastName: true }));
      setValidation3((prev) => ({ ...prev, [name]: true}));
      console.log(validation3);
    }

    if(name === 'uid' || name === 'hp'){
      debouncedValidateField(name, value);
      return;
    }
    
  }

  function nameChange (field){
    if(field=='uid'){
      return '아이디';
    }else if(field=='hp'){
      return '전화번호';
    }
  }

  const debouncedValidateField = debounce(async (field, value) => {
    const changedName = nameChange(field);
    
    const data = {type : field, value: value }
    try {
      const response = await axios.post(
        `${baseURL}/api/auth/validation`,
        data,
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log(response.data);
      if(response.data == 'available' ){
        setStatusMessage({ message: ` 사용할 수 있는 ${changedName} 입니다.`, type: 'success' });
        if(field == 'uid'){
          setValidation1((prev) => ({ ...prev, uid: true }));
        }else{
          setValidation2((prev) => ({...prev, hp: true}))
        }

      }else{
        setStatusMessage({ message: ` 이미 사용 중인 ${changedName} 입니다.`, type: 'error' });
        setValidation1((prev) => ({ ...prev, uid: false }));
        setValidation2((prev) => ({...prev, hp: false}))
      }
        
      } catch {
        setStatusMessage({ message: `확인 중 서버 오류가 발생했습니다.`, type: 'error' });
      }
  }, 200);

  const debouncedSendEmail = debounce(sendEmail, 100);
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    debouncedSendEmail(value);
  };
  const handleCodeChange = (e) => {
    setCode(e.target.value); // 입력한 인증번호 상태 업데이트
  };
  async function sendEmail (value){
    if (validateRules.email(value) && validateRules.domain(value)) {
      try {
        const response = await axios.post(`${baseURL}/api/auth/sendMail`,
          { email: value },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.status === 200) {
          setStatusMessage({ message: '이메일 인증 메일이 발송되었습니다.', type: 'success' });
          setSendMail(true);
        } else {
          setStatusMessage({ message: '이메일 전송에 실패했습니다.', type: 'error' });
        }
      } catch (error) {
        setStatusMessage({ message: '서버 요청 중 오류가 발생했습니다.', type: 'error' });
      }
    } else {
      setStatusMessage({
        message: '유효하지 않은 이메일 형식입니다.',type: 'error',
      });
    }
  };
  const verifyCode = async () => {
    try {
      const response = await axios.post(
        `${baseURL}/api/auth/verifyMail`,
        { email, code },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data === 'success') {
        setStatusMessage({ message: '인증에 성공했습니다.', type: 'success' });
        setUser({...user, email:email});
        setValidation1((prev) => ({ ...prev, email: true }));
      } else if (response.data === 'notMatch') {
        setStatusMessage({ message: '인증번호가 일치하지 않습니다.', type: 'error' });
      } else {
        setStatusMessage({ message: '인증번호가 만료되었거나 잘못된 요청입니다.', type: 'error' });
      }
    } catch (error) {
      setStatusMessage({ message: '서버 요청 중 오류가 발생했습니다.', type: 'error' });
    }
  };
  const handlePlanSelection = (planName,value) => {
    setSelected(planName); // 선택된 플랜 이름 설정
    setUser((prevUser) => ({ ...prevUser, grade: value, companyCode: '', cardNick: '', cardNumber: '', expiredDate: '', company: '', cvc:'' }));
    setCard((prev) => ({...prev, cardNum1: '', cardNum2: '', cardNum3: '', cardNum4: '',}))
  };
  const closeAlert = () =>{
    setAlert(false)
  }

  
  const open = useDaumPostcodePopup(scriptUrl);
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    console.log(fullAddress); // 선택된 주소 출력
    setUser((prev) => ({ ...prev, addr1: fullAddress })); // 주소 저장
  };

  const handleClick = () => {
    open({ onComplete: handleComplete }); // Daum Postcode API 열기
  };


    return (
      <form>
        <div className='register-container'>
          <div className='login-form'>
            <CustomAlert
              type={alert.type}
              message={alert.message}
              isOpen={alert.isOpen}
              onClose={closeAlert}
            />
            <div className="flex justify-between items-start">
              <p className='text-3xl font-light'>REGISTER</p>
              <Link to="/user/login">
                <img src="/images/Logo_font.png" alt="logo" className="w-[110px] h-[35px]" />
              </Link>
            </div>
            <div className='flex justify-between mt-[30px]'>
              <div className='flex items-center mt-5'>
                <img className={`register-icon mr-3${count === 0 ? '': ' opacity-20'}`} src="/images/Base-Step-Elements.png" alt="O" />
                <h1 className='text-3xl mr-2'>01</h1>
                <div className='flex flex-col relative bottom-1'>
                  <p className='text-md relative top-1'>Account</p>
                  <span className='text-2xs text-gray-500'>Account Details</span>
                </div>
              </div>
              <div className='flex items-center mt-5'>
                <img className={`register-icon mr-3${count === 1 ? '': ' opacity-20'}`} src="/images/Base-Step-Elements.png" alt="O" />
                <h1 className='text-3xl mr-2'>02</h1>
                <div className='flex flex-col relative bottom-1'>
                  <p className='text-md relative top-1'>Personal</p>
                  <span className='text-2xs text-gray-500'>Enter Infomation</span>
                </div>
              </div>
              <div className='flex items-center mt-5'>
                <img className={`register-icon mr-3 ${count === 2 ? '': ' opacity-20'}`} src="/images/Base-Step-Elements.png" alt="O" />
                <h1 className='text-3xl mr-2'>03</h1>
                <div className='flex flex-col relative bottom-1'>
                  <p className='text-md relative top-1'>Billing</p>
                  <span className='text-2xs text-gray-500'>Payment Details</span>
                </div>
              </div>
            </div>
            {count === 0 &&
              <div className='inp-box'>
                <div className='sub-title mb-1'>
                  <h2 className='text-xl'>Account Infomation</h2>
                  <p className='text-sm'>이메일 계정 인증으로 Plantry를 시작하세요.</p>
                </div>
                {statusMessage.message && (
                    <p
                      className={`text-sm flex items-center indent-8 rounded-lg mt-2 mb-2 h-[40px] ${
                        statusMessage.type === 'success' ? 'text-green-500 bg-green-100' : 'bg-red-100 text-red-500'
                      }`}
                    >
                      {statusMessage.message}
                    </p>
                  )}
                <input
                  type='text'
                  placeholder='이메일을 입력해 주세요.'
                  className='signup-input-lg'
                  value={email}
                  onChange={handleEmailChange}
                />
                {!!sendMail && (
                  <div className='flex justify-between items-center'>
                    <input
                      type='text'
                      placeholder='인증번호를 입력해 주세요.'
                      className="signup-input-md mt-10"
                      value={code}
                      onChange={handleCodeChange}
                    />
                    <button
                      type="button"
                      className='btn-confirm mt-10'
                      onClick={verifyCode}
                    >
                      확인
                    </button>
                  </div>
                )}
                <input type='text' placeholder='아이디를 입력해 주세요.'
                value={user.uid} onChange={ChangeHandler} name='uid'
                className="signup-input-lg mt-10" ></input>
                <div className='flex justify-between '>
                  <input type='password' placeholder='비밀번호를 입력해 주세요.'
                  value={user.pwd} onChange={ChangeHandler} name='pwd'
                  className="signup-input-md border rounded mr-1 mt-10" ></input>
                  <input type='password' placeholder='비밀번호를 한 번 더 입력해 주세요.'
                  value={user.confirmPwd} onChange={ChangeHandler} name='confirmPwd'
                  className="signup-input-md mt-10" ></input>
                </div>
                <span className='text-xs ml-2 text-gray-600'>영문, 숫자, 특수기호를 조합하여 8자리 이상</span>
                <div className='flex justify-between reg-btn'>
                  <button className='btn-prev' onClick={() => navigate("/user/terms")}>이전</button>
                  <button className={`btn-next ${page1success? '':'opacity-70'}`} onClick={page1Handler}>다음</button>
                </div>
              </div>
              
            }
            {count === 1 &&
              <div className='inp-box'>
                <div className='sub-title'>
                  <h2 className='text-xl'>Personal Infomation</h2>
                  <p className='text-sm'>유저 정보를 기입해주세요.</p>
                </div>
                {statusMessage.message && (
                  <p
                    className={`text-sm flex items-center indent-8 rounded-lg mt-2 h-[40px] ${
                      statusMessage.type === 'success' ? 'text-green-500 bg-green-100' : 'bg-red-100 text-red-500'
                    }`}
                  >
                    {statusMessage.message}
                  </p>
                )}
                <div className='flex justify-between'>
                  <input type='text' placeholder='성' name='lastName' onChange={ChangeHandler}
                  value={user.lastName} className="signup-input-md mr-1 mt-10" ></input>
                  <input type='text' placeholder='이름' name='firstName' onChange={ChangeHandler}
                  value={user.firstName} className="signup-input-md mt-10" ></input>
                </div>
                <input type='text' placeholder='전화번호 -를 제외하고 입력해주세요.' maxLength={11}
                name='hp' value={user.hp} onChange={ChangeHandler}
                className="signup-input-lg mt-10" ></input>
                <input type='text' placeholder='주소(선택)' onClick={() => handleClick()}
                name='addr1' value={user.addr1} onChange={ChangeHandler}
                className="signup-input-lg mt-10" ></input>
                <div className='flex justify-between '>
                  <input type='text' placeholder='상세주소(선택)' 
                  className="signup-input-md mr-1 mt-10" ></input>
                  <select name="country" className="signup-input-md mt-10" onChange={ChangeHandler}>
                    <option name="country" value="NotSelected">선택 안 함</option>
                    <option name="country" value="SouthKorea">대한민국</option>
                    <option name="country" value="USA">미국</option>
                    <option name="country" value="China">중국</option>
                    <option name="country" value="Jepan">일본</option>
                    <option name="country" value="Taiwan">대만</option>
                    <option name="country" value="France">프랑스</option>
                    <option name="country" value="UK">영국</option>
                    <option name="country" value="Ghana">가나</option>
                    <option name="country" value="Philippines">필리핀</option>
                    <option name="country" value="Canada">캐나다</option>
                  </select>
                </div>
                <div className='flex justify-between reg-btn'>
                  <button className='btn-prev' onClick={() => {setCount(count-1);}}>이전</button>
                  <button className={`btn-next ${page2success? '':'opacity-70'}`} onClick={page2Handler}>다음</button>
                </div>
              </div>
            }
            {count === 2 &&
                <div className="inp-box">
                  <div className="sub-title">
                    <h2 className="text-xl">Select Plan</h2>
                    <p className="text-sm">Plantry의 이용 플랜을 선택해주세요.</p>
                  </div>
                  <div className="flex justify-between mt-10">
                    {/* Company Plan */}
                    <label
                      className={`planbox-label ${selected === 'Company' ? 'selected' : ''}`}
                      onClick={() => handlePlanSelection('Company',0)}
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
                          name="grade"
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
                      onClick={() => handlePlanSelection('Basic',1)}
                    >
                      <div
                        className={`border planbox flex flex-col items-center ${
                          selected === 'Basic' ? 'border-indigo-500' : 'border-indigo-200'
                        }`}
                      >
                        <h3 className="text-lg mt-10">Basic</h3>
                        <p className="text-xs text-gray-500 mt-10">무료 플랜</p>
                        <p className="text-xs text-gray-500">500MB 드라이브 사용</p>
                        <p className="text-xs text-gray-500">10명 초대 가능</p>
                        <div className="flex items-end mt-10">
                          <div className="flex items-start">
                            <p className="text-sm text-indigo-500 mr-1">$</p>
                            <p className="text-3xl text-indigo-500">0</p>
                          </div>
                          <p className="text-sm">/month</p>
                        </div>
                        <input
                          name="grade"
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
                      onClick={() => handlePlanSelection('Standard',2)}
                    >
                      <div
                        className={`border planbox flex flex-col items-center ${
                          selected === 'Standard' ? 'border-indigo-500' : 'border-indigo-200'
                        }`}
                      >
                        <h3 className="text-lg mt-10">Standard</h3>
                        <p className="text-xs text-gray-500 mt-10">기본 플랜</p>
                        <p className="text-xs text-gray-500">1GB 드라이브 사용</p>
                        <p className="text-xs text-gray-500">100명 초대 가능</p>
                        <div className="flex items-end mt-10">
                          <div className="flex items-start">
                            <p className="text-sm text-indigo-500 mr-1">$</p>
                            <p className="text-3xl text-indigo-500">49</p>
                          </div>
                          <p className="text-sm">/month</p>
                        </div>
                        <input
                          name="grade"
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
                      onClick={() => handlePlanSelection('Enterprise',3)}>
                      <div
                        className={`border planbox flex flex-col items-center ${
                          selected === 'Enterprise' ? 'border-indigo-500' : 'border-indigo-200'
                        }`}
                      >
                        <h3 className="text-lg mt-10">Enterprise</h3>
                        <p className="text-xs text-gray-500 mt-10">비즈니스 플랜</p>
                        <p className="text-xs text-gray-500">인당 5GB 드라이브</p>
                        <p className="text-xs text-gray-500">인원 제한 없음</p>
                        <div className="flex items-end mt-10">
                          <div className="flex items-start">
                            <p className="text-sm text-indigo-500 mr-1">$</p>
                            <p className="text-3xl text-indigo-500">499</p>
                          </div> 
                          <p className="text-sm">/month</p>
                        </div>
                        <input
                          name="grade"
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
                      name='companyCode' value={user.companyCode} onChange={ChangeHandler}
                      className="signup-input-lg mt-10" ></input>
                    </>
                  }
                  {
                    selected === 'Enterprise' && 
                    <>
                    <p className='text-sm custom-mt-30'>회사 정보를 입력해주세요.</p>
                      <input type='text' placeholder='회사명'
                      name='company' value={user.company} onChange={ChangeHandler}
                      className="signup-input-lg mt-10" ></input>
                      <div className='signup-input-lg mt-10 flex items-center text-gray-500'>
                        <input type='text' placeholder='카드번호 입력' className="w-1/4 text-center ml-2" maxLength={4}
                        name='cardNum1' value={card.cardNum1} onChange={CardHandler}
                         />-
                        <input type='password' className=" w-1/4 text-center ml-2" maxLength={4}
                        name='cardNum2' value={card.cardNum2} onChange={CardHandler}
                         />-
                        <input type='password' className=" w-1/4 text-center ml-2" maxLength={4} 
                        name='cardNum3' value={card.cardNum3} onChange={CardHandler}
                        />-
                        <input type='text'  className=" w-1/4 text-center ml-2" maxLength={4}  
                        name='cardNum4' value={card.cardNum4} onChange={CardHandler}
                        />
                      </div>
                      <div className='flex justify-between mt-10'>
                        <input type='text' placeholder='카드 별명'
                        name='cardNick' value={user.cardNick} onChange={ChangeHandler}
                        className="card-inp1 mr-1 text-gray-600" ></input>
                        <input type='text' placeholder='만료일'
                        name='expiredDate' value={user.expiredDate} onChange={ChangeHandler}
                        className="card-inp2 mr-1 text-gray-600" maxLength={5} ></input>
                        <input type='text' placeholder='CVC번호'
                        name='cvc' value={user.cvc} onChange={ChangeHandler}
                        className="card-inp2 mr-1 text-gray-600 no-spin" maxLength={3}  ></input>
                      </div>
                    </>
                  }
                  {
                    selected === 'Standard' && 
                    <>
                    <p className='text-sm custom-mt-30'>결제 정보를 입력해주세요.</p>
                    <div className='signup-input-lg mt-10 flex items-center text-gray-500'>
                        <input type='text' placeholder='카드번호 입력' className="w-1/4 text-center ml-2" maxLength={4}
                        name='cardNum1' value={card.cardNum1} onChange={CardHandler}
                         />-
                        <input type='password' className=" w-1/4 text-center ml-2" maxLength={4}
                        name='cardNum2' value={card.cardNum2} onChange={CardHandler}
                         />-
                        <input type='password' className=" w-1/4 text-center ml-2" maxLength={4} 
                        name='cardNum3' value={card.cardNum3} onChange={CardHandler}
                        />-
                        <input type='text'  className=" w-1/4 text-center ml-2" maxLength={4}  
                        name='cardNum4' value={card.cardNum4} onChange={CardHandler}
                        />
                      </div>
                      <div className='flex justify-between mt-10'>
                        <input type='text' placeholder='카드 별명'
                        name='cardNick' value={user.cardNick} onChange={ChangeHandler}
                        className="card-inp1 mr-1 text-gray-600" ></input>
                        <input type='text' placeholder='만료일'
                        name='expiredDate' value={user.expiredDate} onChange={ChangeHandler}
                        className="card-inp2 mr-1 text-gray-600" maxLength={5} ></input>
                        <input type='text' placeholder='CVC번호'
                        name='cvc' value={user.cvc} onChange={ChangeHandler}
                        className="card-inp2 mr-1 text-gray-600" maxLength={3}  ></input>
                      </div>
                    </>
                  }
                  {statusMessage.message && (
                    <p
                      className={`text-sm flex items-center indent-8 rounded-lg mt-2 mb-2 h-[40px] ${
                        statusMessage.type === 'success' ? 'text-green-500 bg-green-100' : 'bg-red-100 text-red-500'
                      }`}
                    >
                      {statusMessage.message}
                    </p>
                  )}
                  
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
                    <button className={`btn-next ${page3success? '':'opacity-70'}`} 
                      onClick={submitHandler}>
                      완료
                    </button>
                  </div>
                </div>
            }
          </div>
        </div>
      </form>
    );
};
