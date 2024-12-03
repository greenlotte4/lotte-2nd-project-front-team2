import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomAlert from "../../components/Alert";


export default function Terms() {

  const navigate = useNavigate();
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');

  const [checkbox, setCheckbox] = useState({
    term1: false,
    term2: false,
    term3: false,
  });

  const closeAlert = () =>{
    setAlert(false)
  }

  const ChangeCheckbox = (e) => {
    const {name, checked} = e.target;
    setCheckbox((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const allChecked = Object.values(checkbox).every(Boolean);

  const NextHandler = (e) => {
    e.preventDefault();
    if(allChecked){
      navigate("/user/register")
    }else{
      alert('sdfafs')
      setAlert(true)
      setMessage("필수항목 체크 후 가입하실 수 있습니다.")
      setType("warning")
    }
  }

    return (
      <div className='terms-container'>
        <CustomAlert
          type={type}  
          message={message}
          onClose={closeAlert} 
          isOpen={alert}
        />
        <div className='login-form'>
          <div className="flex justify-between items-start">
              <p className='text-3xl font-light'>REGISTER</p>
              <Link to="/user/login">
                <img src="/images/Logo_font.png" alt="logo" className="w-[110px] h-[35px]" />
              </Link>
          </div>
          <div className='inp-box'>
            <div>
              <p className="text-sm ml-2">
                (<span>필수</span>)
                서비스 이용약관
              </p>
              <div name="" id="" className="terms-text mt-1">이용약관</div>
              <label className="flex justify-end items-center text-sm mt-1">
                <input name="term1" type="checkbox" className="mr-1"
                checked={checkbox.term1} onChange={ChangeCheckbox}/>
                동의합니다.
              </label>
            </div>
            <div>
              <p className="text-sm ml-2">
                (<span>필수</span>)
                서비스 이용약관
              </p>
              <div name="" id="" className="terms-text mt-1">이용약관</div>
              <label className="flex justify-end items-center text-sm mt-1">
                <input name="term2" type="checkbox" className="mr-1"
                checked={checkbox.term2} onChange={ChangeCheckbox}/>
                동의합니다.
              </label>
            </div>
            <div>
              <p className="text-sm ml-2">
                (<span>필수</span>)
                서비스 이용약관
              </p>
              <div name="" id="" className="terms-text mt-1">이용약관</div>
              <label className="flex justify-end items-center text-sm mt-1">
                <input name="term3" type="checkbox" className="mr-1"
                checked={checkbox.term3} onChange={ChangeCheckbox}/>
                동의합니다.
              </label>
              </div>
            <div className="flex justify-between custom-mt-30">
              <button
                className="btn-prev"
                onClick={() => navigate("/user/login")}
              >이전</button>
              <button className={`btn-next ${allChecked ? "":"opacity-80"}`} 
              onClick={NextHandler}
              disabled={!allChecked}
              >다음</button>
            </div>
          </div>
        </div>
      </div>
    )
}
