import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '@/layout/sidebar/Sidebar'
import "@/layout/layout/Main.scss"
import Footer from '../footer/Footer';
import MainIndex from '../../pages';
import _ from "lodash";


export default function Main() {
  const location = useLocation('');
  const [chat, setChat] = useState(false);
  const navi = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };



  
  return (
    <>
    {location.pathname !== "/user/login" && location.pathname !== "/" && (
      <>
      <header className=''>
        <div className='header h-[50px] w-[1920px] mx-auto flex'>
        <div className={`${isCollapsed ? 'collapsed' : 'expanded'} side-header`} ></div>
        <div className={`${isCollapsed ? 'collapsed' : 'expanded'} w-full bg-[#f1f1f8] side-content-header flex justify-between items-center px-[20px]`}>
          <div className='flex gap-[5px] cursor-pointer hover:opacity-80' onClick={()=>navi("/")}>
            <img src='/images/plantry_logo.png' className='w-[45px] h-[45px]'></img>
            <div className='flex items-center font-bold text-[24px] font-purple'>PLANTRY</div>
          </div>
          <div className='flex justify-end gap-[10px] items-center'>
            <div className='flex items-center'>이상훈님 안녕하세요.</div>
            <img src='/images/logout-icon.png' className='w-[30px] h-[30px] cursor-pointer' onClick={()=>{navi("/user/login"); }}></img>
            <img src='/images/dumy-profile.png' className='w-[45px] h-[45px]'></img>
            <img src='/images/dumy-profile.png' className='w-[45px] h-[45px]'></img>
          </div>
        </div>
        </div>
      </header>
      <div className="main-layout">
        <div className="main-content">
          <Sidebar  isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}  />
          <div className={`content ${isCollapsed ? "sidebar-collapsed" : ""}`}>
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
        </>
      
    )}
    {(location.pathname === "/user/login" || location.pathname === "/") && (
      <>
        <Outlet />
        {location.pathname !== "/user/login" && <Footer />}
      </>
    )}
  </>
  )
}

