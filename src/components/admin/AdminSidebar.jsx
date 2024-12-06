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
import GroupInfoModal from './user/modal/GroupInfoModal';
export default function AdminSidebar({
    optionChanger
}) {
    const dispatch = useDispatch();
    const selectedTeamId = useSelector((state) => state.team.selectedTeamId);

    const [user,setUser] = useState(false);
    const [team,setTeam] = useState(false);
    const [department,setDepartment] = useState(false);
    const [outsourcing,setOutsourcing] = useState(false);
    const [selectOption, setSelectOption] = useState(0);
    const [teamNav,setTeamNav] = useState(true);
    const [departmentNav,setDepartmentNav] = useState(true);
    const [activeGroup, setActiveGroup] = useState(null);
    const [selectedTeamNav, setSelectedTeamNav] = useState("");
    const [openGroupInfoModal, setOpenGroupInfoModal] = useState(false);
    const [groupType, setGroupType] = useState("");

    const teamNavRef = useRef(null);
    const departmentNavRef = useRef(null);

    const { data: departmentData, isLoading: isLoadingDepartments, isError: isErrorDepartments, error: departmentError } = useQuery({
        queryKey: ['departments'],
        queryFn: async () => {
            const response = await axiosInstance.get('/api/departments');
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
        enabled: true
    });

    const { data: teamData, isLoading: isLoadingTeams, isError: isErrorTeams, error: teamError } = useQuery({
        queryKey: ['teams'],
        queryFn: async () => {
            const response = await axiosInstance.get('/api/teams');
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        enabled: true
    });

    const {data : allCnt, isLoading : isLoadingAllCnt , isError : isErrorAllCnt} = useQuery({
        queryKey: ['alls'],
        queryFn : async () => {
            try {
                const resp = await axiosInstance.get("/api/users/all/cnt")
                return resp.data
            } catch (err) {
                return err;
            }
        },
        cacheTime : 10 * 1000 * 60,
        enabled : true,
        staleTime : 5 * 60 * 1000
    })

    const changeActiveHandler = (e) => {
        const teamId = e.target.dataset.id;  // 클릭한 팀의 id 값 가져오기
        dispatch(setSelectedTeamId(teamId));
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
        <section className='department-modal'>
            <DepartmentModal
                isOpen={department}
                onClose={closeDepartment}
                text="부서 생성"
            />
        </section>
        <section>
            <GroupInfoModal 
                isOpen={openGroupInfoModal}
                onClose={()=>setOpenGroupInfoModal(false)}
                team={selectedTeamNav}
                text={groupType}
            />
        </section>
        {(isLoadingTeams||isLoadingDepartments)?(<p>로딩중...</p>):(isErrorTeams||isErrorDepartments)?(<p>데이터를 불러오지 못했습니다...</p>)
            :(teamData.teamCnt && teamData.teamCnt != 0 && departmentData.depCnt && departmentData.depCnt !=0 )
            ?(<><section className='flex justify-center mb-8'><p className='text-lg'>전체 ({teamData.teamCnt + departmentData.depCnt})</p></section></>)
            :(<><section className='flex justify-center mb-8'><p className='text-lg'>전체 (0)</p></section></>)
        }
        <section className='flex justify-center mb-8 w-26'>
            <select className='outline-none border rounded-l-md opacity-80 h-11 w-24 text-center text-sm'>
                <option>이름</option>
                <option>그룹장</option>
                <option>담당업무</option>
            </select>
            <label className='flex justify-start items-center border rounded-r-md w-[120px] h-11'>
                <img className='opacity-50 w-6 h-6 ml-4' src='/images/search-icon.png' />
                <input className='w-[60px] text-sm' placeholder='검색하기'/>
            </label>
        </section>
        <section className='mb-6'>
            <div className='flex justify-between items-center'>
                {(isLoadingTeams)?(<p>로딩중...</p>):(isErrorTeams)?(<p>데이터를 불러오지 못했습니다...</p>):(teamData.teamCnt && teamData.teamCnt != 0)?
                (<><p>팀 ({teamData.teamCnt})</p><img className='w-3 h-2 cursor-pointer' onClick={closeTeamNav} src='/images/arrow-top.png'/></>)
                :(<><p>팀 (0)</p><img className='w-3 h-2 cursor-pointer' onClick={closeTeamNav} src='/images/arrow-top.png'/></>)}
            </div>
            <article ref={teamNavRef} className='team-nav'>{(isLoadingTeams)?(<p>로딩중...</p>):(isErrorTeams)?(<p>데이터를 불러오지 못했습니다...</p>):
                (Array.isArray(teamData.teams)&&teamData.teams!=0)?
                teamData.teams.map(v => {
                    return (
                    <div
                        key={v.id}
                        className={`flex justify-between items-center px-8 mt-6 rounded-md ${selectedTeamId === v.name ? 'bg-blue-100' : ''}`}
                        data-id={v.name}
                    >
                        <p className='cursor-pointer' onClick={changeActiveHandler} data-id={v.name} >{v.name}</p> <img className='cursor-pointer' onClick={()=>{
                            setSelectedTeamNav(v.name);
                            setActiveGroup(prevActiveTeam => prevActiveTeam === v.name ? null : v.name);
                            setGroupType('팀 정보');
                            setOpenGroupInfoModal(true);
                        }} data-id={v.name} src='/images/button-dot.png'/>
                    </div>
                    )
                }):(<p className='mt-6'>등록된 팀이 없습니다...</p>)}
            </article>
        </section>
        <section className='mb-6'>
            <div className='flex justify-between items-center'>
                {(isLoadingDepartments)?(<p>로딩중...</p>):(isErrorDepartments)?(<p>데이터를 불러오지 못했습니다...</p>)
                    :(departmentData.depCnt && departmentData.depCnt != 0)
                    ?(<><p>부서 ({departmentData.depCnt})</p><img className='w-3 h-2 cursor-pointer' onClick={closeDepartmentNav} src='/images/arrow-top.png'/></>)
                    :(<><p>부서 (0)</p><img className='w-3 h-2 cursor-pointer' onClick={closeDepartmentNav} src='/images/arrow-top.png'/></>)
                }
            </div>
            <article ref={departmentNavRef} className='team-nav'>
            {(isLoadingDepartments)?(<p>로딩중...</p>):(isErrorDepartments)?(<p>데이터를 불러오지 못했습니다...</p>)
                :(Array.isArray(departmentData.deps)&&departmentData.deps!=0)
                ?departmentData.deps.map(v => {
                    return (
                    <div
                        key={v.id}
                        className={`flex justify-between items-center px-8 mt-6 rounded-md ${selectedTeamId === v.name ? 'bg-blue-100' : ''}`}
                        data-id={v.name}
                    >
                        <p className='cursor-pointer' onClick={changeActiveHandler} data-id={v.name} >{v.name}</p> 
                        <img className='cursor-pointer' onClick={()=>{
                            setSelectedTeamNav(v.name);
                            setActiveGroup(prevActiveTeam => prevActiveTeam === v.name ? null : v.name);
                            setGroupType('부서 정보');
                            setOpenGroupInfoModal(true);
                        }} data-id={v.name} src='/images/button-dot.png'/>
                    </div>)})
                :(<p className='mt-6'>등록된 부서가 없습니다...</p>)}
            </article>
        </section>
        <section className='mb-6'>
            <div className='flex justify-between items-center cursor-pointer'>
                {(isLoadingAllCnt)?(<p>로딩중...</p>):(isErrorAllCnt)?(<p>알수없는에러...</p>)
                :(allCnt==0)?(<p onClick={()=>{dispatch(setSelectedTeamId("전체"))}}>전체 (0)</p>)
                :(<p onClick={()=>{dispatch(setSelectedTeamId("전체"))}}>전체 ({allCnt})</p>)
                }
                
            </div>
        </section>
        <section className='mt-auto flex flex-col gap-5'>
            <button onClick={openDepartment} className='bg-blue white h-8 rounded-md'>부서 생성</button>
            <button onClick={openTeam} className='bg-blue white h-8 rounded-md'>팀 생성</button>
        </section>
      </aside>
  )
}
