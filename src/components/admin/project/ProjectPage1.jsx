import React, { useEffect, useState } from 'react'
import { AdminCard3 } from '../AdminCard3'
import Select from './Select'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/services/axios.jsx'
import { useDispatch, useSelector } from 'react-redux'

export default function Project1({optionChanger, selectOption}) {
    const dispatch = useDispatch();
    const [openLeader, setOpenLeader] = useState(false);
    const selectedTeamId = useSelector((state) => state.team.selectedTeamId);
    const [group,setGroup] = useState('')
    const [leader, setLeader] = useState({});
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [alert, setAlert] = useState(false);
    const [leaderId, setLeaderId] = useState(0);
    const [page,setPage] = useState(1)
    const [subPage,setSubPage] = useState(0);


    const leaderDummy = {
        name : "박연화",
        messanger : "일단 더미데이터"
    }

    useEffect(()=>{
      if(selectedTeamId!=''){
        setGroup(selectedTeamId)
      }
    },[selectedTeamId])

    const {
      data : projectData,
      isLoading : isLoadingProject,
      isError : isErrorProject
    } = useQuery({
      queryKey : ['admin-project',group],
      queryFn : async () => {
        try {
          const resp = await axiosInstance.get('/api/admin/projects?group='+group)
          console.log(resp.data)
          return resp.data
        } catch (err) {
          return err;
        }
      },
      enabled : !!group && page == 1,
      cacheTime : 10 * 1000 * 60,
      refetchOnWindowFocus : false
    })

    useEffect(()=>{
      if(!isLoadingProject&&!isErrorProject&&projectData){
        setLeader(projectData)
        console.log(projectData)
      }
    },[projectData])

    const {
      data : column ,
      isLoading : isLoadingColumn ,
      isError : isErrorColumn
    } = useQuery({
      queryKey : ['project-column',subPage],
      queryFn : async () => {
        try {
          const resp = await axiosInstance.get("/api/admin/project/columns?id="+subPage)
          console.log(resp.data)
          return resp.data
        } catch (err) {
          return err
        }
      },
      enabled : !!group && subPage !=0,
      cacheTime : 10 * 1000 * 60,
      refetchOnWindowFocus : false
    })

    useEffect(()=>{
      if(Array.isArray(column)&&column.length>0){
        console.log(column)
      }
    },[column])

  return (
    <>
      <section className='flex items-center gap-4'>
            <div className='border-b text-[12px] text-gray-400 w-full'>
              <button onClick={()=>setPage(1)} className={page==1 ? 'bg-blue-200 w-[120px] h-[40px] text-gray-700' :'hover:bg-gray-200 hover:text-gray-600 w-[120px] h-[40px]'}>프로젝트</button>
              <button onClick={()=>setPage(2)} className={page==2 ? 'bg-blue-200 w-[120px] h-[40px] text-gray-700' : 'hover:bg-gray-200 hover:text-gray-600 w-[120px] h-[40px]'}>일정</button>
              <button onClick={()=>setPage(3)} className={page==3 ? 'bg-blue-200 w-[120px] h-[40px] text-gray-700' : 'hover:bg-gray-200 hover:text-gray-600 w-[120px] h-[40px]'}>진행상황</button>
              <button onClick={()=>setPage(4)} className={page==4 ? 'bg-blue-200 w-[120px] h-[40px] text-gray-700' : 'hover:bg-gray-200 hover:text-gray-600 w-[120px] h-[40px]'}>프로젝트등록</button>
            </div>
      </section>
      <section className="overflow-auto max-h-[400px] min-h-[400px] scrollbar-none">
      <div className='text-[12px] text-gray-400'>
          {Array.isArray(projectData)&&projectData.length>0 ? projectData.map((v)=>{return(
            <button onClick={()=>setSubPage(v.projectId)} className={subPage==(v.projectId) ? 'bg-blue-200 w-[120px] h-[40px] text-gray-700' :'hover:bg-gray-200 hover:text-gray-600 w-[120px] h-[40px]'}>{v.projectTitle}</button>
          )})
          : (<p className='ml-[480px] mt-[200px]'>진행중인 프로젝트가 없습니다...</p>)
          }
        </div>
      </section>
      </>
  )
}
