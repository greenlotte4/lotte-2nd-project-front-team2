import { Link } from "react-router-dom";

export default function MainFooter() {
  return (
    <footer className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left items-start">
        {/* 서비스 섹션 */}
        <section>
          <h4 className="font-bold text-lg mb-2">
            <Link to="/service">서비스</Link>
          </h4>
          <p className="text-gray-600">
            <Link to="">UI design</Link>
          </p>
          <p className="text-gray-600">
            <Link to="">UX design</Link>
          </p>
        </section>

        {/* 요금소개 섹션 */}
        <section>
          <h4 className="font-bold text-lg mb-2">
            <Link to="">요금소개</Link>
          </h4>
          <p className="text-gray-600">
            <Link to="">가격</Link>
          </p>
          <p className="text-gray-600">
            <Link to="">혜택</Link>
          </p>
        </section>

        {/* 고객센터 섹션 */}
        <section>
          <h4 className="font-bold text-lg mb-2">
            <Link to="">고객센터</Link>
          </h4>
          <p className="text-gray-600">
            <Link to="">FAQ</Link>
          </p>
          <p className="text-gray-600">
            <Link to="">Q&A</Link>
          </p>
        </section>

        {/* SNS 섹션 */}
        <section className="flex justify-center md:justify-end space-x-4">
          <Link to="">
            <img src="/images/X Logo.png" alt="sns-X Logo" className="w-6 h-6" />
          </Link>
          <Link to="">
            <img src="/images/Logo Instagram.png" alt="sns-instagram Logo" className="w-6 h-6" />
          </Link>
          <Link to="">
            <img src="/images/Logo YouTube.png" alt="sns-youtube Logo" className="w-6 h-6" />
          </Link>
          <Link to="">
            <img src="/images/LinkedIn.png" alt="sns-LinkedIn Logo" className="w-6 h-6" />
          </Link>
        </section>
      </div>

      {/* 하단 카피라이트 */}
      <p className="text-center mt-12 text-gray-400 text-sm">
        Copyright © 2024, Made with by 
        <span className="text-black font-medium"> Prantry Technologies </span>
        Version 0.1.2-SNAPSHOT
      </p>
    </footer>
  );
}
