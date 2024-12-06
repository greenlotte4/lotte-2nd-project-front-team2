import React, { useEffect, useState } from 'react'
import axiosInstance from '@/services/axios.jsx'
import MemberAddressModal from './MemberAddressModal';
import CustomAlert from '../Alert';
import { useQuery } from '@tanstack/react-query';

export default function GroupInfoModifyModal({isOpen,text,onClose}) {

    //  useState    //
    const [page, setPage] = useState(0)
    const [leader, setLeader] = useState({});
    const [user, setUser] = useState([]);
    const [user2, setUser2] = useState([]);
    const [addressIsOpen, setAddressIsOpen] = useState(false);
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [alert, setAlert] = useState(false);
    const [addressIsOpen2, setAddressIsOpen2] = useState(false);
    const [updateGroupName , setUpdateGroupName] = useState("") ;
    // //  useEffect   //
    // useEffect (()=> {
    //     axiosInstance
    //         .get(`/api/group/leader?team=${text}`)
    //         .then((resp) => {
    //             setLeader(resp.data)
    //         })
    //         .catch((e)=> {

    //         })
    //     axiosInstance
    //         .get(`/api/group/users?team=${text}`)
    //         .then((resp)=>{
    //             if(resp.status === 200){
    //                 const users = resp.data;
    //                 setUser(users);  
    //             }
    //         })
    //         .catch((err)=>{

    //         })
    // },[])

    
    // //  Handler    //
    // const selectLeader = (e) => {
    //     setLeader(prev => ({
    //         ...prev, 
    //         id: e.target.dataset.id, 
    //         email: e.target.dataset.email,
    //         uid: e.target.dataset.uid
    //     }));
    //     setAddressIsOpen(false);
    // }
    // const openAddress = () => {
    //     setAddressIsOpen(true)
    //     axiosInstance
    //         .get('/api/users')
    //         .then((resp)=>{
    //             const filteredUser2 = resp.data.filter(user => !(user.id == leader.id));
    //             setUser2(filteredUser2)
    //         })
    //         .catch((err)=>{
    //             setAlert(true)
    //             setMessage(err.data)
    //             setType("error")
    //             setTimeout(() => {
    //                 setAlert(false);  
    //                 window.location.reload()
    //             }, 1000);
    //         })
    // }
    // const openAddress2 = () => {
    //     setAddressIsOpen2(true)
    //     axiosInstance
    //         .get('/api/users')
    //         .then((resp)=>{
    //             const groupMemberIds = user.map(member => Number(member.id));
    //             const filteredUser2 = resp.data.filter(user => !groupMemberIds.includes(user.id));
    //             setUser2(filteredUser2)
    //         })
    //         .catch((err)=>{
    //             setAlert(true)
    //             setMessage(err.data)
    //             setType("error")
    //             setTimeout(() => {
    //                 setAlert(false);  
    //                 window.location.reload()
    //             }, 1000);
    //         })
    // }
    // const closeAddress = () => {setAddressIsOpen(false)}
    // const closeAddress2 = () => {setAddressIsOpen2(false)}
    // const patchLeader = () => {
    //     axiosInstance
    //         .patch(`/api/group/leader?id=${leader.id}&name=${text}`,null)
    //         .then((resp)=> {
    //             setAlert(true)
    //             setMessage(resp.data)
    //             setType("success")
    //             setTimeout(() => {
    //                 setAlert(false);  
    //                 window.location.reload()
    //             }, 1000);
    //         })
    //         .catch((err)=>{
    //             setAlert(true)
    //             setMessage(err.data)
    //             setType("error")
    //             setTimeout(() => {
    //                 setAlert(false);  
    //                 window.location.reload()
    //             }, 1000);
    //         })
    // }
    // const patchMembers = () => {
        
    //     axiosInstance
    //         .patch(`/api/group/users?ids=${user.map(v=>v.id)}&team=${text}`,null)
    //         .then((resp)=>{
    //             setAlert(true)
    //             setMessage(resp.data)
    //             setType("success")
    //             setTimeout(() => {
    //                 setAlert(false);  
    //                 window.location.reload()
    //             }, 1000);
    //         })
    //         .catch((err)=>{
    //             setAlert(true)
    //             setMessage(err.data)
    //             setType("error")
    //             setTimeout(() => {
    //                 setAlert(false);  
    //                 window.location.reload()
    //             }, 1000);
    //         })
    // }
    // const patchGroupName = () => {
    //     axiosInstance
    //         .patch(`/api/group?name=${text}&update=${updateGroupName}`,null)
    //         .then((resp)=>{
    //             setAlert(true)
    //             setMessage(resp.data)
    //             setType("success")
    //             setTimeout(() => {
    //                 setAlert(false);  
    //                 window.location.reload()
    //             }, 1000);
    //         })
    //         .catch((err)=>{
    //             setAlert(true)
    //             setMessage(err.data)
    //             setType("error")
    //             setTimeout(() => {
    //                 setAlert(false);  
    //                 window.location.reload()
    //             }, 1000);
    //         })
    // }
    // const updateMembers = (e) => {
    //     setAddressIsOpen2(false)
    // }
    // const selectBox = (e) => {
    //     const newId = e.target.dataset.id;
    //     const newUid = e.target.dataset.uid;
    //     const newEmail = e.target.dataset.email;
    //     setUser(prevMembers => {
    //         const updatedMembers = [...prevMembers, { id: newId, uid: newUid, email: newEmail }];
    //         const filteredUser2 = user2.filter(user => !(user.id == newId));
    //         setUser2(filteredUser2)
    //         return updatedMembers;
    //     });
    // };

    // const deleteUsers = (e) => {
    //     const filteredUser = user.filter(v => !(v.id == e.target.dataset.id))
    //     setUser(filteredUser)
    // }
    // const closeAlert = () => {setAlert(false)}

    if(!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-md shadow-lg w-80 p-4 flex flex-col gap-2">
        {page === 0 &&
        <>
            <h3 className="text-lg font-semibold mb-4 text-center">{text}</h3>
            <button
                className="block w-full bg-gray-100 hover:bg-blue-100 px-4 py-2 text-sm text-gray-700 border rounded-md"
                onClick={() => setPage(1)}
            >
                그룹장 변경
            </button>
            <button
                className="block w-full bg-gray-100 hover:bg-blue-100 px-4 py-2 text-sm text-gray-700 border rounded-md"
                onClick={() => setPage(2)}
            >
                그룹원 변경
            </button>
            <button
                className="block w-full bg-gray-100 hover:bg-blue-100 px-4 py-2 text-sm text-gray-700 border rounded-md"
                onClick={() => setPage(3)}
            >
                그룹 이름 변경
            </button>
            
        </>
        }
        {page === 1 &&
        <>
            <h3 className="text-lg font-semibold mb-4 text-center">그룹장 변경</h3>
            <div className='flex justify-between mb-4'>
                <p className='flex items-center'>현재 그룹장 :</p>
                <div className="flex gap-4">
                    <img src="/images/document-folder-profile.png" alt="User profile" className="cursor-pointer"/>
                    <div className="flex flex-col justify-between">
                    <p className="text-xs">{0}</p>
                    <p className="text-xs text-gray-400">{0}</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                <input className="h-10 w-52 border rounded-md p-2 text-xs" placeholder="구성원 또는 조직으로 검색"></input>
                <button onClick={openAddress} className="h-10 w-20 rounded-md px-3 text-xs text-gray-400 bg-gray-100">주소록</button>
            </div>
            <MemberAddressModal 
                isOpen={addressIsOpen}
                onClose={closeAddress}
                text="부서장등록"
                data={user2}
                // changeHandler={selectLeader}
            />

        </>
        }
        {page === 2 &&
        <>
            <h3 className="text-lg font-semibold mb-4 text-center">그룹원 변경</h3>
            <div className=' mb-4 overflow-scroll scrollbar-none max-h-[400px] '>
                <p className='mb-4'>현재 그룹원 :</p>
                {/* {user.map((v) => (
                    <div className="flex gap-4 flex justify-between border mb-4 p-2 px-8" key={v.id}>
                        <img src="/images/document-folder-profile.png" alt="User profile" className="cursor-pointer"/>
                        <div className="flex flex-col justify-between">
                            <p className="text-xs">{v.uid}</p>
                            <p className="text-xs text-gray-400">{v.email}</p>
                        </div>
                        <div className='flex items-center justify-end'>
                        <button className='border w-[40px] h-[25px] rounded-md text-xs hover:bg-blue-100' onClick={deleteUsers} data-id={v.id}>삭제</button>
                        </div>
                    </div>
                ))} */}
            </div>
            <div className="flex gap-2">
                <input className="h-10 w-52 border rounded-md p-2 text-xs" placeholder="구성원 또는 조직으로 검색"></input>
                <button onClick={openAddress2} className="border h-10 w-20 rounded-md px-3 text-xs text-gray-400 bg-gray-100">주소록</button>
            </div>
            <MemberAddressModal 
            isOpen={addressIsOpen2}
            onClose={closeAddress2}
            text="부서원등록"
            data={user2}
            updateMembers = {updateMembers}
            selectBox = {selectBox}
            />
        </>
        }
        {page === 3 &&
        <>
            <h3 className="text-lg font-semibold mb-4 text-center">그룹명 변경</h3>
            <div className=' mb-4 overflow-scroll scrollbar-none max-h-[400px] '>
                <p className='mb-4'>현재 그룹명 : {text}</p>
            </div>
            <div className='flex justify-between'>
                <p>그룹명</p>
                <input value={updateGroupName} onChange={(e) => setUpdateGroupName(e.target.value)} placeholder='변경할 그룹명'></input>
            </div>
        </>
        }
            <div className='flex justify-end w-full gap-4 mt-8 mb-4'>
                <button 
                    className="px-4 py-2 bg-purple text-white rounded-md"
                    onClick={onClose}
                >
                    닫기
                </button>
                {page === 1 &&
                <button 
                    className="px-4 py-2 bg-purple text-white rounded-md"
                    onClick={patchLeader}
                >
                    변경하기
                </button>
                }
                {page === 2 &&
                <button 
                    className="px-4 py-2 bg-purple text-white rounded-md"
                    onClick={patchMembers}
                >
                    변경하기
                </button>
                }
                {page === 3 &&
                <button 
                    className="px-4 py-2 bg-purple text-white rounded-md"
                    onClick={patchGroupName}
                >
                    변경하기
                </button>
                }
            </div>
            <CustomAlert 
              type={type}  // 알림의 타입 (success, error, info , basic 등)
              message={message}
            //   onClose={closeAlert}
              isOpen={alert}
        />
        </div>
    </div>
  )
}
