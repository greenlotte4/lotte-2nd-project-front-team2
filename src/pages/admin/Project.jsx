import React, { useState } from 'react'
import '@/pages/admin/Admin.scss'
import {CustomSearch} from '@/components/Search'
import { AdminCard3 } from '../../components/admin/AdminCard3'
import { CustomButton } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { useDispatch } from 'react-redux';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Page from '../../components/Page';
import Select from '../../components/admin/project/Select';
import ProjectPage1 from '../../components/admin/project/ProjectPage1';
import ProjectPage2 from '../../components/admin/project/ProjectPage2';
import ProjectPage3 from '../../components/admin/project/ProjectPage3';

export default function AdminProject() {

    //          useState          //
    const [selectOption, setSelectOption] = useState(0);
    const [leader, setLeader] = useState(false);
    const [task, setTask] = useState(false);
    const [progress, setProgress] = useState(false);
    const [outsourcing, setOutsourcing] = useState(false);
    const [vacation,setVacation] = useState(false);
    const [assignor,setAssignor] = useState(false);
    const [smprogress,setSmProgress] = useState(false);
    const [taskreq,setTaskreq] = useState(false);
    const [smtask,setSmTask] = useState(false);
    const [makeTask,setMakeTask] = useState(false);
    //          useState          //
    
    //          Handler          //
    const optionChanger = (e)=>{
        setSelectOption(Number(e.target.value))
        console.log(selectOption)
    }

    //          Handler          //
    const leaderDummy = {
        name : "박연화",
        messanger : "일단 더미데이터"
    }

  return (
    <div id='admin-project-container'>
      <AdminSidebar />
      <section className='admin-project-main'>
      <AdminHeader />
      {selectOption===0 &&
        <ProjectPage1 
            optionChanger={optionChanger}
            selectOption={selectOption}
        />
      }
      {selectOption === 1 &&
        <ProjectPage2 
            optionChanger={optionChanger}
            selectOption={selectOption}
        /> 
      }
      {selectOption === 2 &&
        <ProjectPage3 
            optionChanger={optionChanger}
            selectOption={selectOption}
        />
      }
      {selectOption === 3 &&
            <>
            <section className='flex items-center gap-4 mb-12'>
                <Select
                    optionChanger={optionChanger}
                    selectOption={selectOption}
                />
                <div className='ml-auto flex'>
                    <CustomSearch 
                        width1='40'
                        width2='72'
                    />
                </div>
                <select className='text-center opacity-80 w-24 h-10 outline-none border'>
                    <option>직급</option>
                    <option>상태</option>
                    <option>업무</option>
                </select>
                <div>7 / 11</div>
            </section>    
            </>   
      }
      </section>
    </div>
  )
}
