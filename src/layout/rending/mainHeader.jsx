import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/axios";
import { useAuthStore } from "../../store/useAuthStore";
import useUserStore from "../../store/useUserStore";

const profileURL = 'http://3.35.170.26:90/profileImg/';

export default function MainHeader() {
  const logout = useAuthStore((state) => state.logout);
  const user = useUserStore((state) => state.user);
  const [name, setName] = useState(null);
  const queryClient = useQueryClient(); // useQueryClient 훅 임포트 및 사용

  // 유저 정보 쿼리
  const {
    data: userName,
    isLoading: isLoadingUserName,
    isError: isErrorUserName,
    error: userNameError,
  } = useQuery({
    queryKey: [`user-${user?.uid}`], // queryKey에 user.uid 반영
    queryFn: async () => {
      try {
        const resp = await axiosInstance.get("/api/user/name");
        console.log("API 응답 데이터:", resp.data);
        return resp.data;
      } catch (err) {
        console.error("API 요청 에러:", err);
        throw err; // 에러를 React Query로 전달
      }
    },
    enabled: !!user?.uid, // user 객체와 uid가 존재할 때만 쿼리 실행
    retry: false,
  });

  useEffect(() => {
    if (!isLoadingUserName && !isErrorUserName && userName) {
      setName(userName?.name);
    }
  }, [userName, isLoadingUserName, isErrorUserName]);

  const logoutHandler = async (e) => {
    e.preventDefault();
    queryClient.invalidateQueries(`user-${user?.uid}`); // queryKey와 동일하게 설정
    useUserStore.setState({ user: null });
    setName(null);
    logout();
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white bg-opacity-90 backdrop-blur-md border-b border-gray-200 z-50 transition-transform">
      <div className="bg-[#666bff] text-white text-center py-2 text-sm font-bold">
        <span className="bg-teal-500 text-white px-2 py-1 rounded mr-2">
          New
        </span>
        Plantry <strong>10인 미만 완전 무료!</strong> 지금 바로 시작하세요!
      </div>

      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto px-4 py-3">
        <Link to="/" className="flex items-center">
          <img src="/images/plantry_logo(purple).png" alt="Plantry 로고" className="w-16" />
          <span className="ml-2 text-3xl font-extrabold text-[#333366] hover:text-[#b3b8ff] transition-colors duration-300">
            PLANTY
          </span>
        </Link>

        <nav className="flex-1 flex items-center justify-center space-x-8">
          <Link to="/service" className="text-gray-700 font-semibold transition duration-300 ease-in-out transform hover:scale-105 px-4 py-2 rounded-full hover:bg-[#b4b9ff] hover:text-[#666bff]">
            서비스
          </Link>
          <Link to="/price" className="text-gray-700 font-semibold transition duration-300 ease-in-out transform hover:scale-105 px-4 py-2 rounded-full hover:bg-[#b4b9ff] hover:text-[#666bff]">
            요금소개
          </Link>
          <Link to="/faq" className="text-gray-700 font-semibold transition duration-300 ease-in-out transform hover:scale-105 px-4 py-2 rounded-full hover:bg-[#b4b9ff] hover:text-[#666bff]">
            고객센터
          </Link>
        </nav>
        {userName == null ? (
          <div className="flex items-center space-x-4">
            <Link
              to="/user/login"
              className="px-4 py-2 border border-gray-400 rounded text-gray-700 hover:bg-[#666bff] hover:text-white transition duration-300"
            >
              로그인
            </Link>
            <Link
              to="/user/terms"
              className="px-4 py-2 border border-gray-400 rounded text-gray-700 hover:bg-[#666bff] hover:text-white transition duration-300"
            >
              회원가입
            </Link>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <div className="flex justify-end gap-[10px] items-center">
              <button
                onClick={logoutHandler}
                className="px-4 py-2 border border-gray-400 rounded text-gray-700 hover:bg-[#666bff] hover:text-white transition duration-300"
              >
                로그아웃
              </button>
              {user.role === 'ADMIN'? (
                <Link to="/admin/dashboard" className="px-4 py-2 border border-gray-400 rounded text-gray-700 hover:bg-[#666bff] hover:text-white transition duration-300">
                  관리자 전용
                </Link>
              ):(
                <>
                  <Link
                    to="/home"
                    className="px-4 py-2 border border-gray-400 rounded text-gray-700 hover:bg-[#666bff] hover:text-white transition duration-300"
                  >
                    PLANTRY
                  </Link>
                  <div className="flex items-center">
                    <div className="border-2 border-white bg-green-500 rounded-full w-[13px] h-[13px] relative top-[15px] left-[50px] z-[100]"></div>
                    <div className="drop-shadow-lg bg-white w-[45px] h-[45px] flex items-center justify-center overflow-hidden rounded-full">
                      <img
                        className="w-full h-full object-cover flex items-center between-center"
                        src={
                          userName?.profileImgPath
                            ? `${profileURL}${userName.profileImgPath}`
                            : "/images/default-profile.png"
                        }
                        alt="프로필 이미지"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          )}
      </div>
      {/* </div> */}
    </header>
  );
}
