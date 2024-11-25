import { useEffect, useState } from "react";
import axiosInstance from '@/services/axios.jsx'
import MemberAddressModal from "./MemberAddressModal";
import CustomAlert from "../Alert";
export default function DepartmentModal({ isOpen, onClose , text }) {
    if (!isOpen) return null;
    //                                              useState                                             //
    const [user, setUser] = useState([])
    const [user2, setUser2] = useState([])
    const [selectedLeader , setSelectedLeader] = useState("");
    const [depName, setDepName] = useState("");
    const [depDiscription, setDepDiscription] = useState("");
    const [members, setMembers] = useState([]);
    const [addressIsOpen, setAddressIsOpen] = useState(false);
    const [addressIsOpen2, setAddressIsOpen2] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [link,setLink] = useState(true)
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [alert, setAlert] = useState(false);
    //                                              useState                                             //

    //                                              useEffect                                               //
    
    //                                              useEffect                                               //
    const getMembers = () => {
      axiosInstance
        .get("/api/users")
        .then((resp) => {
            if(resp.status === 200){
              const users = resp.data;
              setUser(users);  
            }
        })
        .catch()
        setAddressIsOpen(true)
        
    }

    const getMembers2 = () => {
      axiosInstance
        .get("/api/users")
        .then((resp) => {
            if(resp.status === 200){
              const users = resp.data;
              setUser2(users);  
              setAddressIsOpen2(true)
            }
        })
        .catch()
        
    }
    
    const selectLeader = (e) => {
        setSelectedLeader(e.target.dataset.id)
        setAddressIsOpen(false)
    }

    const changeDepName = (e) => {setDepName(e.target.value)}

    const changeDepDiscription = (e) => {setDepDiscription(e.target.value)}

    const changeLink = (e) => {setLink(e.target.value)}

    const makeDep = (e) => {
      const data = {
        "name" : depName,
        "discription" : depDiscription,
        "leader" : selectedLeader,
        "members" : selectedMembers.map(v => v.id),
        "link" : link
      }
      console.log(data)
      axiosInstance
        .post("/api/department",data)
        .then((resp)=>{
            if(resp.status === 200){
              setAlert(true)
              setType("success")
              setMessage("부서 등록이 성공하엿습니다.")
              setDepName('');
              setDepDiscription('');
              setSelectedLeader(null);
              setSelectedMembers([]);
              setLink('');
              setTimeout(() => {
                setAlert(false);  // 알림 숨기기
              }, 3000);
            }
        })
        .catch()
    }

    const closeAlert = () => {setAlert(false)}

    const updateMembers = () => {
        setAddressIsOpen2(false)
    }

    const selectBox = (e) => {
        const newId = e.target.dataset.id;
        const newUid = e.target.dataset.uid;
        const newEmail = e.target.dataset.email;
        const isChecked = e.target.checked; // 체크 상태 확인
      
        if (isChecked) {
          // 체크박스가 선택되었을 경우
          setMembers(prevMembers => {
            const updatedMembers = [...prevMembers, { id: newId, uid: newUid, email: newEmail }];
            setSelectedMembers(updatedMembers); // selectedMembers도 업데이트
            return updatedMembers;
          });
        } else {
          // 체크박스가 해제되었을 경우
          setMembers(prevMembers => {
            const updatedMembers = prevMembers.filter(member => member.id !== newId);
            setSelectedMembers(updatedMembers); // selectedMembers도 업데이트
            return updatedMembers;
          });
        }
      };

    const closeAddress = () => {setAddressIsOpen(false)}
    const closeAddress2 = () => {setAddressIsOpen2(false)}
    
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-custom-fixed">
        <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full modal-custom-width">
            <div className="display-flex mb-8 py-5 px-12 bg-gray-300 rounded-t-2xl">
                <span className="text-2xl">{text}</span>
                <button 
                onClick={onClose}
                className="text-xl float-right display-block font-bold text-gray-600 hover:text-gray-900"
                >
                닫기
                </button>
            </div>
            <div className="modal-content mx-12">
            <div className="flex gap-8 mb-4 justify-start items-center">
              <span className="w-20">이름</span>
              <div>
                <input value={depName} onChange={changeDepName} className="h-10 w-72 border rounded-md p-2 text-xs" placeholder="부서 이름"></input>
              </div>
            </div>
            <div className="flex gap-8 mb-4 justify-start items-center">
              <span className="w-20">설명</span>
              <div>
                <input value={depDiscription} onChange={changeDepDiscription} className="h-10 w-72 border rounded-md p-2 text-xs" placeholder="부서 설명"></input>
              </div>
            </div>
            <div className="flex gap-8 mb-8 justify-start items-start">
              <span className="w-20">부서장</span>
              <div className="flex flex-col gap-4 scrollbar-none overflow-scroll max-h-40">
                <div className="flex gap-2">
                  <input className="h-10 w-52 border rounded-md p-2 text-xs" placeholder="구성원 또는 조직으로 검색"></input>
                  <button onClick={getMembers} className="border h-10 w-20 rounded-md px-3 text-xs text-gray-400 bg-gray-100">주소록</button>
                </div>
                {selectedLeader && 
                <>
                    {user
                    .filter(v => v.id == selectedLeader)  // selectedLeader와 일치하는 항목만 필터링
                    .map(v => (
                    <div className="flex gap-6" key={v.id}>
                      <img src="/images/document-folder-profile.png" alt="User profile" className="cursor-pointer"  data-id={v.id} />
                      <div className="flex flex-col justify-between">
                        <p className="text-xs">{v.uid}</p>
                        <p className="text-xs text-gray-400">{v.email}</p>
                      </div>
                      <div className="flex items-center">
                        <select className="outline-none text-xs text-center text-gray-400">
                          <option>읽기</option>
                          <option>쓰기</option>
                          <option>모든권한</option>
                        </select>
                      </div>
                    </div>
                    ))
                    }
                </>
                }
              </div>
            </div>
            <div className="flex gap-8 mb-8 justify-start items-start">
              <span className="w-20">부서원</span>
              <div className="flex flex-col gap-4 scrollbar-none overflow-scroll max-h-40">
                <div className="flex gap-2">
                  <input className="h-10 w-52 border rounded-md p-2 text-xs" placeholder="구성원 또는 조직으로 검색"></input>
                  <button onClick={getMembers2} className="border h-10 w-20 rounded-md px-3 text-xs text-gray-400 bg-gray-100">주소록</button>
                </div>
                <>
                {selectedMembers.map(v => {
                return (
                    <div className="flex justify-between" key={v.id}>
                      <div className="flex gap-4">
                        <img src="/images/document-folder-profile.png" alt="User profile" className="cursor-pointer"  data-id={v.id}/>
                        <div className="flex flex-col justify-between">
                            
                            <p className="text-xs">{v.uid}</p>
                            <p className="text-xs text-gray-400">{v.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <select className="outline-none text-xs text-center text-gray-400">
                          <option>읽기</option>
                          <option>쓰기</option>
                          <option>모든권한</option>
                        </select>
                      </div>
                    </div>
                );
                })}
                </>
              </div>
            </div>
            <div className="flex gap-8 mb-8 justify-start items-center">
              <span className="w-20">링크 공유</span>
              <div>
                <select onChange={changeLink} className="h-10 w-72 border rounded-md p-2 text-xs outline-none text-center">
                  <option value={true}>허용함</option>
                  <option value={false}>허용안함</option>
                </select>
              </div>
            </div>
            <div className="mb-8 flex justify-end gap-2 mb-8">
              <button onClick={onClose} className="bg-gray-100 w-20 h-8 rounded-md text-xs">취소</button>
              <button onClick={makeDep} className="bg-purple white w-20 h-8 rounded-md text-xs">만들기</button>
            </div>
            </div>
        </div>
        <CustomAlert 
              type={type}  // 알림의 타입 (success, error, info , basic 등)
              message={message}
              onClose={closeAlert}
              isOpen={alert}
        />
        <MemberAddressModal 
        isOpen={addressIsOpen}
        onClose={closeAddress}
        text="부서장등록"
        data={user}
        changeHandler={selectLeader}
        />
        <MemberAddressModal 
        isOpen={addressIsOpen2}
        onClose={closeAddress2}
        text="부서원등록"
        data={user2}
        updateMembers = {updateMembers}
        selectBox = {selectBox}
        />
    </div>
  )
}
