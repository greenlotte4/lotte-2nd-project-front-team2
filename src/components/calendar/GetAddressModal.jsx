import React, { useCallback, useEffect, useRef, useState } from 'react'
import CustomAlert from '../Alert';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/axios.jsx'
import { CustomSVG } from '../project/_CustomSVG';
export default function GetAddressModal({isOpen, onClose, selectedUsers, setSelectedUsers, cancleSelectedUsersHandler}) {

    const [customAlert, setCustomAlert] = useState(false);
    const [customAlertType, setCustomAlertType] = useState("");
    const [customAlertMessage, setCustomAlertMessage] = useState("");
    const [allUsersKeyword, setAllUsersKeyword] = useState("");
    const [allGroupsKeyword, setAllGroupsKeyword] = useState("");
    const [selectedGroupId, setSelectedGroupId] = useState(0);

    const fetchAllUsers = async ({pageParam}) => {
        try {
            const response = await axiosInstance.get(`/api/users/all?page=${pageParam}&keyword=${allUsersKeyword}&id=${selectedGroupId}`)
            return response.data
        } catch (err){
            return err
        }
    }

    const fetchAllGroups = async ({pageParam}) => {
        try {
            const response = await axiosInstance.get(`/api/groups/all?page=${pageParam}&keyword=${allGroupsKeyword}`)
            return response.data
        } catch (err){
            return err
        }
    }

    const { 
        data : allUsers , 
        fetchNextPage : fetchNextPageAllUsers , 
        hasNextPage : hasNextPageAllUsers,
        isFetchingNextPage : isFetchingNextPageAllUsers,
        refetch : refetchAllUsers
    } 
    = useInfiniteQuery({
        queryKey : ['users-all',allUsersKeyword,selectedGroupId],
        queryFn : fetchAllUsers,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (!lastPage.hasNextPage) {
                return null;
            }
    
            if (lastPage.currentPage < lastPage.totalPages) {
                return lastPage.currentPage + 1;
            }
    
            return null;
        },
        select: (data) => {
            const allUsers = data.pages.flatMap((page) => page.users);
            return { ...data, pages: [{ ...data.pages[0], users: allUsers }] };
        },
        cacheTime : 6 * 1000 * 60 ,
        retry: false,
    })
    
    const observer = useRef();
    const lastUserRef = useCallback((node) => {
        if (isFetchingNextPageAllUsers) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPageAllUsers) {
            fetchNextPageAllUsers(); 
        }
        });
        if (node) observer.current.observe(node);
    }, [isFetchingNextPageAllUsers, hasNextPageAllUsers, fetchNextPageAllUsers]);

    useEffect(() => {
        if (allUsersKeyword !== "") {
            refetchAllUsers(); 
        } else {
            refetchAllUsers();
        }
    }, [allUsersKeyword, refetchAllUsers]);

    const { 
        data : allGroups , 
        fetchNextPage : fetchNextPageAllGroups , 
        hasNextPage : hasNextPageAllGroups,
        isFetchingNextPage : isFetchingNextPageAllGroups,
        refetch : refetchAllGroups
    } = useInfiniteQuery({
        queryKey: ['groups-all',allGroupsKeyword],
        queryFn: fetchAllGroups,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (!lastPage.hasNextPage) {
                return null;
            }
    
            if (lastPage.currentPage < lastPage.totalPages) {
                return lastPage.currentPage + 1;
            }
    
            return null;
        },
        select: (data) => {
            const allGroups = data.pages.flatMap((page) => page.groups);
            return { ...data, pages: [{ ...data.pages[0], groups: allGroups }] };
        },
        cacheTime : 6 * 1000 * 60 ,
        retry: false
    })

    const observerGroups = useRef();
    const lastGroupRef = useCallback((node) => {
        if (isFetchingNextPageAllGroups) return;
        if (observerGroups.current) observerGroups.current.disconnect();
        observerGroups.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPageAllUsers) {
            fetchNextPageAllGroups(); 
        }
        });
        if (node) observerGroups.current.observe(node);
    }, [isFetchingNextPageAllGroups, hasNextPageAllGroups, fetchNextPageAllGroups]);

    useEffect(() => {
        if (allGroupsKeyword !== "") {
            refetchAllGroups(); 
        } else {
            refetchAllGroups(); 
        }
    }, [allGroupsKeyword, refetchAllGroups]);

    const selectGroup = (e,id) =>{
        setSelectedGroupId(id);
    }

    const resetGroup = () => {
        setSelectedGroupId(0)
    }

    useEffect(()=>{
        console.log(selectedGroupId)
        if(selectedGroupId != 0){
            refetchAllUsers();
        } else {
            refetchAllUsers();
        }
    },[refetchAllUsers,selectedGroupId])

    const selectedUsersHandler = (e,user) => {
        setSelectedUsers((prev)=>{
            if (prev.some((selectedUser) => selectedUser.id === user.id)) {
                return prev; // 이미 있으면 이전 배열 그대로 반환
            }
            return [...prev, user]; 
        })
    }

    const completePostAddress = () => {
        setCustomAlert(true)
        setCustomAlertMessage("공유 인원 초대를 완료했습니다.")
        setCustomAlertType("success")

        setTimeout(() => {
            onClose();
            setCustomAlert(false)
        }, 1000);
    }
    if(!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <CustomAlert 
        type={customAlertType} message={customAlertMessage} isOpen={customAlert}
      />
        <div className="bg-white rounded-2xl shadow-lg w-[800px] min-h-[800px] max-h-[800px] overflow-scroll scrollbar-none">
        
            <div className="display-flex mb-8 py-3.5 px-12 bg-white border-b rounded-t-2xl z-10 sticky top-0">
                <span className="text-xl font-bold">주소록</span>
                <button 
                onClick={onClose}
                className="text-xl float-right display-block font-bold text-gray-600 hover:text-gray-900"
                >
                <CustomSVG id="close" color='currentColor' />
                </button>
            </div>
            <div className='mx-12'>
                <div className='flex gap-[20px] flex-col mb-8 min-h-[200px] max-h[200px]'>
                    <div className='flex justify-between border-b pb-[13px]'>
                        <p>팀 / 부서 ({allGroups ? allGroups.pages[0].totalElements : 0})</p>
                        <input value={allGroupsKeyword} onChange={(e)=>setAllGroupsKeyword(e.target.value)} placeholder='검색'/>
                    </div>
                    <ul className='max-h-[150px] overflow-scroll scrollbar-none'>
                        <li onClick={resetGroup} style={{backgroundColor: 'white'}} className='sticky top-0 px-[10px] mb-[10px] hover:text-purple-500 cursor-pointer'>전체</li>
                        {allGroups && allGroups.pages[0] && allGroups.pages[0].groups && allGroups.pages[0].groups.length > 0 ? (
                        allGroups.pages[0].groups.map((group,index) => (
                            <li className='' key={index}>
                                <div className='flex justify-between px-[10px]'>
                                    <div className='flex'>
                                        <div className='flex flex-col'>
                                            <div onClick={(e)=>selectGroup(e,group.id)} className='flex w-[200px] cursor-pointer hover:text-purple-500'>
                                                <div className='mr-[10px]'>{group.name}</div>
                                                <div className='text-gray-400'>({group.cnt})</div>
                                            </div>
                                        </div>
                                        
                                    </div>
                                    <div className='flex items-center'>
                                        <button className='text-[20px] text-gray-400'>
                                        <CustomSVG id="close" color='currentColor'/></button>
                                    </div>
                                </div>
                            </li>  
                        ))
                        ) : (
                            <li>로딩중입니다...</li> 
                        )}
                        {hasNextPageAllGroups && (
                        <div ref={lastGroupRef} className='text-center mt-4'>
                            {isFetchingNextPageAllGroups ? 'Loading more...' : 'Load more'}
                        </div>
                        )}
                    </ul>
                </div>
                <div className='flex gap-[20px] flex-col mb-8 min-h-[250px] max-h[250px]'>
                    <div className='flex justify-between border-b pb-[13px]'>
                        {
                            (selectedGroupId != 0)
                            ?
                            (
                                <>
                                <p>팀 / 부서 ({allUsers ? allUsers.pages[0].totalElements : 0})</p>
                                <input value={allUsersKeyword} onChange={(e)=>setAllUsersKeyword(e.target.value)} placeholder='검색'/>
                                </>
                            )
                            :
                            (
                                <>
                                <p>전체 ({allUsers ? allUsers.pages[0].totalElements : 0})</p>
                                <input value={allUsersKeyword} onChange={(e)=>setAllUsersKeyword(e.target.value)} placeholder='검색'/>        
                                </>
                            )
                        }
                    </div>
                    <ul className='max-h-[200px] min-h-[200px] overflow-scroll scrollbar-none'>
                        {allUsers && allUsers.pages[0] && allUsers.pages[0].users && allUsers.pages[0].users.length > 0 ? (
                        allUsers.pages[0].users.map((user,index) => (
                            <li onClick={(e)=>selectedUsersHandler(e,user)} className='cursor-pointer hover:bg-purple-200' key={index}>
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
                                </div>
                            </li>  
                        ))
                        ) : 
                        (
                            <li>로딩중입니다...</li> 
                        )}
                        {hasNextPageAllUsers && (
                        <div ref={lastUserRef} className='text-center mt-4'>
                            {isFetchingNextPageAllUsers ? 'Loading more...' : 'Load more'}
                        </div>
                        )}
                    </ul>
                    
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
                    <button onClick={completePostAddress} className="bg-purple px-6 py-4 text-xs rounded-md white">등록하기</button>
                </div>
            </div>
        </div>
    </div>
  )
}
