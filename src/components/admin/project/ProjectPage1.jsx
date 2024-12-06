import React, { useEffect, useState } from 'react'
import { AdminCard3 } from '../AdminCard3'
import Select from './Select'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/services/axios.jsx'
import { useDispatch, useSelector } from 'react-redux'
import Leader from './modal/Leader'

export default function Project1({optionChanger, selectOption}) {
    const dispatch = useDispatch();
    const [openLeader, setOpenLeader] = useState(false);
    const selectedTeamId = useSelector((state) => state.team.selectedTeamId);
    const [group,setGroup] = useState('')
    const [leader, setLeader] = useState({});

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
          const resp = await axiosInstance.get('/api/admin/project?group='+group)
          console.log(resp.data)
          return resp.data
        } catch (err) {
          return err;
        }
      },
      enabled : !!group,
      cacheTime : 10 * 1000 * 60,
      refetchOnWindowFocus : false
    })

    useEffect(()=>{
      if(!isLoadingProject&&!isErrorProject&&projectData){
        setLeader(projectData.leader)
      }
    },[projectData])


  return (
    <>
      <Leader 
        isOpen = {openLeader}
        onClose = {()=>setOpenLeader(false)}
        id = {leader.id}
      />
      
      
      <section className='flex items-center gap-4 mb-12'>
            <Select
                optionChanger={optionChanger}
                selectOption={selectOption}
            />
            </section>
            
            <section className='flex justify-around inline-block mb-12'>
            {isLoadingProject?(<p>로딩중...</p>):isErrorProject?(<p>에러....</p>)? !projectData.leader : (<p>알수없는 에러...</p>) :
                (
                <AdminCard3 
                clickHandler={()=>setOpenLeader(true)}
                title="부서장"
                leader={leader}
                messanger={leaderDummy.messanger}
                />)}
                <AdminCard3 
                clickHandler={null}
                title="업무"
                content="화면설계 및 구현"
                messanger={leaderDummy.messanger}
                />
                <AdminCard3 
                clickHandler={null}
                title="진행도"
                content={10/12}
                messanger={leaderDummy.messanger}
                />
            </section>
            <section className='flex justify-around inline-block'>
                <AdminCard3 
                clickHandler={null}
                title="외주업체"
                content="그린디자인"
                messanger={leaderDummy.messanger}
                />
                <AdminCard3 
                clickHandler={null}
                title="휴가"
                content="없음"
                messanger={leaderDummy.messanger}
                />
            </section>
     
      </>
  )
}
