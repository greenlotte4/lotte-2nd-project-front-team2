import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'

import axiosInstance from '@/services/axios.jsx'
import { useAttendStore } from '../../../store/zustand';

export default function UserPage1() {
    const dispatch = useDispatch();
    const selectedTeamId = useSelector((state) => state.team.selectedTeamId);
    const [selectedState,setSelectedState] = useState('');
    const [allUsersKeyword, setAllUsersKeyword] = useState("");
    const [allGroupsKeyword, setAllGroupsKeyword] = useState("");
    const [selectedGroupId, setSelectedGroupId] = useState(0);
    const [searchAll,setSearchAll] = useState(false);
    const [page, setPage] = useState(0);

    useEffect(()=>{
        if(selectedTeamId&&selectedTeamId!='전체'){
            setSelectedState(selectedTeamId)
            setPage(1)
        } else if(selectedTeamId&&selectedTeamId=='전체'){
            setSearchAll(true)
            setPage(2)
        }
    },[selectedTeamId])

    useEffect(()=>{
        if(selectedState){
            console.log(selectedState)
        }
    },[selectedState])

    const {
        data : usersData,
        isLoading : isLoadingUsers,
        isError : isErrorUsers,
    } = useQuery({
        queryKey : ['group-members',selectedState],
        queryFn : async () => {
            try {
                const resp = await axiosInstance.get("/api/admin/group/users?group="+selectedState)
                return resp.data
            } catch (err) {
                return err
            }
        },
        cacheTime : 5 * 1000 * 60,
        enabled : !!selectedState
    })
    
    const fetchAllUsers = async ({pageParam}) => {
        try {
            const response = await axiosInstance.get(`/api/admin/users/all?page=${pageParam}&keyword=${allUsersKeyword}&id=${selectedGroupId}`)
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
        queryKey : ['admin-users-all',allUsersKeyword,selectedGroupId],
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
        enabled: !!setSearchAll
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

    return (
        
        <>
        {page == 1 &&
        <section className="overflow-auto max-h-[400px] min-h-[400px] scrollbar-none mb-16 px-[40px]">
            <table className="w-full table-auto border-collapse mb-16">
                <thead className='bg-gray-200 h-16 sticky top-0 z-10'>
                    <tr className='text-center'>
                        <th className="w-[133px] rounded-tl-lg">번호</th>
                        <th className="w-[273px]">이름</th>
                        <th className="w-[133px]">상태</th>
                        <th className="w-[133px]">근태</th>
                        <th className="w-[133px]">직급</th>
                        <th className="w-[273px]">가입일자</th>
                        <th className="w-[133px] rounded-tr-lg">비고</th>
                    </tr>
                </thead>
                <tbody>
                {isLoadingUsers&&!allUsers ?(<tr className='flex ml-[540px] w-[100px] items-center justify-center h-[200px]'>로딩중...</tr>):isErrorUsers?(<p className='flex w-[1200px] items-center justify-center h-[200px]'>에러가 발생했습니다...</p>)
                :Array.isArray(usersData)&&usersData.length!=0
                ?usersData.map((v,i)=>{
                return (
                <tr key={i} className='text-center h-16 border-b'>
                    <td className="w-1/10">{i+1}</td> 
                    <td className="w-2/10">{v.name}</td>
                    <td className="w-2/10">{v.state}</td>
                    <td className="w-1/10">{v.attendance}</td>
                    <td className="w-1/10">{v.level}</td>
                    <td className="w-1/10">{v.createAt}</td>
                    <td className="w-1/10">머할까</td>
                </tr>
                )
                }) : (<li>데이터가 없습니다...</li>)}
                </tbody>
            </table>
        </section>
        } 
        {page == 2 &&
        <section className="overflow-auto max-h-[400px] min-h-[400px] scrollbar-none mb-16 px-[40px]">
            <table className="w-full table-auto border-collapse mb-16">
                <thead className='bg-gray-200 h-16 sticky top-0 z-10'>
                    <tr className='text-center'>
                        <th className="w-[133px] rounded-tl-lg">번호</th>
                        <th className="w-[273px]">이름</th>
                        <th className="w-[133px]">상태</th>
                        <th className="w-[133px]">근태</th>
                        <th className="w-[133px]">직급</th>
                        <th className="w-[273px]">가입일자</th>
                        <th className="w-[133px] rounded-tr-lg">비고</th>
                    </tr>
                </thead>
                <tbody>
                {
                allUsers && allUsers.pages[0] && allUsers.pages[0].users && allUsers.pages[0].users.length > 0 ? (
                    allUsers.pages[0].users.map((v, i) => (
                    <tr onClick={(e) => selectedUsersHandler(e, v)} className="text-center h-16 border-b" key={i}>
                        <td className="w-1/10">{i + 1}</td>
                        <td className="w-2/10">{v.name}</td>
                        <td className="w-2/10">{v.state}</td>
                        <td className="w-1/10">{v.attendance}</td>
                        <td className="w-1/10">{v.level}</td>
                        <td className="w-1/10">{v.createAt}</td>
                        <td className="w-1/10">머할까</td>
                    </tr>
                    ))
                ) : (
                    // `allUsers`가 없거나, 데이터가 없을 경우 로딩 중 메시지
                    <li>로딩중입니다...</li>
                )
                }

                {
                // `hasNextPageAllUsers`가 true일 때만 Load more 버튼 표시
                hasNextPageAllUsers && (
                    <div ref={lastUserRef} className="text-center mt-4">
                    {isFetchingNextPageAllUsers ? 'Loading more...' : 'Load more'}
                    </div>
                )
                }
                </tbody>
            </table>
        </section>
        }
        </>
  )
}
