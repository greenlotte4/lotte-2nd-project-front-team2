import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "@/App.scss";
import Index from "@/pages";
import Main from "@/layout/layout/Main.jsx";
import Login from "@/pages/user/Login.jsx";

import AdminIndex from "./pages/admin/Index";
import MainIndex from "./pages";
import AdminUser from "./pages/admin/User";
import AdminProject from "./pages/admin/Project";
import AdminOutSourcing from "./pages/admin/OutSourcing";
import AdminCommunity from "./pages/admin/Community";
import AdminSchedule from "./pages/admin/Schedule";
import AdminVacation from "./pages/admin/Vacation";
import AdminAttendance from "./pages/admin/Attendance";
import AdminOutSide from "./pages/admin/OutSide";
import ServicePage from "./pages/rending/ServicePage";
import RenderDefaultLayout from "./layout/rending/RenderDefaultLayout";
import { lazy, Suspense, useEffect, useState } from "react";
import PricePage from "./pages/rending/PricePage";
import CommunityIndex from "./pages/community/Index";
import CommunityWrite from "./pages/community/Write";
import CommunityList from "./pages/community/List";
import CommunityView from "./pages/community/View";
import CommunityModify from "./pages/community/Modify";

import Project from "./pages/project/Project";
import Message from "./pages/message/Message";
import Document from "./pages/document/Document";
import Cs from "./pages/cs/Cs";
import Page from "./pages/page/PagePage";
import Calendar from "./pages/calendar/Calendar";
import Register from "./pages/user/Register";
import Terms from "./pages/user/Terms";
import Find from "./pages/user/Find";
import Favorite from "./pages/document/Favorite";
import MyMain from "./pages/my/My";
import MyAttendance from "./pages/my/Attendance";
import FAQPage from "./pages/rending/FAQPage";
import ResultPw from "./pages/user/ResultPw";
import ResultId from "./pages/user/ResultId";
import NewPagePages from "./pages/page/NewPage";
import MyModify from "./pages/my/MyModify";
import MyApproval from "./pages/my/Approval";
import Home from "./pages/home/Home";
import MyPayment from "./pages/my/Payment";
import DocumentList from "./pages/document/DocumentList";
import PageListPage from "./pages/page/PageList";
import PageViewPages from "./pages/page/PageView";
import { useAuthStore } from "./store/useAuthStore";
import FAQWrite from "./pages/rending/WritePage";
import FAQLayout from "./layout/rending/faqLayout";
import CustomAlert from "./components/Alert";
import TestIndex from "./pages/test";
import useUserStore from "./store/useUserStore";
const MainIndexComponent = lazy(() => import("./components/render/main"));

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const isTokenExpired = useAuthStore((state) => state.isTokenExpired);
  const refreshAccessToken = useAuthStore((state) => state.refreshAccessToken);
  const logout = useAuthStore((state) => state.logout);
  const [customAlert, setCustomAlert] = useState(false);
  const [customAlertType, setCustomAlertType] = useState("");
  const [customAlertMessage, setCustomAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [selectedRoomId, setSelectedRoomId] = useState("");

  // 검증 제외 경로
  const excludedRoutesSet = new Set([
    "/",
    "/test",
    "/service",
    "/price",
    "/faq",
    "/user/login",
    "/user/register",
    "/user/find",
    "/user/terms",
  ]);

  useEffect(() => {
    const checkToken = async () => {
      if (excludedRoutesSet.has(location.pathname)) {
        return;
      } // 제외 경로는 검증하지 않음

      const tokenExpired = isTokenExpired();

      if (tokenExpired) {
        const refreshToken = await useAuthStore.getState().getRefreshToken();
        if (!refreshToken) {
          setCustomAlert(true);
          setCustomAlertMessage(
            "로그인 세션이 만료되었습니다. 다시 로그인해주세요."
          );
          setCustomAlertType("error");
          setTimeout(() => {
            setCustomAlert(false);
            logout();
            navigate("/user/login");
          }, 2000);
        }
      }
    };

    checkToken();
  }, [location, isTokenExpired, refreshAccessToken, navigate]);

  return (
    <div id="app-container m-0 xl2:mx-auto">
      <CustomAlert
        type={customAlertType}
        message={customAlertMessage}
        isOpen={customAlert}
      />
      <Routes>
        {/*사이드바 안쓰는 레이아웃 */}
        <Route path="/" element={<RenderDefaultLayout />}>
          <Route
            index
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <MainIndexComponent />
              </Suspense>
            }
          />
          <Route path="test" element={<TestIndex />} />
          <Route path="service" element={<ServicePage />} />
          <Route path="price" element={<PricePage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="faq" element={<FAQLayout />}>
            <Route index element={<FAQPage />} />
            <Route path="write" element={<FAQWrite />} />
          </Route>
        </Route>

        {/* 홈 */}
        <Route path="/home" element={<Main />}>
          <Route index element={<Home />} />
        </Route>

        {/* 유저 */}
        <Route path="/user">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="terms" element={<Terms />} />
          <Route path="find" element={<Find />} />
          <Route path="resultId" element={<ResultId />} />
          <Route path="resultPw" element={<ResultPw />} />
          <Route index element={<Login />} />
        </Route>

        {/* 마이페이지 */}
        <Route path="/my" element={<Main />}>
          <Route index element={<MyMain />} />
          <Route path="modify" element={<MyModify />} />
          <Route path="approval" element={<MyApproval />} />
          <Route path="attendance" element={<MyAttendance />} />
          <Route path="payment" element={<MyPayment />} />
        </Route>

        {/* <Route path='/home' element */}

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
          <Route index element={<CommunityIndex />} />
          <Route path=":boardType/write" element={<CommunityWrite />} />
          <Route path=":boardType/list" element={<CommunityList />} />
          <Route path=":boardType/view/:postId" element={<CommunityView />} />
          <Route path=":boardType/modify" element={<CommunityModify />} />
        </Route>

        {/* 프로젝트 */}
        <Route path="/project" element={<Main />}>
          <Route index element={<Project />}></Route>
        </Route>

        {/* 메신저 */}
        <Route path="/message" element={<Main />}>
          <Route
            index
            element={
              <Message
                selectedRoomId={selectedRoomId}
                setSelectedRoomId={setSelectedRoomId}
              />
            }
          />
        </Route>

        {/* 문서작업 */}
        <Route path="/document" element={<Main />}>
          <Route index element={<Document />} />
          <Route path="favorite" element={<Favorite />} />
          <Route path="list/:dynamicPart" element={<DocumentList />} />
        </Route>

        {/* 달력 */}
        <Route path="/calendar" element={<Main />}>
          <Route index element={<Calendar />} />
        </Route>

        {/* 고객센터 */}
        <Route path="/cs" element={<Main />}>
          <Route index element={<Cs />} />
        </Route>

        {/* 페이지 */}
        <Route path="/page" element={<Main />}>
          <Route index element={<Page />} />
          <Route path="newPage" element={<NewPagePages />} />
          <Route path="list" element={<PageListPage />} />
          <Route path="view/:pageId" element={<NewPagePages />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
