import React, { useEffect, useState } from 'react'
import CustomAlert from '../Alert';
import GetAddressModal from './GetAddressModal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/services/axios.jsx'
import useWebSocket from '../../util/useWebSocket';

export default function PostCalendarModal({isOpen,onClose}) {

  const queryClient = useQueryClient();
  const [customAlert, setCustomAlert] = useState(false);
  const [customAlertType, setCustomAlertType] = useState("");
  const [customAlertMessage, setCustomAlertMessage] = useState("");
  const [openAddress,setOpenAddress] = useState(false)
  const [name, setName] = useState("");
  const [status,setStatus] = useState("");
  const [color,setColor] = useState("");
  const [colors, setColors] = useState(['red','orange','yellow','green','blue','purple'])
  const usedColors = queryClient.getQueryData(['calendar-name']);
  const [filteredColors, setFilteredColors] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { sendWebSocketMessage } = useWebSocket({});

  
  useEffect(() => {
    if (Array.isArray(usedColors) && usedColors.length > 0) {
      const filtered = colors.filter(v => {
        return !usedColors.some(used => used.color == v);
      });
      setFilteredColors(filtered);
      setIsFiltering(true);
    }
  }, [usedColors, colors]);

  const cancleSelectedUsersHandler = (e,user) => {
    setSelectedUsers((prev)=>{
        return prev.filter((selectedUser) => selectedUser.id !== user.id);
    })
  }

  const postCalendarMutation = useMutation({
    mutationFn : async () => {
      try {
        const resp = await axiosInstance.post("/api/calendar",{
          name,
          color,
          userIds : selectedUsers.map(v=>v.id),
          status
        })
        return resp.data
      } catch (err) {
        return err;
      }
    },
    onSuccess : (data) => {
      setCustomAlert(true)
      setCustomAlertMessage(data.message)
      setCustomAlertType("success")
      const messageData = {
        "name" : name,
        "color" : color,
        "userIds" : selectedUsers.map(v=>v.id),
        "status" : status,
        "id" : data.calendarName.id,
        "myid" : data.myid
      }
      sendWebSocketMessage(messageData,'/app/calendar/post'); 
      
      setTimeout(() => {
        setCustomAlert(false)
        onClose();
      }, 1000);
    },
    onError : (err) => {
      setCustomAlert(true)
      setCustomAlertMessage(data)
      setCustomAlertType("error")

      setTimeout(() => {
        setCustomAlert(false)
      }, 1000);
    }
  })

  const postCalendarHandler = async () => {
    try {
      await postCalendarMutation.mutateAsync();
    } catch (err) {
      setCustomAlert(true)
      setCustomAlertMessage(data)
      setCustomAlertType("error")

      setTimeout(() => {
        setCustomAlert(false)
      }, 1000);
    }
  }
  if(!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-custom-fixed">
      <CustomAlert 
        type={customAlertType} message={customAlertMessage} isOpen={customAlert}
      />
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-[800px] modal-custom-width max-h-[800px] overflow-scroll scrollbar-none">
        
        <div className="display-flex mb-8 py-3.5 px-12 bg-white border-b rounded-t-2xl z-10 sticky top-0">
            <span className="text-xl font-bold">캘린더 등록</span>
            <button 
            onClick={onClose}
            className="text-xl float-right display-block font-bold text-gray-600 hover:text-gray-900"
            >
            X
            </button>
        </div>
        <div className='mx-12'>
          <div className="flex gap-8 mb-4 justify-start">
            <span className="w-[100px] h-[40px]">제목</span>
            <div>
              <input onChange={(e)=>setName(e.target.value)} value={name} className="h-[40px] w-[250px] border rounded-md px-2 outline-none"></input>
            </div>
          </div>
          <div className='flex gap-8 mb-4 justify-start'>
            <span className='w-[100px] h-[40px]'>기본캘린더</span>
            <select value={status} onChange={(e)=>setStatus(e.target.value)} className='h-[40px] w-[250px] border rounded-md px-2 outline-none'>
              <option value={0}>속성 선택</option>
              <option value={1}>설정</option>
              <option value={2}>설정안함</option>
            </select>
          </div>
          <div className='flex gap-8 mb-4 justify-start'>
            <span className='w-[100px] h-[40px]'>캘린더색상</span>
            <select value={color} onChange={(e)=>setColor(e.target.value)} className='h-[40px] w-[250px] border rounded-md px-2 outline-none'>
              {
                (!(Array.isArray(usedColors)) || usedColors.length==0)
                ?
                colors.map(v => {
                  return <option key={v} value={v}>{v}</option>
                })
                :
                (!isFiltering)
                ?
                (
                  <option>로딩중...</option>
                )
                :
                (
                filteredColors.map(c => {
                  return <option key={c} value={c}>{c}</option>
                }))
              }
            </select>
          </div>
          <div className='flex gap-8 mb-4 justify-start'>
            <span className='w-[100px] h-[40px]'>공유인원</span>
            <button onClick={()=>setOpenAddress(true)} className='border w-[100px] h-[40px] rounded-lg'>주소록</button>
          </div>
            <div className="flex gap-8 mb-4 justify-start max-h-[200px] overflow-scroll scrollbar-none">
              <span className="w-[100px] h-[40px] sticky top-0">참여자목록</span>
              <div>
                  <ul>
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
                                      <div className='flex'>
                                          <img src='/images/admin-profile.png' className='w-[50px] h-[50px] mr-[10px]'></img>
                                          <div className='flex flex-col'>
                                              <div className='flex w-[200px]'>
                                                  <div className='mr-[10px]'>{user.name}</div>
                                                  <div className='text-gray-400'>{user.level}</div>
                                              </div>
                                              <div className='w-[150px] mr-[30px] text-gray-400 text-[12px]'>{user.email}</div>
                                          </div>
                                          <div className='flex items-center w-[200px]'>
                                              {user.group}
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
                  </ul>
              </div>
            </div>
          <div className="flex justify-end mb-12">
            <button onClick={postCalendarHandler} className="bg-purple px-6 py-4 text-xs rounded-md white">등록하기</button>
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
    </div>
  )
}
