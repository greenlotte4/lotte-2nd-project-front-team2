import React, { useEffect, useRef, useState } from 'react'
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/services/axios.jsx'
import { useAttendStore } from '../../../store/zustand';
import { useDispatch, useSelector } from 'react-redux';

export default function AdminUserMainTop({selectOption , optionChanger}) {
    // const attendCount = useAttendStore((state) => state.attendCount);
    // const totalCount = useAttendStore((state) => state.totalCount);
    const [searchCondition, setSearchCondition] = useState("level");
    const [searchKeyword, setSearchKeyword] = useState("");
    // const [isSearch, setIsSearch] = useState(false);
    // const dispatch = useDispatch();
    // const selectedTeamId = useSelector((state) => state.team.selectedTeamId);

    const queryClient = useQueryClient();
    

    // const { 
    //     data: usersData, 
    // } = useQuery({
    //     queryKey: ['group-members',selectedTeamId,isSearch,searchCondition,searchKeyword],  
    //     queryFn: async () => {
    //         try{
    //             const response = await axiosInstance.get('/api/group/users/detail', {
    //                 params: {
    //                     condition: searchCondition,
    //                     keyword: searchKeyword,
    //                     team: selectedTeamId
    //                 }
    //             });
    //             return response.data;
    //         }catch(err){
    //             return err
    //         }
            
    //     },
    //     enabled: isSearch, 
    //     refetchOnWindowFocus: false,  
    //     staleTime: 300000,  
    //     retry: false
    // });

    // useEffect(() => {
    //     if (usersData) {
    //         queryClient.setQueryData(['group-members', selectedTeamId], usersData);
    //         setIsSearch(false);  
    //     }
        
    // }, [usersData, selectedTeamId, queryClient]);

    
    
    // const searchHandler = () => {
    //     setIsSearch(true)
    // };
  return (
    <section className='flex items-center gap-4 mb-12 px-[30px]'>
        <div className='ml-4 text-xl'>
            <select value={selectOption} onChange={optionChanger} className='outline-none border rounded-md text-[15px] p-2 text-center'>
                <option value={0}>인사관리</option>
                <option value={1}>가입승인요청</option>
            </select>
        </div>
        <div className='ml-auto flex'>
            <label className='flex justify-start items-center border rounded-r-md w-80 h-11'>
                <img onClick={null} className='opacity-50 w-6 h-6 ml-4 cursor-pointer hover:opacity-80' src='/images/search-icon.png' />
                <input value={searchKeyword} onChange={(e)=>setSearchKeyword(e.target.value)} className='pl-4 w-40 text-sm text-center' placeholder='검색하기'/>
            </label>
        </div>
        <select value={searchCondition} onChange={(e)=> setSearchCondition(e.target.value)} className='text-center opacity-80 w-24 h-10 outline-none border'>
            <option value="level">직급</option>
            <option value="status">상태</option>
        </select>
        <div>{null} / {null}</div>
    </section>
  )
}
