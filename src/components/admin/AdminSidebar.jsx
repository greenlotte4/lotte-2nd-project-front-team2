import React, { useEffect, useRef, useState } from 'react'
import {CustomSearch} from '@/components/Search'
import { CustomButton } from '../../components/Button'
import { Modal } from '../Modal';
import '@/components/admin/AdminCard.scss'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTeamId } from '../../store/store';
import DepartmentModal from './DepartmentModal';
import CustomAlert from '../Alert';
import axiosInstance from '@/services/axios.jsx'
import GroupInfoModifyModal from './GroupInfoModifyModal';
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
    const [dep,setDep] = useState([]);
    const [depCnt,setDepCnt] = useState();
    const [tea,setTea] = useState([]);
    const [teamCnt,setTeamCnt] = useState();
    const [activeGroup, setActiveGroup] = useState(null);
    const [selectedTeamNav, setSelectedTeamNav] = useState("");
    //                                       useState                                       //
    //                                        useRef                                        //
    const teamNavRef = useRef(null);
    const departmentNavRef = useRef(null);

    //                                        useRef                                        //

    //                                        useEffect                                     //
    useEffect (()=> {
        axiosInstance
            .get("/api/departments")
            .then((resp)=>{
                setDep(resp.data.deps)
                setDepCnt(resp.data.depCnt)
            })
            .catch()
        
        axiosInstance
            .get("/api/teams")
            .then((resp)=>{
                setTea(resp.data.teams)
                setTeamCnt(resp.data.teamCnt)
            })
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

    const openNaviBox = (e) => {
        const teamName = e.target.dataset.id;
        setSelectedTeamNav(teamName)
        setActiveGroup(prevActiveTeam => prevActiveTeam === teamName ? null : teamName);
    };
    const closeNaviBox = () => {setActiveGroup(false)}
    //                                        Handler                                        //
  return (
    <aside className='admin-aside overflow-scroll flex flex-col scrollbar-none'>
        <section className='team-modal'>
            <DepartmentModal
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
        <section>
            <GroupInfoModifyModal
                isOpen={activeGroup}
                onClose={closeNaviBox}
                text={selectedTeamNav}
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
                <p>팀 ({teamCnt})</p><img className='w-3 h-2 cursor-pointer' onClick={closeTeamNav} src='/images/arrow-top.png'/>
            </div>
            <article ref={teamNavRef} className='team-nav'>
                {tea.map(v => {
                    return (
                    <div
                        key={v.id}
                        className={`flex justify-between items-center px-8 mt-6 rounded-md ${selectedTeamId === v.name ? 'bg-blue-100' : ''}`}
                        data-id={v.name}
                    >
                        <p className='cursor-pointer' onClick={changeActiveHandler} data-id={v.name} >{v.name}</p> <img className='cursor-pointer' onClick={openNaviBox} data-id={v.name} src='/images/button-dot.png'/>
                    </div>
                    )
                })}
            </article>
        </section>
        <section className='mb-6'>
            <div className='flex justify-between items-center'>
                <p>부서 ({depCnt})</p><img className='w-3 h-2 cursor-pointer' onClick={closeDepartmentNav} src='/images/arrow-top.png'/>
            </div>
            <article ref={departmentNavRef} className='department-nav'>
                {dep.map(v => {
                    return (
                    <div
                        key={v.id}
                        className={`relative flex justify-between items-center px-8 mt-6 rounded-md ${selectedTeamId === v.name ? 'bg-blue-100' : ''}`}
                        data-id={v.name}
                    >
                        <p className='cursor-pointer' onClick={changeActiveHandler} data-id={v.name} >{v.name}</p> <img className='cursor-pointer' onClick={openNaviBox} data-id={v.name} src='/images/button-dot.png'/>
                    </div>
                    )
                })}
                
            </article>
        </section>
        <section className='mt-auto flex flex-col gap-5'>
            <button onClick={openDepartment} className='bg-blue white h-8 rounded-md'>부서 생성</button>
            <button onClick={openTeam} className='bg-blue white h-8 rounded-md'>팀 생성</button>
        </section>
      </aside>
  )
}
