import React, { useEffect, useState } from 'react'
import '@/pages/admin/Admin.scss'
import {CustomSearch} from '@/components/Search'
import { CustomButton } from '../../components/Button'
import { Link } from 'react-router-dom'
import { Modal } from '@/components/Modal'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import Page from '../../components/Page'
import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import useUsersStore from '../../store/zustand'
import axiosInstance from '@/services/axios.jsx'
import UserPage1 from '../../components/admin/user/UserPage1'
import UserPage2 from '../../components/admin/user/UserPage2'
import AdminUserMainTop from '../../components/admin/user/AdminUserMainTop'
export default function AdminUser() {
    const dispatch = useDispatch();
    const [selectOption, setSelectOption] = useState(0);

    const optionChanger = (e)=>{
        setSelectOption(Number(e.target.value))
    }

    return (
      <div id='admin-user-container'>
        <AdminSidebar 
          optionChanger={optionChanger}
        />
        <section className='admin-user-main'>
        <AdminHeader />
          <AdminUserMainTop
              optionChanger={optionChanger}
              selectOption={selectOption}
          />
        {selectOption === 0 &&
          <UserPage1 />
        }
        {selectOption === 1 &&
          <UserPage2 />
        }
        </section>
      </div>
    )
}
