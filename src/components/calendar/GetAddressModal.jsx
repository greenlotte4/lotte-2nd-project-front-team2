import React, { useCallback, useEffect, useRef, useState } from 'react'
import CustomAlert from '../Alert';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/axios.jsx'
import { CustomSVG } from '../project/_CustomSVG';
import { CheckCircle, Filter, Search, UserPlus, Users, X } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[999] p-4">
    <CustomAlert 
        type={customAlertType} 
        message={customAlertMessage} 
        isOpen={customAlert}
    />
    
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Users className="mr-3 text-purple-600" size={28} />
                주소록
            </h2>
            <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 transition-colors"
            >
                <X size={28} />
            </button>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-3 gap-6 p-6 h-full overflow-hidden">
            {/* Groups Column */}
            <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center mb-4 border-b pb-2">
                    <Filter className="mr-2 text-gray-500" />
                    <h3 className="text-lg font-semibold">팀 / 부서</h3>
                    <span className="ml-2 text-sm text-gray-500">
                        ({allGroups ? allGroups.pages[0].totalElements : 0})
                    </span>
                </div>
                
                <div className="relative mb-4">
                    <input 
                        value={allGroupsKeyword} 
                        onChange={(e)=>setAllGroupsKeyword(e.target.value)} 
                        placeholder='부서 검색'
                        className="w-full p-2 pl-8 border rounded-md focus:ring-2 focus:ring-purple-200"
                    />
                    <Search className="absolute left-2 top-3 text-gray-400" size={20} />
                </div>

                <ul className="space-y-2 max-h-[400px] overflow-y-auto">
                    <li 
                        onClick={resetGroup} 
                        className="px-3 py-2 rounded-md hover:bg-purple-100 cursor-pointer transition-colors"
                    >
                        전체 부서
                    </li>
                    {allGroups && allGroups.pages[0]?.groups?.map((group, index) => (
                        <li 
                            key={index} 
                            onClick={(e)=>selectGroup(e,group.id)}
                            className="px-3 py-2 rounded-md hover:bg-purple-100 cursor-pointer transition-colors flex justify-between items-center"
                        >
                            <div>
                                <span className="font-medium">{group.name}</span>
                                <span className="text-sm text-gray-500 ml-2">({group.cnt})</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Users Column */}
            <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center mb-4 border-b pb-2">
                    <UserPlus className="mr-2 text-gray-500" />
                    <h3 className="text-lg font-semibold">
                        {selectedGroupId !== 0 ? '선택된 부서' : '전체 멤버'}
                    </h3>
                    <span className="ml-2 text-sm text-gray-500">
                        ({allUsers ? allUsers.pages[0].totalElements : 0})
                    </span>
                </div>
                
                <div className="relative mb-4">
                    <input 
                        value={allUsersKeyword} 
                        onChange={(e)=>setAllUsersKeyword(e.target.value)} 
                        placeholder='멤버 검색'
                        className="w-full p-2 pl-8 border rounded-md focus:ring-2 focus:ring-purple-200"
                    />
                    <Search className="absolute left-2 top-3 text-gray-400" size={20} />
                </div>

                <ul className="space-y-2 max-h-[400px] overflow-y-auto">
                    {allUsers && allUsers.pages[0]?.users?.map((user, index) => (
                        <li 
                            key={index} 
                            onClick={(e)=>selectedUsersHandler(e,user)}
                            className="px-3 py-2 rounded-md hover:bg-purple-100 cursor-pointer transition-colors"
                        >
                            <div className="flex items-center">
                                <img 
                                    src='/images/admin-profile.png' 
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full mr-4"
                                />
                                <div>
                                    <div className="flex items-center">
                                        <span className="font-medium mr-2">{user.name}</span>
                                        <span className="text-sm text-gray-500">{user.level}</span>
                                    </div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                    <div className="text-xs text-gray-400">{user.group}</div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Selected Users Column */}
            <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center mb-4 border-b pb-2">
                    <CheckCircle className="mr-2 text-green-500" />
                    <h3 className="text-lg font-semibold">참여자 목록</h3>
                    <span className="ml-2 text-sm text-gray-500">
                        ({selectedUsers?.length || 0})
                    </span>
                </div>

                <ul className="space-y-2 max-h-[400px] overflow-y-auto">
                    {selectedUsers?.length > 0 ? (
                        selectedUsers.map(user => (
                            <li 
                                key={user.id} 
                                className="px-3 py-2 rounded-md bg-white shadow-sm flex justify-between items-center"
                            >
                                <div className="flex items-center">
                                    <img 
                                        src='/images/admin-profile.png' 
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full mr-4"
                                    />
                                    <div>
                                        <div className="flex items-center">
                                            <span className="font-medium mr-2">{user.name}</span>
                                            <span className="text-sm text-gray-500">{user.level}</span>
                                        </div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                                <button 
                                    onClick={(e)=>cancleSelectedUsersHandler(e,user)} 
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X />
                                </button>
                            </li>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-4">
                            초대할 멤버를 선택해주세요
                        </div>
                    )}
                </ul>
            </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex justify-end">
            <button 
                onClick={completePostAddress} 
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
                <UserPlus className="mr-2" />
                멤버 초대
            </button>
        </div>
    </div>
</div>
  )
}
