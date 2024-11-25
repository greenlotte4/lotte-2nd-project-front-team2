import React, { useState } from 'react'
import '@/pages/admin/Admin.scss'
import {CustomSearch} from '@/components/Search'
import { CustomButton } from '../../components/Button'
import { Link } from 'react-router-dom'
import { Modal } from '@/components/Modal'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import Page from '../../components/Page'

export default function AdminUser() {
    
    //                                      useState                                           //
    const [user,setUser] = useState(false);
    const [team,setTeam] = useState(false);
    const [department,setDepartment] = useState(false);
    const [outsourcing,setOutsourcing] = useState(false);
    const [selectOption, setSelectOption] = useState(0);
    //                                      useState                                           //

    //                                      Handler                                            //
    const optionChanger = (e)=>{
        setSelectOption(Number(e.target.value))
        console.log(selectOption)
    }
    const openUser = () => {setUser(true)}; 
    const closeUser = () => {setUser(false)};
    const openTeam = () => {setTeam(true)}; 
    const closeTeam = () => {setTeam(false)};
    const openDepartment = () => {setDepartment(true)}; 
    const closeDepartment = () => {setDepartment(false)};
    const openOutsourcing = () => {setOutsourcing(true)};
    const closeOutsourcing = () => {setOutsourcing(false)};
    // console.log(sel)
    const [departmentEntity , setDepartmentEntity] = useState({
        depName : "",
        depDesc : "",
        depLeader : "",
        depMembers : [],
        depLink : "",
    })
    
    //                                      Handler                                            //
  return (
    <div id='admin-user-container'>
      <AdminSidebar />
      <section className='admin-user-main'>
      {selectOption === 0 &&
      <>
        <AdminHeader />
        <section className='flex items-center gap-4 mb-12'>
            <div className='ml-4 text-2xl'>
                <select value={selectOption} onChange={optionChanger} className='outline-none border rounded-md text-xl p-2 text-center'>
                    <option value={0}>인사관리</option>
                    <option value={1}>가입승인요청</option>
                </select>
            </div>
            <div className='ml-auto flex'>
                <CustomSearch 
                    width1='40'
                    width2='72'
                />
            </div>
            <select className='text-center opacity-80 w-24 h-10 ouline-none border'>
                <option>직급</option>
                <option>상태</option>
            </select>
            <div>7 / 11</div>
        </section>
        <table className="w-full table-auto border-collapse mb-16">
            <thead className='bg-gray-200 h-16'>
                <tr className='text-center'>
                    <th className="w-1/10 rounded-tl-lg"><input type="checkbox" /></th>
                    <th className="w-1/10">번호</th>
                    <th className="w-2/10">이름</th>
                    <th className="w-2/10">소속</th>
                    <th className="w-1/10">상태</th>
                    <th className="w-1/10">근태</th>
                    <th className="w-1/10">직급</th>
                    <th className="w-1/10">가입일자</th>
                    <th className="w-1/10 rounded-tr-lg">비고</th>
                </tr>
            </thead>
            <tbody className='h-16'>
                <tr className='text-center'>
                    <td className="w-1/10"><input type="checkbox" /></td>
                    <td className="w-1/10">1</td>
                    <td className="w-2/10">홍길동</td>
                    <td className="w-2/10">개발</td>
                    <td className="w-1/10">활동</td>
                    <td className="w-1/10">정상</td>
                    <td className="w-1/10">사원</td>
                    <td className="w-1/10">2024-01-01</td>
                    <td className="w-1/10">비고 없음</td>
                </tr>
            </tbody>
            <tbody className='h-16'>
                <tr className='text-center'>
                    <td className="w-1/10"><input type="checkbox" /></td>
                    <td className="w-1/10">1</td>
                    <td className="w-2/10">홍길동</td>
                    <td className="w-2/10">개발</td>
                    <td className="w-1/10">활동</td>
                    <td className="w-1/10">정상</td>
                    <td className="w-1/10">사원</td>
                    <td className="w-1/10">2024-01-01</td>
                    <td className="w-1/10">비고 없음</td>
                </tr>
            </tbody>
            <tbody className='h-16'>
                <tr className='text-center'>
                    <td className="w-1/10"><input type="checkbox" /></td>
                    <td className="w-1/10">1</td>
                    <td className="w-2/10">홍길동</td>
                    <td className="w-2/10">개발</td>
                    <td className="w-1/10">활동</td>
                    <td className="w-1/10">정상</td>
                    <td className="w-1/10">사원</td>
                    <td className="w-1/10">2024-01-01</td>
                    <td className="w-1/10">비고 없음</td>
                </tr>
            </tbody>
        </table>
        <section className='flex justify-end gap-4 text-xs mb-10'>
            <button onClick={openOutsourcing} className='bg-blue white h-10 rounded-xl w-24'>외주업체 등록</button>
        </section>
        <Page />
        <section className='outsourcing-modal'>
            <Modal
                isOpen={outsourcing}
                onClose={closeOutsourcing}
                text="외주업체 등록"
            />
        </section>
        <section className='user-modal'>
            <Modal
                isOpen={user}
                onClose={closeUser}
                text="사원 등록"
            />
        </section>
        </>
      }
      {selectOption === 1 &&
        <>
        <section className='flex mb-32'>
            <p className='text-lg flex items-center justify-center w-80 rounded-md bg-gray-200 mx-auto'>부서 1</p>
            <div className="flex"> 
                <img src='/images/dumy-profile.png' className="w-1/3" />
                <img src='/images/dumy-profile.png' className="w-1/3" />
                <img src='/images/dumy-profile.png' className="w-1/3" />
                <img src='/images/dumy-profile.png' className="w-1/3" />
            </div>
        </section>
        <section className='flex items-center gap-4 mb-12'>
            <div className='ml-4 text-2xl'>
                <select value={selectOption} onChange={optionChanger} className='outline-none border rounded-md text-xl p-2 text-center'>
                    <option value={0}>인사관리</option>
                    <option value={1}>가입승인요청</option>
                </select>
            </div>
            <div className='ml-auto flex'>
                <CustomSearch 
                    width1='40'
                    width2='72'
                />
            </div>
            <select className='text-center opacity-80 w-24 h-10 ouline-none border'>
                <option>직급</option>
                <option>상태</option>
            </select>
            <div>7 / 11</div>
        </section>
        <table className="w-full table-auto border-collapse mb-16">
            <thead className='bg-gray-200 h-16'>
                <tr className='text-center'>
                    <th className="w-1/10 rounded-tl-lg"><input type="checkbox" /></th>
                    <th className="w-1/10">번호</th>
                    <th className="w-2/10">이름</th>
                    <th className="w-1/10">아이디</th>
                    <th className="w-2/10">타입</th>
                    <th className="w-2/10">요청날짜</th>
                    <th className="w-1/10">생년월일</th>
                    <th className="w-1/10 rounded-tr-lg">승인</th>
                </tr>
            </thead>
            <tbody className=''>
                <tr className='text-center h-12 text-gray-600 text-sm'>
                    <th className="w-1/12 rounded-tl-lg"><input type="checkbox" /></th>
                    <th className="w-2/12">1</th>
                    <th className="w-1/12">전규북</th>
                    <th className="w-1/12">gyubux</th>
                    <th className="w-2/12">외주업체</th>
                    <th className="w-2/12">2024-11-22</th>
                    <th className='w-2/12'>1995-02-28</th>
                    <th className="w-1/12 rounded-tr-lg">
                        <button className='w-10 text-xs border rounded-3xl h-8 text-gray-600 hover:opacity-80'>승인</button>
                    </th>
                </tr>
                <tr className='text-center h-12 text-gray-600 text-sm'>
                    <th className="w-1/12 rounded-tl-lg"><input type="checkbox" /></th>
                    <th className="w-2/12">1</th>
                    <th className="w-1/12">전규북</th>
                    <th className="w-1/12">gyubux</th>
                    <th className="w-2/12">외주업체</th>
                    <th className="w-2/12">2024-11-22</th>
                    <th className='w-2/12'>1995-02-28</th>
                    <th className="w-1/12 rounded-tr-lg">
                        <button className='w-10 text-xs border rounded-3xl h-8 text-gray-600 hover:opacity-80'>승인</button>
                    </th>
                </tr>
                <tr className='text-center h-12 text-gray-600 text-sm'>
                    <th className="w-1/12 rounded-tl-lg"><input type="checkbox" /></th>
                    <th className="w-2/12">1</th>
                    <th className="w-1/12">전규북</th>
                    <th className="w-1/12">gyubux</th>
                    <th className="w-2/12">외주업체</th>
                    <th className="w-2/12">2024-11-22</th>
                    <th className='w-2/12'>1995-02-28</th>
                    <th className="w-1/12 rounded-tr-lg">
                        <button className='w-10 text-xs border rounded-3xl h-8 text-gray-600 hover:opacity-80'>승인</button>
                    </th>
                </tr>
                <tr className='text-center h-12 text-gray-600 text-sm'>
                    <th className="w-1/12 rounded-tl-lg"><input type="checkbox" /></th>
                    <th className="w-2/12">1</th>
                    <th className="w-1/12">전규북</th>
                    <th className="w-1/12">gyubux</th>
                    <th className="w-2/12">외주업체</th>
                    <th className="w-2/12">2024-11-22</th>
                    <th className='w-2/12'>1995-02-28</th>
                    <th className="w-1/12 rounded-tr-lg">
                        <button className='w-10 text-xs border rounded-3xl h-8 text-gray-600 hover:opacity-80'>승인</button>
                    </th>
                </tr>
                <tr className='text-center h-12 text-gray-600 text-sm'>
                    <th className="w-1/12 rounded-tl-lg"><input type="checkbox" /></th>
                    <th className="w-2/12">1</th>
                    <th className="w-1/12">전규북</th>
                    <th className="w-1/12">gyubux</th>
                    <th className="w-2/12">외주업체</th>
                    <th className="w-2/12">2024-11-22</th>
                    <th className='w-2/12'>1995-02-28</th>
                    <th className="w-1/12 rounded-tr-lg">
                        <button className='w-10 text-xs border rounded-3xl h-8 text-gray-600 hover:opacity-80'>승인</button>
                    </th>
                </tr>
            </tbody>
        </table>
        <Page />
      </>
      }
      </section>
    </div>
  )
}
