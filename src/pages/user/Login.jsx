import React, { useEffect, useState } from 'react'
import '@/pages/user/Login.scss'
import axiosInstance from '@/services/axios.jsx'
import { Link, useNavigate } from 'react-router-dom'
import CustomInput from '@/components/Input';
import { CustomButton } from '@/components/Button';
import { CustomGubun } from '@/components/Gubun';
import { Modal } from '@/components/Modal';
import CustomAlert from '@/components/Alert';
import { CustomMessage } from '@/components/Message';


export default function Login() {
    const navigate = useNavigate();

    const [uid, setUid] = useState('');
    const [pwd, setPwd] = useState('');
    const [token, setToken] = useState('');
    const [isModal, setIsModal] = useState(true);
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('');
    const [msg, setMsg] = useState(false);
    const [role, setRole] = useState("");
  
    const changeHandler = (e)=>{
      if(e.target.name === 'uid'){
        setUid(e.target.value)
      } else if (e.target.name === 'pwd'){
        setPwd(e.target.value)
      }
    }
    const submitData = ()=> {
      const data = {
        "uid" : uid,
        "pwd" : pwd
      }
      axiosInstance
        .post("/api/user/login",data)
        .then((resp)=>{
          if(resp.status === 200){
            const token = resp.data.token; 
            const role = resp.data.role;
            setToken(token);
            setRole(role);
            console.log('로그인 성공, 토큰:', token);
  
            localStorage.setItem('token', token);
            setAlert(true)
            setMessage("로그인 성공하였습니다.")
            setType("success")
          }
          
        })
        .catch((err)=>{
          if (err.status === 404){
            setAlert(true)
            setMessage("없는 계정입니다.")
            setType("warning")
          }
        })
    }
  
    const signUp = () => {
      navigate("/user/terms")
    }
  
    const closeModal = () => {
      setIsModal(false)
    }
  
    const closeAlert = () =>{
      setAlert(false)
    }
  
    const closeMsg = () => {
      setMsg(false);
    }
  
    const openMsg = () => {
  
    }
  
    useEffect(() => {
      if (!alert&&token) {
        if(role === 'COMPANY'){
          navigate("/admin")
        } else {
          navigate("/my")
        }
          
      }
    }, [alert]);
  
    useEffect(() => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        setToken(savedToken);
      }
    }, []);
  
    return (
      <div className='login-container'>
        <div className='login-form'>
        <div className="flex justify-between items-start">
              <p className='text-3xl font-extralight'>LOGIN</p>
              <Link to="/user/login">
                <img src="/images/Logo_font.png" alt="logo" className="w-[110px] h-[35px]" />
              </Link>
          </div>
          <div className='inp-box'>
            <p className='text-xs inp-font'>id</p>
            <CustomInput
              mb="m"
              type="text"
              name="uid"
              handler={changeHandler}
              placeholder="아이디를 입력해주세요."
              value={uid}
              size="xl"
            />
            <p className='text-xs inp-font'>password</p>
            <CustomInput 
              mb="sm"
              type="password"
              name="pwd"
              handler={changeHandler}
              placeholder="비밀번호를 입력해주세요."
              value={pwd}
              size="xl"
            />
            <div className='find-pwd'>
              <p className='text-xs' onClick={() => navigate("/user/find")}>Forget password?</p>
            </div>
            <CustomButton 
              type="button"
              handler={submitData}
              color="white"
              bg="green"
              size="xl"
              text="Sigh In"
              mb="m"
            />
            <CustomButton 
              type="button"
              handler={signUp}
              color="white"
              bg="blue"
              size="xl"
              text="Sigh Up"
            />
          </div>
          <CustomGubun 
            gubun="basic"
            text="Or Use"
          />
  
        {alert && (
          <CustomAlert
            type={type}  // 알림의 타입 (success, error, info , basic 등)
            message={message}
            onClose={closeAlert}  // onClose는 closeAlert 함수로 전달
          />
        )}
        {msg &&(
          <CustomMessage 
            message = "읽지않은 메시지 몇개"
            onClose={closeMsg}
            onClick={openMsg}
          />
        )}
        {/* {isModal && (
          <Modal 
            isOpen={isModal}
            onClose={closeModal}
            children="모달테스트"
            text="OOO모달"
          />
        )} */}
          <div className='social-login'>
  
          </div>
        </div>
      </div>
    
    )
}
