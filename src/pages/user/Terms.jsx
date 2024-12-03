import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomAlert from "../../components/Alert";
import axiosInstance from "../../services/axios";


export default function Terms() {

  const navigate = useNavigate();
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');
  const [terms, setTerms] = useState([]);

  const [checkbox, setCheckbox] = useState({});

  useEffect(() => {
    // Fetch terms from the backend
    axiosInstance.get("/api/auth/terms")
      .then((response) => {
        const data = response.data;
        setTerms(data);
        // Initialize checkboxes dynamically based on the terms
        const initialCheckboxState = {};
        data.forEach(term => {
          initialCheckboxState[`term${term.id}`] = false;
        });
        setCheckbox(initialCheckboxState);
      })
      .catch((error) => {
        console.error("Error fetching terms:", error);
        setAlert(true);
        setMessage("이용약관을 가져오는 중 오류가 발생했습니다.");
        setType("error");
        closeAlert();
      });
  }, []);

  const closeAlert = () => {
    setTimeout(() => {
      setAlert(false);
    }, 3000); // 3초 뒤에 alert를 닫음
  };

  const ChangeCheckbox = (e) => {
    const { name, checked } = e.target;
    setCheckbox((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const allChecked = Object.values(checkbox).every(Boolean);

  const NextHandler = (e) => {
    e.preventDefault();
    if (allChecked) {
      navigate("/user/register");
    }
    else{
      console.log(";sdaflsfj")
      setAlert(true);
      setMessage("모든 필수 항목에 동의해주세요.");
      setType("warning");
      closeAlert();
    }
  };

  return (
    <div className='terms-container'>
      <div className='login-form'>
        <div className="flex justify-between items-start">
          <p className='text-3xl font-light'>REGISTER</p>
          <Link to="/user/login">
            <img src="/images/Logo_font.png" alt="logo" className="w-[110px] h-[35px]" />
          </Link>
        </div>
        <div className='inp-box'>
          {terms.map((term) => (
            <div key={term.id}>
              <p className="text-sm ml-2">
                ({term.necessary === 1 ? "필수" : "선택"})
                {term.title}
              </p>
              <div className="terms-text mt-1 overflow-y-scroll scrollbar-none"
              dangerouslySetInnerHTML={{ __html: term.content }}
              ></div>
              <label className="flex justify-end items-center text-sm mt-1">
                <input
                  name={`term${term.id}`}
                  type="checkbox"
                  className="mr-1"
                  checked={checkbox[`term${term.id}`] || false}
                  onChange={ChangeCheckbox}
                />
                동의합니다.
              </label>
            </div>
          ))}
          <div className="flex justify-between custom-mt-30">
            <button
              className="btn-prev"
              onClick={() => navigate("/user/login")}
            >이전</button>
            <button
              className={`btn-next ${allChecked ? "" : "opacity-80"}`}
              onClick={NextHandler}
            >다음</button>
          </div>
          {alert && (
          <CustomAlert
            type={type}  // 알림의 타입 (success, error, info , basic 등)
            message={message}
            onClose={() => setAlert(false)}  
            isOpen={alert}
          />
        )}
        </div>
      </div>
    </div>
  );
}
