import React, { useEffect, useRef, useState } from 'react'
import {CustomSearch} from '@/components/Search'
import { CustomButton } from '../../components/Button'
import { Modal } from '../Modal';
import '@/components/admin/AdminCard.scss'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTeamId } from '../../store/store';
import DepartmentModal from './DepartmentModal';
import CustomAlert from '../Alert';
export default function AdminSidebar({
    onchange
}) {
    const dispatch = useDispatch();
    const selectedTeamId = useSelector((state) => state.team.selectedTeamId);

    //                                      useState                                       //
    const [user,setUser] = useState(false);
    const [team,setTeam] = useState(false);
    const [department,setDepartment] = useState(false);
    const [outsourcing,setOutsourcing] = useState(false);
    const [selectOption, setSelectOption] = useState(0);
    const [teamNav,setTeamNav] = useState(true);
    const [departmentNav,setDepartmentNav] = useState(true);
    //                                       useState                                       //
    //                                        useRef                                        //

    const teamNavRef = useRef(null);
    const departmentNavRef = useRef(null);

    //                                        useRef                                        //

    //                                        useEffect                                     //
    useEffect (()=> {
        
    },[])

    //                                        useEffect                                     //

    //                                        Handler                                       //
    const changeActiveHandler = (e) => {
        const teamId = e.target.dataset.id;  // 클릭한 팀의 id 값 가져오기
        dispatch(setSelectedTeamId(teamId));
    }
    const optionChanger = (e)=>{
        setSelectOption(Number(e.target.value))
    }
    const openUser = () => {setUser(true)} 
    const closeUser = () => {setUser(false)}
    const openTeam = () => {setTeam(true)} 
    const closeTeam = () => {setTeam(false)}
    const openDepartment = () => {setDepartment(true)} 
    const closeDepartment = () => {setDepartment(false)}
    const openOutsourcing = () => {setOutsourcing(true)} 
    const closeOutsourcing = () => {setOutsourcing(false)}
    const closeTeamNav = (e) => {
        if(teamNav){
            if(teamNavRef.current){
                teamNavRef.current.style.maxHeight = '0';
            }
            setTeamNav(!teamNav);
            setTimeout(()=>{
                e.target.src='/images/arrow-bot.png'
            },1000)
            
        } else {
            if(teamNavRef.current){
                teamNavRef.current.style.maxHeight = '1000px';
            }
            setTeamNav(!teamNav)
            e.target.src='/images/arrow-top.png'
        }        
    }
    const closeDepartmentNav = (e) => {
        if(departmentNav){
            setDepartmentNav(!departmentNav);
            setTimeout(()=>{
                e.target.src='/images/arrow-bot.png'
            },1000)
            if(departmentNavRef.current){
                departmentNavRef.current.style.maxHeight = '0';
            }
        } else {
            setDepartmentNav(!departmentNav)
            e.target.src='/images/arrow-top.png'
            if(departmentNavRef.current){
                departmentNavRef.current.style.maxHeight = '1000px';
            }
        }        
    }

    //                                        Handler                                        //
  return (
    <aside className='admin-aside overflow-scroll flex flex-col scrollbar-none'>
        <section className='team-modal'>
            <Modal
                isOpen={team}
                onClose={closeTeam}
                text="팀 생성"
            />
        </section>
        <section className='user-modal'>
            <Modal
                isOpen={user}
                onClose={closeUser}
                text="사원 등록"
            />
        </section>
        <section className='department-modal'>
            <DepartmentModal
                isOpen={department}
                onClose={closeDepartment}
                text="부서 생성"
            />
        </section>
        <section className='outsourcing-modal'>
            <Modal
                isOpen={outsourcing}
                onClose={closeOutsourcing}
                text="외주업체 등록"
            />
        </section>
        
        <section className='flex justify-center mb-8'><p className='text-lg'>팀 / 부서 (6)</p></section>
        <section className='flex justify-center mb-8 w-26'>
            <select className='outline-none border rounded-l-md opacity-80 h-11 w-24 text-center text-sm'>
                <option>참여자</option>
                <option>부장</option>
                <option>담당업무</option>
            </select>
            <CustomSearch 
                width1='24'
                width2='40'
            />
        </section>
        <section className='mb-6'>
            <div className='flex justify-between items-center'>
                <p>팀 (3)</p><img className='w-3 h-2 cursor-pointer' onClick={closeTeamNav} src='/images/arrow-top.png'/>
            </div>
            <article ref={teamNavRef} className='team-nav'>
                <div className={`flex justify-between items-center px-8 mt-6 rounded-md ${selectedTeamId === 'team-1' ? 'bg-blue-100' : ''}`} data-id='team-1'>
                    <p className='cursor-pointer' onClick={changeActiveHandler} data-id='team-1' >team-1</p> <img src='/images/button-dot.png'/>
                </div>
                <div className={`flex justify-between items-center px-8 mt-6 rounded-md ${selectedTeamId === 'team-2' ? 'bg-blue-100' : ''}`} data-id='team-2'>
                    <p className='cursor-pointer' onClick={changeActiveHandler} data-id='team-2' >team-2</p> <img src='/images/button-dot.png'/>
                </div>
                <div className={`flex justify-between items-center px-8 mt-6 rounded-md ${selectedTeamId === 'team-3' ? 'bg-blue-100' : ''}`} data-id='team-3'>
                    <p className='cursor-pointer' onClick={changeActiveHandler} data-id='team-3' >team-3</p> <img src='/images/button-dot.png'/>
                </div>
            </article>
        </section>
        <section className='mb-6'>
            <div className='flex justify-between items-center'>
                <p>부서 (3)</p><img className='w-3 h-2 cursor-pointer' onClick={closeDepartmentNav} src='/images/arrow-top.png'/>
            </div>
            <article ref={departmentNavRef} className='department-nav'>
            <div className={`flex justify-between items-center px-8 mt-6 rounded-md ${selectedTeamId === 'dep-1' ? 'bg-blue-100' : ''}`} data-id='dep-1'>
                    <p className='cursor-pointer' onClick={changeActiveHandler} data-id='dep-1' >dep-1</p> <img src='/images/button-dot.png'/>
                </div>
                <div className={`flex justify-between items-center px-8 mt-6 rounded-md ${selectedTeamId === 'dep-2' ? 'bg-blue-100' : ''}`} data-id='dep-2'>
                    <p className='cursor-pointer' onClick={changeActiveHandler} data-id='dep-2' >dep-2</p> <img src='/images/button-dot.png'/>
                </div>
                <div className={`flex justify-between items-center px-8 mt-6 rounded-md ${selectedTeamId === 'dep-3' ? 'bg-blue-100' : ''}`} data-id='dep-3'>
                    <p className='cursor-pointer' onClick={changeActiveHandler} data-id='dep-3' >dep-3</p> <img src='/images/button-dot.png'/>
                </div>
            </article>
        </section>
        <section className='mt-auto flex flex-col gap-5'>
            <button onClick={openDepartment} className='bg-blue white h-8 rounded-md'>부서 생성</button>
            <button onClick={openTeam} className='bg-blue white h-8 rounded-md'>팀 생성</button>
        </section>
      </aside>
  )
}
