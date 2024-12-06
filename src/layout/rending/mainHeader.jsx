import { Link } from "react-router-dom";

export default function MainHeader() {
  return (
    <>
      {/* Header */}
      <header
        className="fixed top-0 left-0 w-full bg-white bg-opacity-90 backdrop-blur-md border-b border-gray-200 z-50 transition-transform"
        data-aos="fade-down"
        data-aos-duration="1500"
      >
        <div className="bg-[#666bff] text-white text-center py-2 text-sm font-bold">
          <span className="bg-teal-500 text-white px-2 py-1 rounded mr-2">
            New
          </span>
          Plantry <strong>10인 미만 완전 무료!</strong> 지금 바로 시작하세요!
        </div>
        <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex items-center">
            <img
              src="/images/plantry_logo(purple).png"
              alt="Plantry 로고"
              className="w-16"
            />
            <span className="ml-2 text-3xl font-extrabold text-[#333366] hover:text-[#b3b8ff] transition-colors duration-300">
              PLANTY
            </span>
          </div>

          <nav className="flex-1 flex items-center justify-center space-x-8">
            <Link
              to="/service"
              className="text-gray-700 font-semibold transition duration-300 ease-in-out transform hover:scale-105 px-4 py-2 rounded-full hover:bg-[#b4b9ff] hover:text-[#666bff]"
            >
              서비스
            </Link>
            <Link
              to="/price"
              className="text-gray-700 font-semibold transition duration-300 ease-in-out transform hover:scale-105 px-4 py-2 rounded-full hover:bg-[#b4b9ff] hover:text-[#666bff]"
            >
              요금소개
            </Link>
            <Link
              to="/faq"
              className="text-gray-700 font-semibold transition duration-300 ease-in-out transform hover:scale-105 px-4 py-2 rounded-full hover:bg-[#b4b9ff] hover:text-[#666bff]"
            >
              고객센터
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              to="/user/login"  // 로그인 페이지 경로 수정
              className="px-4 py-2 border border-gray-400 rounded text-gray-700 hover:bg-[#666bff] hover:text-white"
            >
              로그인
            </Link>
            <Link
              to="/join"
              className="px-4 py-2 border border-gray-400 rounded text-gray-700 hover:bg-[#666bff] hover:text-white"
            >
              회원가입
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
