import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import axiosInstance from '@/services/axios.jsx'
import ApprovalModal from './modal/ApprovalModal';
import UserPage2Resp from './loading/UserPage2Resp';
export default function UserPage2() {
    const [approvalModal, setApprovalModal] = useState(false);
    const [userId, setUserId] = useState(0);

    // const { 
    //     data: aprovalsData, 
    //     isLoading: isLoadingApprovals, 
    //     isError: isErrorApprovals, 
    //     error: approvalsError 
    // } = useQuery({
    //     queryKey: ['approvals'],
    //     queryFn: async () => {
    //         const response = await axiosInstance.get(`/api/group/users/approval`);
    //         return response.data;
    //     },
    //     staleTime : 0,
    //     cacheTime : 60 * 5 * 1000,
    //     refetchOnWindowFocus: true,
    // });

    // if (isLoadingApprovals) {
    //     return <UserPage2Resp text="로딩중입니다"/>;
    // }

    // if (isErrorApprovals) {
    //     return <UserPage2Resp text={approvalsError.response.data}/>;
    // }

    // if (!Array.isArray(aprovalsData) || aprovalsData.length === 0) {
    //     return <UserPage2Resp text="승인요청이없스니다"/>;
    //     }   

    // const openApprovalModal = (e) => {
    //     setUserId(e.target.dataset.id)
    //     setApprovalModal(true)
    // }
    // const closeApprovalModal = () => {setApprovalModal(false)}

    return (
        <>
        <section className="overflow-auto max-h-[300px] min-h-[300px] scrollbar-none mb-16 px-[40px]">
                <table className="w-full table-auto border-collapse mb-16">
                    <thead className='bg-gray-200 h-16 sticky top-0 z-10'>
                        <tr className='text-center'>
                            <th className="w-[42px] rounded-tl-lg"><input type="checkbox" /></th>
                            <th className="w-[103px]">번호</th>
                            <th className="w-[212px]">이름</th>
                            <th className="w-[212px]">이메일</th>
                            <th className="w-[212px]">아이디</th>
                            <th className="w-[212px]">가입일자</th>
                            <th className="w-[150px] rounded-tr-lg">승인</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {aprovalsData?.map((v,i) => {
                            return (
                            <tr key={v.id} className='text-center h-16 border-b'>
                                <td><input type='checkbox'></input></td>
                                <td>{i+1}</td>
                                <td>{v.name}</td>
                                <td>{v.email}</td>
                                <td>{v.uid}</td>
                                <td>{v.createAt}</td>
                                <td>
                                    <button onClick={openApprovalModal} data-id={v.id} className='w-[80px] border h-[30px] text-xs text-gray-400 hover:bg-blue-100'>승인하기</button>
                                </td>
                            </tr>
                            )
                        })} */}
                    </tbody>
                </table>
            </section>
            <button className='bg-purple white w-[80px] h-[40px] rounded-md ml-[40px]'>선택삭제</button>
            {/* <ApprovalModal 
                isOpen={approvalModal}
                onClose={closeApprovalModal}
                userId={userId}
            /> */}
            </>
      )
}
