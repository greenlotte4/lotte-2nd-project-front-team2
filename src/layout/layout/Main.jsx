import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '@/layout/sidebar/Sidebar'
import "@/layout/layout/Main.scss"
import Footer from '../footer/Footer';
import MainIndex from '../../pages';
import _ from "lodash";


export default function Main() {
  const location = useLocation('');
  const [chat, setChat] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = _.debounce(() => {
    setIsCollapsed((prev) => !prev);
  }, 300); // 300ms 간격으로 이벤트 실행


  
  return (
    <>
    {location.pathname !== "/user/login" && location.pathname !== "/" && (
      <>
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
