import React, { useEffect, useState } from 'react'
import '@/pages/my/My.scss'
import MyAside from '@/components/my/MyAside.jsx';
import { Link, useNavigate, useParams } from "react-router-dom";


export default function MyApproval() {

  const params = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(65)
  // const [menuActive, setMenuActive] = useState("")

  // useEffect(() => {
  //   if (params.page) {
  //     setMenuActive(params.page); // e.g., 'my' from /my or other params
  //   }
  // }, [params.page]);


  
  const profileModify = (e) => {
    e.preventDefault();
    navigate("/my/modify");
  }

  return (
    <div id='my-approval-container'>
      <MyAside />
      <section className='my-approval-main flex flex-col'>
        <article className='py-[30px] px-[50px]'>
          <h2 className='text-lg ml-10'>결재현황</h2>
          <ul className='bg-indigo-50 flex rounded-xl h-[120px] mt-10'>
            <li className='flex flex-col border border-indigo-200 px-[20px] py-[10px] w-1/4 rounded-l-xl'>
              <h3 className='text-sm'>작성 중</h3>
              <span className='w-full mt-[15px] text-center text-2xl text-gray-700'>5</span>
            </li>
            <li className='flex flex-col border border-indigo-200 px-[20px] py-[10px] w-1/4'>
              <h3 className='text-sm'>반려된</h3>
              <span className='w-full mt-[15px] text-center text-2xl text-gray-700'>8</span>
            </li>
            <li className='flex flex-col border border-indigo-200 px-[20px] py-[10px] w-1/4'>
              <h3 className='text-sm'>결재 전</h3>
              <span className='w-full mt-[15px] text-center text-2xl text-gray-700'>13</span>
            </li>
            <li className='flex flex-col border border-indigo-200 px-[20px] py-[10px] w-1/4 rounded-r-xl'>
              <h3 className='text-sm'>결재된</h3>
              <span className='w-full mt-[15px] text-center text-2xl text-gray-700'>999+</span>
            </li>
          </ul>
        </article>
        <article className='py-[20px] px-[50px]'>
          <h2 className='text-lg ml-10'>나의 기안</h2>
          <table className='approval-table w-full mt-10'>
            <tbody>
              <tr className='approval-tr bg-indigo-200'>
                <th className='approval-th rounded-tl-lg'>결재상태</th>
                <th className='approval-th'>결재구분</th>
                <th className='approval-th'>양식</th>
                <th className='approval-th'>제목</th>
                <th className='approval-th'>기안자</th>
                <th className='approval-th rounded-tr-lg'>결재자</th>
              </tr>
              <tr className='approval-tr text-center border-b'>
                <td className='approval-td'>결재대기</td>
                <td className='approval-td'>결재</td>
                <td className='approval-td'>업무보고</td>
                <td className='approval-td'>전사 카카오워크 도입의 건</td>
                <td className='approval-td'>플랜트리 | 박연화</td>
                <td className='approval-td'>하진희</td>
              </tr>
              <tr className='approval-tr text-center border-b'>
                <td className='approval-td'>결재대기</td>
                <td className='approval-td'>결재</td>
                <td className='approval-td'>업무보고</td>
                <td className='approval-td'>전사 카카오워크 도입의 건</td>
                <td className='approval-td'>플랜트리 | 박연화</td>
                <td className='approval-td'>하진희</td>
              </tr>
              <tr className='approval-tr text-center border-b'>
                <td className='approval-td'>결재대기</td>
                <td className='approval-td'>결재</td>
                <td className='approval-td'>업무보고</td>
                <td className='approval-td'>전사 카카오워크 도입의 건</td>
                <td className='approval-td'>플랜트리 | 박연화</td>
                <td className='approval-td'>하진희</td>
              </tr>
              <tr className='approval-tr text-center border-b'>
                <td className='approval-td'>결재대기</td>
                <td className='approval-td'>결재</td>
                <td className='approval-td'>업무보고</td>
                <td className='approval-td'>전사 카카오워크 도입의 건</td>
                <td className='approval-td'>플랜트리 | 박연화</td>
                <td className='approval-td'>하진희</td>
              </tr>
            </tbody>
          </table>
        </article>
        <article className='py-[20px] px-[50px]'>
          <h2 className='text-lg ml-10'>결재 양식</h2>
          <ul className='flex justify-left mt-10'>
            <Link to={"/my/approval"}>
              <li className='border border-indigo-200 rounded-lg w-[180px] h-[150px] mr-10'>
                <h3 className='w-full bg-indigo-100 h-[40px] flex justify-center items-center text-gray-600 font-light'>
                  업무보고</h3>
                <span></span>
              </li>
            </Link>
            <Link to={"/my/approval"}>
              <li className='border border-indigo-200 rounded-lg w-[180px] h-[150px] mr-10'>
                <h3 className='w-full bg-indigo-100 h-[40px] flex justify-center items-center text-gray-600 font-light'>
                  명함신청서</h3>
                <span></span>
              </li>
            </Link>
            <Link to={"/my/approval"}>
              <li className='border border-indigo-200 rounded-lg w-[180px] h-[150px] mr-10'>
                <h3 className='w-full bg-indigo-100 h-[40px] flex justify-center items-center text-gray-600 font-light'>
                  회의록</h3>
                <span></span>
              </li>
            </Link>
            <Link to={"/my/approval"}>
              <li className='border border-indigo-200 rounded-lg w-[180px] h-[150px] mr-10'>
                <h3 className='w-full bg-indigo-100 h-[40px] flex justify-center items-center text-gray-600 font-light'>
                  협조요청</h3>
                <span></span>
              </li>
            </Link>
            <Link to={"/my/approval"}>
              <li className='border border-indigo-200 rounded-lg w-[180px] h-[150px] mr-10'>
                <h3 className='w-full bg-indigo-100 h-[40px] flex justify-center items-center text-gray-600 font-light'>
                  경조금신청서</h3>
                <span></span>
              </li>
            </Link>
            <Link to={"/my/approval"}>
              <li className='border border-indigo-200 rounded-lg w-[180px] h-[150px] mr-10'>
                <h3 className='w-full bg-indigo-100 h-[40px] flex justify-center items-center text-gray-600 font-light'>
                  지출결의서</h3>
                <span></span>
              </li>
            </Link>
          </ul>
        </article>
      </section>
    </div>
  )
}
