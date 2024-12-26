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
  uid: (uid) => /^(?=(.*[A-Za-z]){3,})(?=.*\d)[A-Za-z\d]+$/.test(uid),
  hp: (hp) => /^(010-\d{4}-\d{4}|011-\d{3}-\d{4})$/.test(hp),
  company: (code) => /^[A-Za-z\d]+$/.test(code),
  firstName: (firstName) => /^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/u.test(firstName),
  lastName: (lastName) => /^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/u.test(lastName),
  card: (value) => value !== undefined && /^\d{4}$/.test(value),
  paymentCardCvc : (paymentCardCvc) => /^\d{3}$/.test(paymentCardCvc),
};

validateRules.paymentCardExpiration = (paymentCardExpiration) => {
  // MM/YY 형식 검증
  const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!regex.test(paymentCardExpiration)) return false;
  
  const [month, year] = paymentCardExpiration.split('/').map(Number);
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;

  return (year > currentYear) || (year === currentYear && month >= currentMonth);
};

const initState = {
  uid: "",
  pwd: "",
  email: "",
  firstName: "",
  lastName: "",
  name: "",
  hp: "",
  country: "NotSelected",
  addr1: "",
  addr2: "",
  grade: "",
  company: "",
  confirmPwd: "",
  companyName: "",
  role: "",
};

const cardinit = {
  paymentCardNo:"",
  paymentCardNick:"",
  paymentCardExpiration:"",
  paymentCardCvc:"",
  activeStatus:0,
}
// ===================================================================================
export default function Register() {
  const navigate = useNavigate();
  
  // 페이지 구분 & 플랜 구분 & 유효성검사 결과 알리미
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState(''); // 선택된 플랜 이름 저장
  const [alert, setAlert] = useState({message : '', type: '', isOpen: false, onClose: false})
  const [statusMessage, setStatusMessage] = useState({ message: '', type: '' }); // 메시지와 유형 상태 통합

  // 보낼 데이터
  const [user, setUser] = useState({...initState});
  const [payment, setPayment] = useState({...cardinit});

  //페이지별 전체 유효성 검사 완료 상태 표시(이게 트루여야 다음으로 넘어감)
  const [page1success, setPage1success] = useState(false);
  const [page2success, setPage2success] = useState(false);
  const [page3success, setPage3success] = useState(false);
  
  //set card 말곤 없어도 될 것 같다. 
  const [email, setEmail] = useState('');
  const [sendMail, setSendMail] = useState(false);
  const [code, setCode] = useState(''); // 입력한 인증번호 상태
  const [card, setCard] = useState({cardNum1: '', cardNum2: '', cardNum3: '', cardNum4: '',})
 
  // 각 페이지의 검증 상태를 관리
  const [validation1, setValidation1] = useState({
    email: false,
    uid: false,
    pwd: false,
  });
  const [validation2, setValidation2] = useState({
    firstName: false,
    lastName: false,
    hp: false,
  });
  //3페이지는 플랜별로 검증 상태 관리
  const [validationEnterprise, setValidationEnterprise] = useState({
    companyName: false,
    paymentCardNo: false,
    paymentCardExpiration: false,
    paymentCardCvc: false,
  });
  const [validationStandard, setValidationStandard] = 
  useState({paymentCardNo: false, paymentCardExpiration: false, paymentCardCvc: false})
  const [validationCompany, setValidationCompany] = 
  useState({company: false})

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked; // 체크 여부 확인
    setPayment((prev) => ({
      ...prev,
      activeStatus: isChecked ? 1 : 0, 
    }));
  };

  useEffect(() => {
    if(validation1.email && validation1.uid && validation1.pwd){
      setPage1success(true);
    }
    if(validation2.firstName && validation2.lastName && validation2.hp){
      setPage2success(true);
    }
  }, [validation1, validation2]);

  useEffect(() => {
    // 선택된 플랜에 따라 page3success 업데이트
    if (selected === 'Company') {
      setPage3success(validationCompany.company);
      setUser((prevUser) => ({ ...prevUser, role:'WORKER' }));
    } else if (selected === 'Standard') {
      setPage3success(
        validationStandard.paymentCardNo &&
        validationStandard.paymentCardExpiration &&
        validationStandard.paymentCardCvc
      );
      setUser((prevUser) => ({ ...prevUser, role:'USER' }));
    } else if (selected === 'Enterprise') {
      setPage3success(
        validationEnterprise.paymentCardNo &&
        validationEnterprise.companyName &&
        validationEnterprise.paymentCardExpiration &&
        validationEnterprise.paymentCardCvc
      );
      setUser((prevUser) => ({ ...prevUser, role:'COMPANY' }));
      console.log('dfsa', validationEnterprise)
    }else if(selected ==='Basic'){
      setPage3success(true); // 베이직 플랜은 바로 활성화
      setUser((prevUser) => ({ ...prevUser, role:'USER' }));
    }else {
      setPage3success(false); // 아무 플랜도 선택하지 않은 경우 비활성화
    }
  }, [
    selected,
    validationCompany,
    validationEnterprise,
    validationStandard
  ]);
  
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
        const fullpaymentCardNo = `${cardNum1}-${cardNum2}-${cardNum3}-${cardNum4}`;
        setPayment((prev) => ({ ...prev, paymentCardNo: fullpaymentCardNo })); // 카드 번호 업데이트
        setValidationEnterprise((prev) => ({ ...prev, paymentCardNo: true })); // 유효성 상태 업데이트
        setValidationStandard((prev) => ({ ...prev, paymentCardNo: true })); // 유효성 상태 업데이트
        setStatusMessage({ message: ``, type: '' }); // 메시지 초기화
      } else {
        setStatusMessage({ message: `유효하지 않은 카드 번호입니다.`, type: 'error' });
        setValidationEnterprise((prev) => ({ ...prev, paymentCardNo: false })); // 유효성 상태 업데이트
        setValidationStandard((prev) => ({ ...prev, paymentCardNo: false })); // 유효성 상태 업데이트
      }
    } else {
      setStatusMessage({ message: ``, type: '' }); // 카드 번호가 모두 입력되지 않은 상태
    }
  };
 
  const page1Handler = (event) => {
    event.preventDefault();
    if(!!page1success){
      setCount(count + 1);
      setStatusMessage({ message: ``, type: '' });
    }else{
      console.log("페이지 1 유효성검사 "+JSON.stringify(validation1))
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
      setUser({...user, name: user.lastName+user.firstName});
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
  
  const PaymentChangeHandler = (e) =>{
    const {name, value} = e.target;
    setPayment({...payment, [e.target.name]: e.target.value});

    
    // 만료일 필드일 경우 MM/YY 형식으로 자동 변환
    if (name === 'paymentCardExpiration') {
      let formattedValue = value.replace(/[^0-9]/g, ''); // 숫자만 남김
      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`;
      }
    
      // 유효성 검사
      if (validateRules.paymentCardExpiration(formattedValue)) {
        setValidationEnterprise((prev) => ({ ...prev, paymentCardExpiration: true }));
        setValidationStandard((prev) => ({ ...prev, paymentCardExpiration: true }));
        setStatusMessage({ message: ``, type: '' });
      } else {
        setValidationEnterprise((prev) => ({ ...prev, paymentCardExpiration: false }));
        setValidationStandard((prev) => ({ ...prev, paymentCardExpiration: false }));
        setStatusMessage({ message: `만료일이 유효하지 않습니다.`, type: 'error' });
      }
      setPayment((prev) => ({ ...prev, paymentCardExpiration: formattedValue }));
      setPayment({...payment, paymentCardExpiration: formattedValue});
      return;
    }

    if(name ==='paymentCardNick' || name === 'paymentCardCvc'){
      setPayment({...payment, [name]: value});
    }
    
    
    if(name==='paymentCardCvc'&&value.length >= 3){
      if( !validateRules[name]?.(value)){
        setStatusMessage({ message: `유효하지 않은 형식입니다.`, type: 'error' });
        setValidationEnterprise((prev) => ({ ...prev, [name]: false}));
        setValidationStandard((prev) => ({ ...prev, [name]: false}));
      }else{
        setStatusMessage({ message: ``, type: '' });
        setValidationEnterprise((prev) => ({ ...prev, [name]: true}));
        setValidationStandard((prev) => ({ ...prev, [name]: true}));
      }
      return;
    }

  }

    const ChangeHandler = (e) => {
        const { name, value } = e.target;
        console.log("체인지 핸들러 1", name, value);
        console.log("체인지 핸들러 1-2",user);

        // 공통적으로 업데이트
        setUser((prevUser) => ({ ...prevUser, [name]: value }));

        if (name === "hp") {
            let formattedValue = value.replace(/[^0-9]/g, ""); // 숫자만 남김

            // 010으로 시작하는 경우: 3자리-4자리-4자리
            if (formattedValue.startsWith("010") && formattedValue.length > 3) {
                formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(3, 7)}${
                    formattedValue.length > 7 ? "-" + formattedValue.slice(7, 11) : ""
                }`;
            } else if (formattedValue.startsWith("011") && formattedValue.length > 3) {
                formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(3, 6)}${
                    formattedValue.length > 6 ? "-" + formattedValue.slice(6, 10) : ""
                }`;
            }

            // 유효성 검사
            if (
                (formattedValue.startsWith("010") && formattedValue.length === 13) || // 010-XXXX-XXXX
                (formattedValue.startsWith("011") && formattedValue.length === 12) // 011-XXX-XXXX
            ) {
                debounce(() => debouncedValidateField(name, formattedValue), 300)();
            }

            setUser((prevUser) => ({ ...prevUser, hp: formattedValue }));
            return;
        }

        if (name === "confirmPwd") {
            if (value !== user.pwd) {
                setStatusMessage({ message: `비밀번호가 일치하지 않습니다.`, type: "error" });
                setValidation1((prev) => ({ ...prev, pwd: false }));
            } else {
                setStatusMessage({ message: `비밀번호가 일치합니다.`, type: "success" });
                setValidation1((prev) => ({ ...prev, pwd: true }));
            }
            return;
        }
   
        if(user.companyName !== null){
          setValidationEnterprise((prev) => ({ ...prev, companyName : true }))
        }

        if (!validateRules[name]) {
            // 유효성 검사 규칙이 없는 필드면 바로 통과
            setStatusMessage({ message: ``, type: "" });
            return;
        }

        if (!validateRules[name]?.(value)) {
            setStatusMessage({ message: `유효하지 않은 형식입니다.`, type: "error" });
            return;
        } else {
            setStatusMessage({ message: ``, type: "" });
            // 검증 결과를 상태에 반영
            if (["firstName", "lastName", "hp"].includes(name)) {
                setValidation2((prev) => ({ ...prev, [name]: true }));
            }
        }

        if(name === 'uid'){
          debounce(() => debouncedValidateField(name, value), 300)();
          return;
        }

        console.log("체인지 핸들러 2 유저", user); // 상태 확인
    };

  function nameChange (field){
    if(field=='uid'){
      return '아이디';
    }else if(field=='hp'){
      return '전화번호';
    }else{
      return'이메일 주소';
    }
  }

  const debouncedValidateField = async (field, value) => {
    const changedName = nameChange(field);
    const data = { type: field, value: value };

    try {
        const response = await axios.post(
            `${baseURL}/api/auth/validation`,
            data,
            { headers: { "Content-Type": "application/json" } }
        );

        if (response.data === "available") {
            setStatusMessage({ message: ` 사용할 수 있는 ${changedName} 입니다.`, type: "success" });
            if (field === "uid") {
                setValidation1((prev) => ({ ...prev, uid: true }));
            } else if (field === "hp") {
                setValidation2((prev) => ({ ...prev, hp: true }));
            }else{
              setValidation1((prev) => ({ ...prev, email: true }));
              return true;
            }
        } else {
            setStatusMessage({ message: ` 이미 사용 중인 ${changedName} 입니다.`, type: "error" });
            if (field === "uid") {
                setValidation1((prev) => ({ ...prev, uid: false }));
            } else if (field === "hp") {
                setValidation2((prev) => ({ ...prev, hp: false }));
            }else{
              setValidation1((prev) => ({ ...prev, email: false }));
              return false;
            }
        }
    } catch {
        setStatusMessage({ message: `확인 중 서버 오류가 발생했습니다.`, type: "error" });
        return false;
    }
};

  const handleEmailChange = async (e) => {
    const { name, value } = e.target;
    setEmail(value);
  
    const valiResult = emailVali(value);
    if (valiResult) {
      const result = await debouncedValidateField(name, value); // 비동기 순서 보장
      console.log("이메일 유효성 결과: ", result);
  
      if (result) {
        await sendEmail(name, value); // 유효성 검사 통과 후 이메일 전송
      }
    }
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value); // 입력한 인증번호 상태 업데이트
  };

  const emailVali = (value) => {
    if (validateRules.email(value) && validateRules.domain(value)){
      setStatusMessage({
        message: '',type: '',
      });
      return true;
    }else{
      setStatusMessage({
        message: '유효하지 않은 이메일 형식입니다.',type: 'error',
      });
      return false;
    }
  }

  async function sendEmail (field, value){
        try {
          const response = await axios.post(`${baseURL}/api/auth/sendmail`,
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
    setUser((prevUser) => ({ ...prevUser, grade: value, company: '', companyName: ''}));
    setPayment((prev)=>({ ...prev,  paymentCardNick: '', paymentCardNo: '', paymentCardExpiration: '',  paymentCardCvc:'', activeStatus: 0, globalPayment: '' }))
    setCard((prev) => ({...prev, cardNum1: '', cardNum2: '', cardNum3: '', cardNum4: '',}));
    resetValidation(setValidationEnterprise, validationEnterprise);
    resetValidation(setValidationStandard, validationStandard);
    resetValidation(setValidationCompany, validationCompany);
    setStatusMessage({ message: '', type: '' });
    setPage3success(false);
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
    setUser((prev) => ({ ...prev, addr1: fullAddress })); // 주소 저장
  };

  const handleClick = () => {
    open({ onComplete: handleComplete }); // Daum Postcode API 열기
  };

  const resetValidation = (setStateFn, state) => {
    setStateFn(
      Object.keys(state).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {})
    );
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    console.log('전송될 데이터:', JSON.stringify({ user, payment }));
    
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

    try {
      const resp = await axios.post(
        `${baseURL}/api/auth/register`,
        { user, payment },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      console.log('회원가입 결과:', resp.data);
  
      // 상태 코드와 응답 데이터에 따른 처리
      if (resp.status === 200) {
        if (resp.data === 'success') {
          setAlert({
            message: '회원가입이 완료되었습니다.',
            type: 'success',
            isOpen: true,
            onClose: false,
          });
          setTimeout(() => {
            navigate('/user/login');
          }, 2000); 
          // navigate('/user/login'); // 성공 시 로그인 페이지로 이동
        } else if (resp.data === 'not found company') {
          setAlert({
            message: '올바른 회사코드를 입력해주십시오.',
            type: 'error',
            isOpen: true,
            onClose: false,
          });
        }
      } else if (resp.status === 400) {
        setAlert({
          message: '잘못된 요청입니다. 회사 코드를 다시 확인하세요.',
          type: 'error',
          isOpen: true,
          onClose: false,
        });
      } else {
        setAlert({
          message: '예기치 않은 오류가 발생했습니다. 다시 시도해주세요.',
          type: 'error',
          isOpen: true,
          onClose: false,
        });
      }
    } catch (error) {
      // HTTP 상태 코드 확인
      if (error.response?.status === 400) {
        setAlert({
          message: '회사 코드를 다시 확인해주세요.',
          type: 'error',
          isOpen: true,
          onClose: false,
        });
        setTimeout(() => {
          navigate('/user/register', { replace: true }); // replace: true는 현재 히스토리 엔트리를 대체
          window.location.reload(); // 페이지 새로고침
        }, 2000); 
      } else if (error.response?.status === 500) {
        setAlert({
          message: '서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          type: 'error',
          isOpen: true,
          onClose: false,
        });
      } else {
        setAlert({
          message: '서버 요청 중 알 수 없는 오류가 발생했습니다.',
          type: 'error',
          isOpen: true,
          onClose: false,
        });
      }
  
      console.error('Error Response:', error.response);
      console.error('Error Message:', error.message);
    }
  };

  const CompanyChangeHandler = (e) => {
    const value = e.target.value;
    setUser({...user, company:value});
    setValidationCompany({company:true});
    console.log(value, user, validationCompany,"컴퍼니 코드");
  }
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
              <Link to="/user/login" className='flex items-center'>
                {/* <img src="/images/logo_center(purple).png" alt="logo" className="w-[45px]" />
                <span className="ml-2 text-2xl font-extrabold text-[#333366] hover:text-indigo-500 transition-colors duration-300">
                  PLANTRY
                </span> */}
                <img src='/images/plantry_logo.png' className='w-[45px] h-[45px]'></img>
                <div className='flex items-center font-bold text-[24px] font-purple'>PLANTRY</div>
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
                  name='email'
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
                <input type='text' placeholder='전화번호 -를 제외하고 입력해주세요.' maxLength={13}
                name='hp' value={user.hp} onChange={ChangeHandler}
                className="signup-input-lg mt-10" ></input>
                <input type='text' placeholder='주소(선택)' onClick={() => handleClick()}
                name='addr1' value={user.addr1} onChange={ChangeHandler}
                className="signup-input-lg mt-10" ></input>
                <div className='flex justify-between '>
                  <input type='text' placeholder='상세주소(선택)' name='addr2' value={user.addr2}
                  onChange={(e) => setUser(prev => ({...prev, "addr2": e.target.value}))}
                  className="signup-input-md mr-1 mt-10" ></input>
                  <select name="country" className="signup-input-md mt-10" onChange={ChangeHandler}>
                    <option name="country" value="NotSelected" selected>선택 안 함</option>
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
                      name='company' value={user.company} onChange={CompanyChangeHandler}
                      className="signup-input-lg mt-10" ></input>
                    </>
                  }
                  {
                    selected === 'Enterprise' && 
                    <>
                    <p className='text-sm custom-mt-30'>회사 정보를 입력해주세요.</p>
                      <input type='text' placeholder='회사명'
                      name='companyName' value={user.companyName} 
                      onChange={ChangeHandler}
                      className="signup-input-lg mt-10" ></input>
                      <div className='grid grid-cols-2 gap-2 mt-10'>
                        <select name='cardCompany' 
                        onChange={(event) => setPayment({ ...payment, cardCompany: event.target.value })} 
                        className="w-full input-lg h-[50px]">
                            <option name='cardCompany' value="신한">신한</option>
                            <option name='cardCompany' value="국민">국민</option>
                            <option name='cardCompany' value="현대">현대</option>
                            <option name='cardCompany' value="카카오뱅크">카카오뱅크</option>
                            <option name='cardCompany' value="우리">우리</option>
                            <option name='cardCompany' value="NH농협">NH농협</option>
                            <option name='cardCompany' value="하나">하나</option>
                            <option name='cardCompany' value="롯데">롯데</option>
                            <option name='cardCompany' value="삼성">삼성</option>
                            <option name='cardCompany' value="IBK기업은행">IBK기업은행</option>
                            <option name='cardCompany' value="BC">BC</option>
                        </select> 
                        <select className="input-lg" name="globalPayment" 
                        onChange={(event) => setPayment({ ...payment, globalPayment: event.target.value })} 
                        >
                          <option defaultChecked value="0">해외겸용</option>
                          <option name="globalPayment" value="1">MarsterCard</option>
                          <option name="globalPayment" value="2">VISA</option>
                          <option name="globalPayment" value="3">AmericanExpress</option>
                        </select>
                      </div>
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
                        name='paymentCardNick' value={payment.paymentCardNick} onChange={PaymentChangeHandler}
                        className="card-inp1 mr-1 text-gray-600" ></input>
                        <input type='text' placeholder='MM/YY'
                        name='paymentCardExpiration' value={payment.paymentCardExpiration} onChange={PaymentChangeHandler}
                        className="card-inp2 mr-1 text-gray-600" maxLength={5} ></input>
                        <input type='text' placeholder='cvc'
                        name='paymentCardCvc' value={payment.paymentCardCvc} onChange={PaymentChangeHandler}
                        className="card-inp2 mr-1 text-gray-600 no-spin" maxLength={3}  ></input>
                      </div>
                      <label className='flex items-center mt-10'>
                        <input type="checkbox" name="activeStatus" onChange={handleCheckboxChange}/>
                        <span className='text-sm ml-2'>자주 사용하는 카드로 등록하시겠습니까?</span>
                      </label>
                      {/* <label className='flex items-center'>
                        <input type="checkbox" name="autoPayment"/>
                        <span className='text-sm ml-2'>자동으로 결제하시겠습니까?</span>
                      </label> */}
                    </>
                  }
                  {
                    selected === 'Standard' && 
                    <>
                    <p className='text-sm custom-mt-30'>결제 정보를 입력해주세요.</p>
                    <div className='grid grid-cols-2 gap-2 mt-10'>
                        <select name='cardCompany' 
                        onChange={(event) => setPayment({ ...payment, cardCompany: event.target.value })} 
                        className="w-full input-lg h-[50px]">
                            <option name='cardCompany' value="신한">신한</option>
                            <option name='cardCompany' value="국민">국민</option>
                            <option name='cardCompany' value="현대">현대</option>
                            <option name='cardCompany' value="카카오뱅크">카카오뱅크</option>
                            <option name='cardCompany' value="우리">우리</option>
                            <option name='cardCompany' value="NH농협">NH농협</option>
                            <option name='cardCompany' value="하나">하나</option>
                            <option name='cardCompany' value="롯데">롯데</option>
                            <option name='cardCompany' value="삼성">삼성</option>
                            <option name='cardCompany' value="IBK기업은행">IBK기업은행</option>
                            <option name='cardCompany' value="BC">BC</option>
                        </select> 
                        <select className="input-lg" name="globalPayment" 
                        onChange={(event) => setPayment({ ...payment, globalPayment: event.target.value })} 
                        >
                          <option defaultChecked value="0">해외겸용</option>
                          <option name="globalPayment" value="1">MarsterCard</option>
                          <option name="globalPayment" value="2">VISA</option>
                          <option name="globalPayment" value="3">AmericanExpress</option>
                        </select>
                      </div>
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
                        name='paymentCardNick' value={payment.paymentCardNick} onChange={PaymentChangeHandler}
                        className="card-inp1 mr-1 text-gray-600" ></input>
                        <input type='text' placeholder='MM/YY'
                        name='paymentCardExpiration' value={payment.paymentCardExpiration} onChange={PaymentChangeHandler}
                        className="card-inp2 mr-1 text-gray-600" maxLength={5} ></input>
                        <input type='text' placeholder='cvc'
                        name='paymentCardCvc' value={payment.paymentCardCvc} onChange={PaymentChangeHandler}
                        className="card-inp2 mr-1 text-gray-600" maxLength={3}  ></input>
                      </div>
                      <label className='flex items-center mt-10'>
                        <input type="checkbox" name="activeStatus" onChange={handleCheckboxChange}/>
                        <span className='text-sm ml-2'>자주 사용하는 카드로 등록하시겠습니까?</span>
                      </label>
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
