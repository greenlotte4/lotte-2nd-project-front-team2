import { useEffect, useState } from "react";
import useOnClickOutSide from "../message/useOnClickOutSide"; 
import axiosInstance from "../../services/axios";
import CustomAlert from "../Alert";

const validatePwd =  (pwd) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pwd);

export const PassModal = ({ isOpen, onClose , text, showMoreRef}) => {
  if (!isOpen) return null;
  const [passStatus, setPassStatus] = useState(0);
  const [confirmPass, setConfirmPass] = useState('');
  const [confirmPassResult, setConfirmPassResult] = useState('');
  const [passMatchResult, setPassMatchResult] = useState('');
  const [status, setStatus] = useState(false);
  const [pass, setPass] = useState({
    pwd: '',
    pwd2: '',
  });

  
  const [alertClass, setAlertClass] = useState("");
  const [alert, setAlert] = useState({ message: '', type: '', isOpen: false, onClose: false });

  const closeAlert = () => {
      setAlert({ message: '', type: '', isOpen: false, onClose: false });
  };
  useEffect(() => {
      if (alert.isOpen) {
          let timer = setTimeout(() => {
              setAlertClass("fade-out"); // fade-out 클래스 추가
              setTimeout(() => {
                  setAlert({ message: '', type: '', isOpen: false, onClose: false });
                  onClose(false);
              }, 300); // 애니메이션 후 alert 닫기
          }, 500); // 3초 뒤 애니메이션 시작

          return () => clearTimeout(timer); // 타이머 정리
      }
  }, [alert.isOpen]);
  const showAlert = (message, type = 'success') => {
      setAlert({
          message,
          type,
          isOpen: true,
          onClose: false,
      });
      setAlertClass(''); // fade-out 클래스 제거
  };

  // 모달 외부 클릭 시 닫힘 처리
  useOnClickOutSide(showMoreRef, onClose);

  const nextPage = (e) => {
    e.preventDefault();
    if(!!status){
      setPassStatus(1)
    }else{
      setConfirmPassResult('비밀번호 검증을 마쳐주세요.')
    }
  }
  const prevPage = (e) => {
    e.preventDefault();
    setPassStatus(0);
    setConfirmPassResult('');
    setStatus(false);
  }

  const changeConfirmPass = (e) => {
    const value = e.target.value;
    console.log(value);
    setConfirmPass(value);
  }
  const changePass = (e) => {
    const {name, value} = e.target;
    console.log("비번 ",name, value)
    setPass((prevState) => ({
      ...prevState,  // 기존 상태 유지
      [name]: value, // 입력값 업데이트
    }));

    // 비밀번호 유효성 체크 및 일치 여부 확인
    if (name === 'pwd') {
      if (!validatePwd(value)) {
        setPassMatchResult('비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.');
      } else {
        setPassMatchResult('');
      }
    }

    if (name === 'pwd2') {
      if (value !== pass.pwd) {
        setPassMatchResult('비밀번호가 일치하지 않습니다.');
      } else {
        setPassMatchResult('');
      }
    }
  }

  const confirmPassHandler = async (e) => {
    e.preventDefault();
    try{
      const resp = await axiosInstance.post('/api/my/confirmPass', {pwd: confirmPass});
      console.log(resp.data+resp.status+" 결과");
      if(resp.status == 200){
        setConfirmPassResult('확인되었습니다. 다음 버튼을 눌러 비밀번호를 변경하세요.');
        setStatus(true);
      }
    }catch(err){
      console.log(err)
      setConfirmPassResult('비밀번호를 틀렸습니다.');
      setStatus(false);
    }
  }

  const updatePassHandler = async (e) => {
    e.preventDefault();
    if (!validatePwd(pass.pwd)) {
      setPassMatchResult('비밀번호 조건을 충족해주세요.');
      return;
    }
    if (pass.pwd !== pass.pwd2) {
      setPassMatchResult('비밀번호가 일치하지 않습니다.');
      return;
    }

    try{
      const resp = await axiosInstance.post('/api/my/updatePass', {pwd: pass.pwd});
      if(resp.status == 200){
        console.log("비번 변경 완료");
        setAlert({message: '비밀번호 변경이 완료되었습니다.', isOpen: true, type:'success', onClose: false})
      }
    }catch(err){
      console.log(err);
      setAlert({message: '변경 중 오류가 발생했습니다. 다시 시도해 주세요.', isOpen: true, type:'error', onClose: false})
    }
  }


return (
    <div 
    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-custom-fixed"
    >
      <div className={`alert-container ${alertClass}`}>
        <CustomAlert
            type={alert.type}
            message={alert.message}
            isOpen={alert.isOpen}
            onClose={closeAlert}
        />
      </div>
      <div ref={showMoreRef}  
      className="bg-white rounded-t-xl rounded-b-md shadow-lg max-w-2xl w-full modal-custom-width">
        <div className="flex justify-between items-center py-5 px-12 bg-white rounded-t-xl">
            <span className="text-lg text-gray-700 font-bold">{text}</span>
            <button 
            onClick={onClose}
            className="text-md float-right display-block font-bold text-gray-600 hover:text-gray-900"
            >
            <img className="h-[15px]" src="/images/close-icon.png" alt="close" />
            </button>
        </div>
        <div className="mx-12">
          {text === '비밀번호 변경' && passStatus === 0 &&
            <>
              <div className="alert-yeollow rounded-lg mt-10 w-full h-[50px] flex items-center px-[20px] py-10">
              먼저 비밀번호를 확인하셔야 합니다.
              </div>
              <div className="border w-full h-[50px] mt-[30px] rounded-lg flex items-center" >
                <input type="password" className="w-full h-[45px] rounded indent-3" 
                placeholder="비밀번호를 입력해주세요." 
                name="confirmPass" onChange={changeConfirmPass}
                />
                <button onClick={confirmPassHandler} 
                className="bg-gray-200 text-gray-800 hover:bg-gray-300
                 mr-2 h-[38px] rounded px-6 w-1/6">확인</button>
              </div>
              <span className="text-sm ml-2 text-gray-600">{confirmPassResult}</span>
              <button 
                className={`float-right btn-profile bg-indigo-500 text-white
                mt-[50px] mb-[20px] ${status? 'hover:bg-indigo-600':'opacity-70'}`}
                onClick={nextPage}
              >다음</button>
            </>
          }
          {text === '비밀번호 변경' && passStatus === 1 &&
            <>
              <div className="alert-yeollow rounded-lg mt-10 w-full h-[50px] flex items-center px-[20px] py-10">
              보안 강화를 위해 영문, 숫자, 특수기호를 포함하여 8자리 이상의 비밀번호를 만드세요.
              </div>
              <div>
                <input type="password" className="border w-full h-[50px] rounded  indent-3 mt-[20px]" placeholder="비밀번호를 입력해주세요."
                name="pwd" onChange={changePass}
                />
                <input type="password" className="border w-full h-[50px] rounded  indent-3 mt-10" placeholder="비밀번호를 다시 입력해주세요." 
                name="pwd2" onChange={changePass}
                />
              </div>
              <span className="text-sm ml-2 text-gray-600">{passMatchResult}</span>
              <div className="flex justify-between  mb-[30px]">
                <button className="float-right btn-profile border border-indigo-500 text-indigo-700 mt-[50px]"
                onClick={prevPage}
                >이전</button>
                <button className="float-right btn-profile bg-indigo-500 text-white mt-[50px] hover:bg-indigo-600"
                onClick={updatePassHandler}
                >비밀번호 변경</button>
              </div>
            </>
          }
        </div>
        
      </div>
    </div> 
  );
};
