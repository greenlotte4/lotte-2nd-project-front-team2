import React, { useCallback, useRef, useState } from 'react'
import '@/pages/admin/Admin.scss'
import {CustomSearch} from '@/components/Search'
import { CustomButton } from '../../components/Button';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Page from '../../components/Page';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import PostOutsourcing from '../../components/admin/outsourcing/modal/PostOutsourcing';
import axiosInstance from '@/services/axios.jsx'


export default function AdminOutSourcing() {
    const [selectOption, setSelectOption] = useState(0);
    const queryClient = useQueryClient();
    const [postModal, setPostModal] = useState(false);
    const [keyword,setKeyword] = useState('')
    

    const optionChanger = (e)=>{
        setSelectOption(Number(e.target.value))
        console.log(selectOption)
    }
    // const {
    //     data : outsourcing,
    //     isLoading : isLoadingOutsourcing,
    //     isError : isErrorOutsourcing
    // } = useQuery({
    //     queryKey : ['outsourcing'],
    //     queryFn : async () => {
    //         try {
    //             const resp = await axiosInstance.get("/api/admin/outsourcings")
    //             return resp.data
    //         } catch (err) {
    //             return err
    //         }
    //     }
    // })

    const fetchOutsourcing = async ({pageParam}) => {
        try {
            const response = await axiosInstance.get(`/api/admin/outsourcings?page=${pageParam}`)
            console.log(response.data)
            return response.data
        } catch (err){
            return err
        }
    }

    const { 
        data : outsourcings , 
        fetchNextPage : fetchNextPageOutsourcings , 
        hasNextPage : hasNextPageOutsourcings,
        isFetchingNextPage : isFetchingNextPageOutsourcings,
        refetch : refetchOutsourcings
    } 
    = useInfiniteQuery({
        queryKey : ['outsourcing'],
        queryFn : fetchOutsourcing,
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
            const outsourcings = data.pages.flatMap((page) => page.outsourcings);
            return { ...data, pages: [{ ...data.pages[0], outsourcings: outsourcings }] };
        },
        cacheTime : 6 * 1000 * 60 ,
        retry: false,
    })
    
    const observer = useRef();
    const lastUserRef = useCallback((node) => {
        if (isFetchingNextPageOutsourcings) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPageOutsourcings) {
            fetchNextPageAllUsers(); 
        }
        });
        if (node) observer.current.observe(node);
    }, [isFetchingNextPageOutsourcings, hasNextPageOutsourcings, fetchNextPageOutsourcings]);
  return (
    <div id='admin-outsourcing-container'>
        <PostOutsourcing 
            isOpen={postModal}
            onClose={()=>setPostModal(false)}
        />
      <AdminSidebar />
      <section className='admin-outsourcing-main'>
      <AdminHeader />
            <section className='flex items-center gap-4 mb-12'>
                <div className='ml-4 text-2xl'>
                    <select value={selectOption} onChange={optionChanger} className='outline-none border rounded-md text-xl p-2 text-center'>
                        <option value={0}>외주업체 현황</option>
                        {/* <option value={1}>소속인원</option>
                        <option value={2}>배정업무</option>
                        <option value={3}>요청사항</option> */}
                    </select>
                </div>
                <div className='ml-auto flex'>
                    <CustomSearch 
                        width1='40'
                        width2='72'
                    />
                </div>
                <select className='text-center opacity-80 w-24 h-10 outline-none border'>
                    <option>회사명</option>
                    <option>번호</option>
                    <option>파견부서</option>
                    <option>결제일</option>
                </select>
                <div>7 / 11</div>
            </section>
            <section className='overflow-auto max-h-[400px] min-h-[400px] scrollbar-none '>
            <table className="w-full table-auto border-collapse mb-16">
                <thead className='bg-gray-200 h-16'>
                    <tr className='text-center'>
                        <th className="w-1/10 rounded-tl-lg"><input type="checkbox" /></th>
                        <th className="w-1/10">번호</th>
                        <th className="w-2/10">회사명</th>
                        <th className="w-2/10">전화번호</th>
                        <th className="w-1/10">파견인원</th>
                        <th className="w-1/10">파견부서</th>
                        <th className="w-1/10">배정업무</th>
                        <th className="w-1/10">결제일</th>
                        <th className="w-1/10 rounded-tr-lg">진행도</th>
                    </tr>
                </thead>
                <tbody className=''>
                {outsourcings && outsourcings.pages[0] && outsourcings.pages[0].outsourcings && outsourcings.pages[0].outsourcings.length > 0 ? (
                outsourcings.pages[0].outsourcings.map((v,i) => (
                    <tr key={i} className='text-center max-h-[50px]'>
                        <td className="h-[40px]"><input type="checkbox" /></td>
                        <td className="h-[40px]">{i+1}</td>
                        <td className="h-[40px]">{v.name}</td>
                        <td className="h-[40px]">{v.hp}</td>
                        <td className="h-[40px]">{v.size}명</td>
                        <td className="h-[40px]">{v.paymentDate}</td>
                        <td className="h-[40px]">{v.start}</td>
                        <td className="h-[40px]">{v.end}</td>
                        <td className="h-[40px]">비고 없음</td>
                    </tr>  
                ))
                ) : 
                (
                    <li>로딩중입니다...</li> 
                )}
                {hasNextPageOutsourcings && (
                    <div ref={lastUserRef} className='text-center mt-4'>
                        {isFetchingNextPageOutsourcings ? 'Loading more...' : 'Load more'}
                    </div>
                )}
                </tbody>
        </table>    
        </section>
        <section className='flex justify-end gap-4 text-xs mb-10'>
        <button onClick={()=>setPostModal(true)} className='bg-blue white h-10 rounded-xl w-28'>외주업체등록</button>
        <button onClick={null} className='bg-blue white h-10 rounded-xl w-28'>파견자등록</button>
        </section>
      </section>
    </div>
  )
}
