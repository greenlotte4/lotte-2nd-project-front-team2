import React, { useEffect, useState } from 'react'
import CustomAlert from '../../../Alert';
import { CustomSVG } from '../../../project/_CustomSVG';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/services/axios.jsx'
import GetAddressModal from '../../../calendar/GetAddressModal';

export default function GroupInfoModal({isOpen,onClose,team,text}) {
    const [customAlert, setCustomAlert] = useState(false);
    const [customAlertType, setCustomAlertType] = useState("");
    const [customAlertMessage, setCustomAlertMessage] = useState("");
    const [depName, setDepName] = useState("");
    const [name, setName] = useState('')
    const [depDescription, setDepDescription] = useState("");
    const [link,setLink] = useState(1);
    const [id, setId] = useState();
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [alert, setAlert] = useState(false);
    const [openAddress, setOpenAddress] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedLeader , setSelectedLeader] = useState({});
    const queryClient = useQueryClient();

    const {
        data : groupData,
        isLoading : isLoadingGroupData,
        isError : isErrorGroupData
    } = useQuery({
        queryKey : ['group-users',name],
        queryFn : async () =>{
            try {
                const resp = await axiosInstance.get("/api/admin/group?group="+name)
                console.log(resp.data)
                return resp.data;
            } catch (err) {
                return err;
            }
        },
        cacheTime : 6 * 1000 * 60,
        enabled : !!name
    })

    useEffect(()=>{
        if(!isLoadingGroupData && groupData && !isErrorGroupData){
            setDepDescription(groupData.description);
            setSelectedLeader(groupData.leader);
            setSelectedUsers(groupData.users);
            setLink(groupData.link);
            setId(groupData.id);
            setDepName(groupData.name)
        }
    },[groupData])

    useEffect(()=>{
        if(team){
            setName(team)
        }
    },[team])

    const putGroupMutation = useMutation({
        mutationFn : async () => {
            try {
                const resp = await axiosInstance.put("/api/admin/group",{
                    name : depName,
                    description : depDescription,
                    leader : selectedLeader,
                    users : selectedUsers,
                    link,
                    id
                })
                return resp.data
            } catch (err) {
                return err;
            }
        },
        onSuccess : (data) => {
            setCustomAlert(true)
            setCustomAlertMessage(data)
            setCustomAlertType("success")
            
            queryClient.invalidateQueries(['departments']);
            queryClient.invalidateQueries(['group-users',name]);
            setTimeout(() => {
                onClose();
                setCustomAlert(false)
            }, 1000);
        },
        onError : (err) => {
            setCustomAlert(true)
            setCustomAlertMessage(err)
            setCustomAlertType("error")

            setTimeout(() => {
                setCustomAlert(false)
            }, 1000);
        }
    })

    const deleteGroupMutation = useMutation({
        mutationFn : async () => {
            try {
                const resp = await axiosInstance.delete("/api/admin/group?id="+id)
                return resp.data
            } catch (err) {
                return err;
            }
        },
        onSuccess : (data) => {
            setCustomAlert(true)
            setCustomAlertMessage(data)
            setCustomAlertType("success")
            
            queryClient.invalidateQueries(['departments']);
            queryClient.invalidateQueries(['group-users',name]);
            setTimeout(() => {
                onClose();
                setCustomAlert(false)
            }, 1000);
        },
        onError : (err) => {
            setCustomAlert(true)
            setCustomAlertMessage(err)
            setCustomAlertType("error")

            setTimeout(() => {
                setCustomAlert(false)
            }, 1000);
        }
    })

    const putGroupHandler = async () => {
        try {
            await putGroupMutation.mutateAsync();
        } catch (err) {
            setCustomAlert(true)
            setCustomAlertMessage(err)
            setCustomAlertType("error")

            setTimeout(() => {
                setCustomAlert(false)
            }, 1000);
        }
    }

    const deleteGroupHandler = async () => {
        try {
            await deleteGroupMutation.mutateAsync();
        } catch (err) {
            setCustomAlert(true)
            setCustomAlertMessage(err)
            setCustomAlertType("error")

            setTimeout(() => {
                setCustomAlert(false)
            }, 1000);
        }
    }

    const cancleSelectedUsersHandler = (e,user) => {
        setSelectedUsers((prev)=>{
            return prev.filter((selectedUser) => selectedUser.id !== user.id);
        })
      }

    if(!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <CustomAlert 
        type={customAlertType} message={customAlertMessage} isOpen={customAlert}
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
            <div className='mx-[100px]'>
                <div className="flex gap-8 mb-4 justify-start items-center">
                    {
                    (text=='부서 정보')?(<span className="w-[100px]">부서명</span>):(<span className="w-[100px]">팀명</span>)
                    }
                    <div>
                    {
                    (text=='부서 정보')?(<input value={depName} onChange={(e)=>setDepName(e.target.value)} className="h-10 w-[472px] border rounded-md p-2 text-xs" placeholder="부서 이름"></input>)
                    :(<input value={depName} onChange={(e)=>setDepName(e.target.value)} className="h-10 w-[472px] border rounded-md p-2 text-xs" placeholder="팀 이름"></input>)
                    }
                    </div>
                </div>
                <div className="flex gap-8 mb-4 justify-start items-center">
                    <span className="w-[100px]">설명</span>
                    <div>
                    {
                    (text=='부서 정보')?(<input value={depDescription} onChange={(e)=>setDepDescription(e.target.value)} className="h-10 w-[472px] border rounded-md p-2 text-xs" placeholder="부서 설명"></input>)
                    :(<input value={depDescription} onChange={(e)=>setDepDescription(e.target.value)} className="h-10 w-[472px] border rounded-md p-2 text-xs" placeholder="팀 설명"></input>)
                    }
                    </div>
                </div>
                <div className="flex gap-8 mb-8 justify-start items-start">
                    {(text=='부서 정보') ?(<span className="w-[100px]">부서장</span>):(<span className="w-[100px]">팀장</span>)}
                    <div className="flex flex-col gap-4 scrollbar-none overflow-scroll max-h-[300px]">
                        <div className="flex gap-2 sticky top-0 w-full bg-white">
                        {(!selectedLeader)?(<p>리더를 선택해세주요...</p>):
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
                <div className="flex gap-8 mb-8 justify-start items-start">{(text=='부서 정보') ?(<span className="w-[100px]">부서원</span>):(<span className="w-[100px]">팀원</span>)}
                    <div className="flex flex-col gap-4 scrollbar-none overflow-scroll max-h-[300px]">
                        <div className="flex gap-2 sticky top-0 w-full bg-white">
                            <input className="h-10 w-[350px] border rounded-md p-2 text-xs" placeholder="구성원 또는 조직으로 검색"></input>
                            <button onClick={()=>setOpenAddress(true)} className="border h-10 w-[143px] rounded-md px-3 text-xs text-gray-400 bg-gray-100">주소록</button>
                        </div>
                        {(!(Array.isArray(selectedUsers) && selectedUsers.length >0))?(<li>초대할 멤버를 선택해주세요...</li>)
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
                        </li>)})}
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
                    <button onClick={putGroupHandler} className="bg-purple white w-[120px] h-[40px] rounded-md text-xs">수정</button>
                    <button onClick={deleteGroupHandler} className="bg-gray-100 w-[120px] h-[40px] rounded-md text-xs">삭제</button>
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
    </div>
  )
}
