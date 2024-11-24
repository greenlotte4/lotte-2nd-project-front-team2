import { Route, Routes, useLocation } from 'react-router-dom'
import '@/App.scss'
import Index from '@/pages'
import Main from '@/layout/layout/Main.jsx'
import Login from '@/pages/user/Login.jsx'
import Board from '@/pages/community/board'
import AdminIndex from './pages/admin/Index'
import MainIndex from './pages'
import AdminUser from './pages/admin/User'
import AdminProject from './pages/admin/Project'
import AdminOutSourcing from './pages/admin/OutSourcing'
import AdminCommunity from './pages/admin/Community'
import AdminSchedule from './pages/admin/Schedule'
import AdminVacation from './pages/admin/Vacation'
import AdminAttendance from './pages/admin/Attendance'
import AdminOutSide from './pages/admin/OutSide'
import ServicePage from './pages/rending/ServicePage'
import RenderDefaultLayout from './layout/rending/RenderDefaultLayout'
import { lazy, Suspense } from 'react'
import PricePage from './pages/rending/PricePage'
import Community from './pages/community/Community'
import Project from './pages/project/Project'
import Message from './pages/message/Message'
import Document from './pages/document/Document'
import Cs from './pages/cs/Cs'
import Page from './pages/page/PagePage'
import Calendar from './pages/calendar/Calendar'
import Register from './pages/user/Register'
import Terms from './pages/user/Terms'
import Find from './pages/user/Find'
import Favorite from './pages/document/Favorite'
import MyMain from './pages/my/My'
import MyAttendance from './pages/my/Attendance'
import FAQPage from './pages/rending/FAQPage'
import ResultPw from './pages/user/ResultPw'
import ResultId from './pages/user/ResultId'
const MainIndexComponent = lazy(() => import("./components/render/main"))


function App() {
  const pathName = useLocation("");
  return (
    <div id='app-container m-0 xl2:mx-auto'>
      <Routes>
        {/* 사이드바 안쓰는 레이아웃 */}
        <Route path="/" element={<RenderDefaultLayout />}>
          <Route index element={<Suspense fallback={<div>Loading...</div>}><MainIndexComponent /></Suspense>} />
          <Route path="service" element={<ServicePage />} />
          <Route path="price" element={<PricePage />} />
          <Route path="faq" element={<FAQPage />} />
        </Route>

        {/* 유저 */}
        <Route path="/user">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="terms" element={<Terms />} />
          <Route path="find" element={<Find />} />
          <Route path='resultId' element={<ResultId/>}/>
          <Route path='resultPw' element={<ResultPw />}/>
          <Route index element={<Login />} />
        </Route>

        {/* 마이페이지 */}
        <Route path='/my' element={<Main />}>
          <Route index element={<MyMain />}/>
          <Route path='attendance' element={<MyAttendance />}/>
        </Route>

        {/* 관리자 */}
        <Route path="/admin" element={<Main />}>
          <Route index element={<AdminIndex />} />
          <Route path="user" element={<AdminUser />} />
          <Route path="project" element={<AdminProject />} />
          <Route path="outsourcing" element={<AdminOutSourcing />} />
          <Route path="community" element={<AdminCommunity />} />
          <Route path="schedule" element={<AdminSchedule />} />
          <Route path="vacation" element={<AdminVacation />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="outside" element={<AdminOutSide />} />
        </Route>

        {/* 커뮤니티 (게시판) */}
        <Route path="/community" element={<Main />}>
          <Route index element={<Community />} />
        </Route>

        {/* 프로젝트 */}
        <Route path='/project' element={<Main />}>
          <Route index element={<Project />}></Route>
        </Route>

        {/* 메신저 */}
        <Route path='/message' element={<Main />}>
          <Route index element={<Message />}/>
        </Route>

        {/* 문서작업 */}
        <Route path='/document' element={<Main />}>
          <Route index element={<Document />}/>
          <Route path='favorite' element={<Favorite />} />
        </Route>

        {/* 달력 */}
        <Route path='/calendar' element={<Main />}>
          <Route index element={<Calendar />}/>
        </Route>

        {/* 고객센터 */}
        <Route path='/cs' element={<Main />}>
          <Route index element={<Cs />}/>
        </Route>

        {/* 페이지 */}
        <Route path='/page' element={<Main />}>
          <Route index element={<Page />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
