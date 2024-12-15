import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "@/layout/sidebar/Sidebar.scss";
import closeArrow from "@/assets/sidebar-open.png";
import mainMenu from "@/assets/sidebar-main.png";
import projectMenu from '@/assets/sidebar-project.png';
import userMenu from '@/assets/sidebar-user.png';
import outSourcingMenu from '@/assets/sidebar-outsourcing.png';
import communityMenu from '@/assets/sidebar-task.png';
import scheduleMenu from '@/assets/sidebar-schedule.png';
import vacationMenu from '@/assets/sidebar-vacation.png';
import { useAuthStore } from "../../store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import useUserStore from "../../store/useUserStore";



export default function Sidebar({ isCollapsed, toggleSidebar }) {
  const location = useLocation().pathname; // 현재 경로 가져오기
  const [path, setPath] = useState(0);
  const sidebarRef = useRef(null); // 사이드바 참조
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate();
  const user = useUserStore((state)=> state.user);

  // 활성화 상태 저장
  const [isActive, setIsActive] = useState(() => {
    const savedState = localStorage.getItem("activeState");
    return savedState ? JSON.parse(savedState) : 0;
  });

  // 경로 매핑
  useEffect(() => {
    const pathMapping = {
      "/admin": { path: 1, active: 0 },
      "/admin/user": { path: 1, active: 1 },
      "/admin/project": { path: 1, active: 2 },
      "/admin/outsourcing": { path: 1, active: 3 },
      "/admin/community": { path: 1, active: 4 },
      "/admin/schedule": { path: 1, active: 5 },
      "/admin/vacation": { path: 1, active: 6 },
      "/admin/attendance": { path: 1, active: 7 },
      "/admin/outside": { path: 1, active: 8 },

      "/home": { path: 0, active: 0 },
      "/my": { path: 0, active: 1 },
      "/project": { path: 0, active: 2 },
      "/document": { path: 0, active: 3 },
      "/calendar": { path: 0, active: 5 },
      "/community": { path: 0, active: 4 },
      "/cs": { path: 0, active: 6 },
      "/message": { path: 0, active: 6 },
      "/page": { path: 0, active: 7 },
    };

    const { path, active } = pathMapping[location] || { path: null, active: null };

    if (path !== null && active !== null) {
      setPath(path);
      setIsActive(active);
    }
  }, [location]);

  useEffect(() => {
    localStorage.setItem("activeState", JSON.stringify(isActive));
  }, [isActive]);

    //          handler           //
    const homeActive = () => {
      setIsActive(0)
  }
  const userActive = (e) => {
      setIsActive(1)
  };
  const projectActive = (e) => {
    setIsActive(2)
  };
  const outsourcingActive = (e) => {
    setIsActive(3)
  };
  const communityActive = (e) => {
    setIsActive(4)
  };
  const scheduleActive = (e) => {
    setIsActive(5)
  };
  const vacationActive = (e) => {
    setIsActive(6)
  };
  const attendanceActive = (e) => {
    setIsActive(7)
  };
  const outsideActive = (e) => {
    setIsActive(8)
  };

  const activeHandler = () => {

  }
  const queryClient = useQueryClient();
  const logoutHandler = async () =>{
    queryClient.invalidateQueries(`${user.uid}`); 
    logout();
    navigate("/user/login");
  }


  return (
    
  <div
        ref={sidebarRef}
        className={`sidebar-container ${isCollapsed ? "collapsed" : "expanded"}`}
      >    
    <ul>
      <li onClick={toggleSidebar} className="sidebar-close-btn">
        <img src={closeArrow} alt={isCollapsed ? "Expand" : "Collapse"} />
      </li>
      <>{ path ===0 && (
          <div className="sidebar-links">
          <Link to="/home">
            <li
              className={isActive === 0 ? "sidebar-close-btn bg-blue-100" : "sidebar-close-btn"}
            >
              <img src={mainMenu} />
              {!isCollapsed && <p>HOME</p>}
            </li>
          </Link>
          <Link to="/my">
            <li
              className={isActive === 1 ? "sidebar-close-btn bg-blue-100" : "sidebar-close-btn"}
            >
              <img style={{ opacity: "0.6" }} src="/images/sidebar-user.png" />
              {!isCollapsed && <p>내 정보 관리</p>}
            </li>
          </Link>
          <Link to="/project">
            <li
              className={isActive === 2 ? "sidebar-close-btn bg-blue-100" : "sidebar-close-btn"}
            >
              <img style={{ opacity: "0.6" }} src="/images/sidebar-project.png" />
              {!isCollapsed && <p>프로젝트</p>}
            </li>
          </Link>
          <Link to="/document">
            <li
              className={isActive === 3 ? "sidebar-close-btn bg-blue-100" : "sidebar-close-btn"}
            >
              <img style={{ opacity: "0.6" }} src="/images/sidebar-document.png" />
              {!isCollapsed && <p>드라이브</p>}
            </li>
          </Link>
          <Link to="/calendar">
            <li
              className={isActive === 5 ? "sidebar-close-btn bg-blue-100" : "sidebar-close-btn"}
            >
              <img style={{ opacity: "0.6" }} src="/images/sidebar-schedule.png" />
              {!isCollapsed && <p>일정</p>}
            </li>
          </Link>
          <Link to="/community">
            <li
              className={isActive === 4 ? "sidebar-close-btn bg-blue-100" : "sidebar-close-btn"}
            >
              <img style={{ opacity: "0.6" }} src="/images/sidebar-community.png" />
              {!isCollapsed && <p>게시판</p>}
            </li>
          </Link>
          {/* <Link to="/cs">
            <li
              className={isActive === 6 ? "sidebar-close-btn bg-blue-100" : "sidebar-close-btn"}
            >
              <img style={{ opacity: "0.6" }} src="/images/sidebar-cs.png" />
              {!isCollapsed && <p>고객센터</p>}
            </li>
          </Link> */}
          <Link to="/message">
            <li
            className={isActive === 6 ? "sidebar-close-btn bg-blue-100" : "sidebar-close-btn"}
            >
              <img style={{ opacity: "0.6" }} src="/images/sidebar-mail.png" />
              {!isCollapsed && <p>메신저</p>}
            </li>
          </Link>
          <Link to="/page">
            <li
              className={isActive === 7 ? "sidebar-close-btn bg-blue-100" : "sidebar-close-btn"}
            >
              <img style={{ opacity: "0.6" }} src="/images/sidebar-page.png" />
              {!isCollapsed && <p>페이지</p>}
            </li>
          </Link>
          <Link to="/">
            <li>
              <img style={{ opacity: "0.6" }} src="/images/sidebar-cs.png" />
              {!isCollapsed && <p>고객센터</p>}
            </li>
          </Link>
          <li
            onClick={logoutHandler}
          >
            <img style={{ opacity: "0.6" }} src="/images/logout-icon.png" />
            {!isCollapsed && <p>로그아웃</p>}
          </li>
        </div>
      )}
       {path === 1 && (
          <div className='sidebar-links'>
          <Link to="/admin" >
            <li onClick={homeActive} className={isActive===0 ? 'sidebar-close-btn bg-blue-100' : "sidebar-close-btn"}>
              <img src={mainMenu} />
              {!isCollapsed &&  <p>HOME</p>}
            </li>
          </Link>
          <Link to="/admin/user">
            <li onClick={userActive} className={isActive===1 ? 'sidebar-close-btn bg-blue-100' : "sidebar-close-btn"}>
              <img style={{opacity:'0.6'}} src={userMenu}/>
              {!isCollapsed && <p>유저 관리</p>}
            </li>
          </Link>
          <Link to="/admin/project">
            <li onClick={projectActive} className={isActive===2 ? 'sidebar-close-btn bg-blue-100' : "sidebar-close-btn"}>
              <img src={projectMenu} />
              {!isCollapsed && <p>업무 분담</p>}
            </li>
          </Link>
          <Link to="/admin/outsourcing">
            <li onClick={outsourcingActive} className={isActive===3 ? 'sidebar-close-btn bg-blue-100' : "sidebar-close-btn"}>
              <img style={{opacity:'0.6'}} src={outSourcingMenu} />
              {!isCollapsed && <p>외주업체 관리</p>}
            </li>
          </Link>
          <Link to="/admin/community">
            <li onClick={communityActive} className={isActive===4 ? 'sidebar-close-btn bg-blue-100' : "sidebar-close-btn"}>
              <img style={{opacity:'0.6', width:'25px', marginRight:'25px'}} src={communityMenu} />
              {!isCollapsed && <p>커뮤니티 관리</p>}
            </li>
          </Link>
          <Link to="/admin/schedule">
            <li onClick={scheduleActive} className={isActive===5 ? 'sidebar-close-btn bg-blue-100' : "sidebar-close-btn"}>
              <img style={{opacity:'0.6', width:'25px', marginRight:'25px'}} src={scheduleMenu} />
              {!isCollapsed && <p>일정 관리</p>}
            </li>
          </Link>
          <Link to="/admin/vacation">
            <li onClick={vacationActive} className={isActive===6 ? 'sidebar-close-btn bg-blue-100' : "sidebar-close-btn"}>
              <img style={{opacity:'0.3', width:'25px', marginRight:'25px'}} src={vacationMenu} />
              {!isCollapsed && <p>휴가 관리</p>}
            </li>
          </Link>
          <Link to="/admin/attendance">
            <li onClick={attendanceActive} className={isActive===7 ? 'sidebar-close-btn bg-blue-100' : "sidebar-close-btn"}>
              <img style={{opacity:'0.3', width:'25px', marginRight:'25px'}} src="/images/sidebar-attendance.png" />
              {!isCollapsed && <p>근태 관리</p>}
            </li>
          </Link>
          <Link to="/admin/outside">
            <li onClick={outsideActive} className={isActive===8 ? 'sidebar-close-btn bg-blue-100' : "sidebar-close-btn"}>
              <img style={{opacity:'0.6', width:'25px', marginRight:'25px'}} src="/images/sidebar-outside.png" />
              {!isCollapsed && <p>외근 관리</p>}
            </li>
          </Link>
          <li
            className={isActive === 8 ? "sidebar-close-btn bg-blue-100" : "sidebar-close-btn"}
            onClick={logoutHandler}
          >
            <img style={{ opacity: "0.6" }} src="/images/logout-icon.png" />
            {!isCollapsed && <p>로그아웃</p>}
          </li>
        </div>
       )}
      </>
      
    </ul>
  </div>
  );
}
