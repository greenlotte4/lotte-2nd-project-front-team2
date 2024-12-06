import { useEffect, useState } from "react";
import axiosInstance from '@/services/axios.jsx'
import MemberAddressModal from "./MemberAddressModal";
import CustomAlert from "../Alert";
import GetAddressModal from "../calendar/GetAddressModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CustomSVG } from "../project/_CustomSVG";
export default function DepartmentModal({ isOpen, onClose , text }) {
    const [selectedLeader , setSelectedLeader] = useState({});
    const [depName, setDepName] = useState("");
    const [depDescription, setDepDescription] = useState("");
    const [link,setLink] = useState(1)
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [alert, setAlert] = useState(false);
    const [openAddress, setOpenAddress] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const queryClient = useQueryClient();

    const cancleSelectedUsersHandler = (e,user) => {
      setSelectedUsers((prev)=>{
          return prev.filter((selectedUser) => selectedUser.id !== user.id);
      })
    }

    const postDepartmentMutation = useMutation({
      mutationFn : async () => {
        try {
          const resp = await axiosInstance.post("/api/admin/group/department",{
            depName,
            depDescription,
            leader : selectedLeader.id,
            users : selectedUsers.map(v=>v.id),
            link
          })
          return resp.data
        } catch (err) { 
          return err;
        }
      },
      onSuccess : (data) => {
        setDepDescription('')
        setDepName('')
        setSelectedLeader({})
        setSelectedUsers([])
        setLink(1)
        setAlert(true)
        setMessage(data)
        setType("success")
        queryClient.invalidateQueries(['departments']);
        setTimeout(() => {
          setAlert(false);
          onClose();
        }, 1000);
      },
      onError : (err) => {
        setAlert(true)
        setMessage(err)
        setType("error")

        setTimeout(() => {
          setAlert(false);
        }, 1000);
      },
    })

    const postTeamMutation = useMutation({
      mutationFn : async () => {
        try {
          const resp = await axiosInstance.post("/api/admin/group/team",{
            depName,
            depDescription,
            leader : selectedLeader.id,
            users : selectedUsers.map(v=>v.id),
            link
          })
          return resp.data
        } catch (err) { 
          return err;
        }
      },
      onSuccess : (data) => {
        setDepDescription('')
        setDepName('')
        setSelectedLeader({})
        setSelectedUsers([])
        setLink(1)

        setAlert(true)
        setMessage(data)
        setType("success")
        queryClient.invalidateQueries(['departments']);
        setTimeout(() => {
          setAlert(false);
          onClose();
        }, 1000);

        
      },
      onError : (err) => {
        setAlert(true)
        setMessage(err)
        setType("error")

        setTimeout(() => {
          setAlert(false);
        }, 1000);
      },
    })

    const postDepartmentHandler = async () => {
      try {
        await postDepartmentMutation.mutateAsync();
      } catch (err) {
        console.log(err)
      }
    }

    const postTeamHandler = async () => {
      try {
        await postTeamMutation.mutateAsync();
      } catch (err) {
        console.log(err)
      }
    }

    if (!isOpen) return null;
    
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <CustomAlert 
          type={type}
          message={message}
          isOpen={alert}
        />
        <div className="bg-white rounded-2xl shadow-lg w-[800px] min-h-[500px] max-h-[800px] overflow-scroll scrollbar-none">
            <div className="display-flex mb-8 py-3.5 px-12 bg-white border-b rounded-t-2xl z-10 sticky top-0">
                <span className="text-xl font-bold">{text}</span>
                <button 
                onClick={onClose}
                className="text-xl float-right display-block font-bold text-gray-600 hover:text-gray-900"
                >
                <CustomSVG id="close" color='currentColor' />
                </button>
            </div>
            <div className="mx-[100px]">
            <div className="flex gap-8 mb-4 justify-start items-center">
              <span className="w-[100px]">이름</span>
              <div>
                {
                  (text=='부서 생성')
                  ?
                  (
                    <input value={depName} onChange={(e)=>setDepName(e.target.value)} className="h-10 w-[472px] border rounded-md p-2 text-xs" placeholder="부서 이름"></input>
                  )
                  :
                  (
                    <input value={depName} onChange={(e)=>setDepName(e.target.value)} className="h-10 w-[472px] border rounded-md p-2 text-xs" placeholder="팀 이름"></input>
                  )
                }
              </div>
            </div>
            <div className="flex gap-8 mb-4 justify-start items-center">
              <span className="w-[100px]">설명</span>
              <div>
                {
                  (text=='부서 생성')
                  ?
                  (
                    <input value={depDescription} onChange={(e)=>setDepDescription(e.target.value)} className="h-10 border rounded-md p-2 w-[472px] text-xs" placeholder="부서 설명"></input>
                  )
                  :
                  (
                    <input value={depDescription} onChange={(e)=>setDepDescription(e.target.value)} className="h-10 border rounded-md p-2 w-[472px] text-xs" placeholder="팀 설명"></input>
                  )
                }
                
              </div>
            </div>
            <div className="flex gap-8 mb-8 justify-start items-start">
              { 
                (text=='부서 생성') 
                ?
                (
                  <span className="w-[100px]">부서장</span>
                )
                :
                (
                  <span className="w-[100px]">팀장</span>
                )
              }

              <div className="flex flex-col gap-4 scrollbar-none overflow-scroll max-h-[300px]">
                <div className="flex gap-2 sticky top-0 w-full bg-white">
                  {
                    (!selectedLeader)
                    ?
                    (
                      <p>리더를 선택해세주요...</p>
                    )
                    :
                    (
                      <li className='cursor-pointer hover:bg-purple-200' key={selectedLeader.id}>
                          <div className='flex justify-between px-[10px]'>
                              <div className='flex'>
                                  <img src='/images/admin-profile.png' className='w-[50px] h-[50px] mr-[10px]'></img>
                                  <div className='flex flex-col'>
                                      <div className='flex w-[200px]'>
                                          <div className='mr-[10px]'>{selectedLeader.name}</div>
                                          <div className='text-gray-400'>{selectedLeader.level}</div>
                                      </div>
                                      <div className='w-[150px] mr-[30px] text-gray-400 text-[12px]'>{selectedLeader.email}</div>
                                  </div>
                                  <div className='flex items-center w-[200px]'>
                                      {/* {selectedLeader.group} */}
                                  </div>
                              </div>
                              
                          </div>
                      </li>
                    )
                  }
                </div>
              </div>
            </div>
            <div className="flex gap-8 mb-8 justify-start items-start">
              { 
                (text=='부서 생성') 
                ?
                (
                  <span className="w-[100px]">부서원</span>
                )
                :
                (
                  <span className="w-[100px]">팀원</span>
                )
              }
              <div className="flex flex-col gap-4 scrollbar-none overflow-scroll max-h-[300px]">
                <div className="flex gap-2 sticky top-0 w-full bg-white">
                  <input className="h-10 w-[350px] border rounded-md p-2 text-xs" placeholder="구성원 또는 조직으로 검색"></input>
                  <button onClick={()=>setOpenAddress(true)} className="border h-10 w-[143px] rounded-md px-3 text-xs text-gray-400 bg-gray-100">주소록</button>
                </div>
                <>
                {
                      (!(Array.isArray(selectedUsers) && selectedUsers.length >0))
                      ?
                      (
                          <li>초대할 멤버를 선택해주세요...</li>
                      )
                      : selectedUsers.map(user => {
                          return (
                              <li className='cursor-pointer hover:bg-purple-200' key={user.id}>
                                  <div className='flex justify-between px-[10px]'>
                                      <div className='flex' onClick={()=>setSelectedLeader(user)}>
                                          <img src='/images/admin-profile.png' className='w-[50px] h-[50px] mr-[10px]'></img>
                                          <div className='flex flex-col'>
                                              <div className='flex w-[200px]'>
                                                  <div className='mr-[10px]'>{user.name}</div>
                                                  <div className='text-gray-400'>{user.level}</div>
                                              </div>
                                              <div className='w-[150px] mr-[30px] text-gray-400 text-[12px]'>{user.email}</div>
                                          </div>
                                          <div className='flex items-center w-[200px]'>
                                              {/* {user.group} */}
                                          </div>
                                      </div>
                                      <div className='flex items-center'>
                                          <button onClick={(e)=>cancleSelectedUsersHandler(e,user)} className='text-[20px] text-gray-400 font-bold'>X</button>
                                      </div>
                                  </div>
                              </li>
                          )
                      })
                      
                  }
                </>
              </div>
            </div>
            <div className="flex gap-8 mb-12 justify-start items-center">
              <span className="w-[100px]">링크 공유</span>
              <div>
                <select onChange={(e)=>setLink(e.target.value)} className="h-10 w-[472px] border rounded-md p-2 text-xs outline-none text-center">
                  <option value={1}>허용함</option>
                  <option value={0}>허용안함</option>
                </select>
              </div>
            </div>
            <div className="mb-8 flex justify-end gap-2 mb-8">
              <button onClick={onClose} className="bg-gray-100 w-[120px] h-[40px] rounded-md text-xs">취소</button>
              {text === '부서 생성' &&
              <button onClick={postDepartmentHandler} className="bg-purple white w-[120px] h-[40px] rounded-md text-xs">만들기</button>
              }
              {text === '팀 생성' &&
              <button onClick={postTeamHandler} className="bg-purple white w-[120px] h-[40px] rounded-md text-xs">만들기</button>
              }
            </div>
            </div>
        </div>
        <GetAddressModal 
                isOpen={openAddress}
                onClose={()=>setOpenAddress(false)}
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
                cancleSelectedUsersHandler={cancleSelectedUsersHandler}
        />
    </div>
  )
}
