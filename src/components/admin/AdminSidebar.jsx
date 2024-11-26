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
import { useQuery } from '@tanstack/react-query';
import { useStore } from 'zustand';
import useUsersStore from '../../store/zustand';
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
    const [activeGroup, setActiveGroup] = useState(null);
    const [selectedTeamNav, setSelectedTeamNav] = useState("");
    //                                       useState                                       //
    //                                        useRef                                        //
    const teamNavRef = useRef(null);
    const departmentNavRef = useRef(null);

    //                                        useRef                                        //

    //                                        useEffect                                     //

    const { data: departmentData, isLoading: isLoadingDepartments, isError: isErrorDepartments, error: departmentError } = useQuery({
        queryKey: ['departments'],
        queryFn: async () => {
            const response = await axiosInstance.get('/api/departments');
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });

    // useQuery for teams
    const { data: teamData, isLoading: isLoadingTeams, isError: isErrorTeams, error: teamError } = useQuery({
        queryKey: ['teams'],
        queryFn: async () => {
            const response = await axiosInstance.get('/api/teams');
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    if (isLoadingDepartments || isLoadingTeams) {
        return <p>Loading...</p>;
    }

    if (isErrorDepartments) {
        return <p>Error loading departments: {departmentError.message}</p>;
    }

    if (isErrorTeams) {
        return <p>Error loading teams: {teamError.message}</p>;
    }
    //                                        useEffect                                     //

    //                                        Handler                                       //
    const changeActiveHandler = (e) => {
        const teamId = e.target.dataset.id;  // 클릭한 팀의 id 값 가져오기
        dispatch(setSelectedTeamId(teamId));

        axiosInstance
            .get(`/api/group/users/detail?team=${selectedTeamId}`,null)
            .then((resp)=>{
                console.log(resp.data)
                useUsersStore.getState().setUsersData(resp.data);
            })
            .catch((err)=>{

            })
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
                <p>팀 ({teamData.teamCnt})</p><img className='w-3 h-2 cursor-pointer' onClick={closeTeamNav} src='/images/arrow-top.png'/>
            </div>
            <article ref={teamNavRef} className='team-nav'>
                {teamData.teams.map(v => {
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
                <p>부서 ({departmentData.depCnt})</p><img className='w-3 h-2 cursor-pointer' onClick={closeDepartmentNav} src='/images/arrow-top.png'/>
            </div>
            <article ref={departmentNavRef} className='department-nav'>
                {departmentData.deps.map(v => {
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
