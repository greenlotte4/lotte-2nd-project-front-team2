import React, { useEffect, useState } from "react";
import "@/pages/test.scss";
import Aos from "aos";
import { Link } from "react-router-dom";

export default function TestIndex() {
  const [showAllCards, setShowAllCards] = useState(false); // 더보기 버튼 상태
  const [activeMenu, setActiveMenu] = useState(null); // 현재 활성화된 메뉴 인덱스
  const [cards, setCards] = useState([
    "캘린더",
    "게시판",
    "자료실",
    "커뮤니티",
    "프로젝트",
    "채팅",
  ]); // 카드 데이터

  useEffect(() => {
    Aos.init({
      duration: 1500, // 애니메이션 지속 시간
      easing: "ease-in-out-back", // 부드러운 애니메이션 효과
      once: true, // 한 번만 실행
    });
  }, []);

  const handleShowMore = () => {
    setShowAllCards(!showAllCards); // 더보기/숨기기 버튼 토글
  };

  const handleMenuClick = (index) => {
    if (activeMenu === index) {
      // 이미 활성화된 메뉴 클릭 시 초기 상태로 복구
      setActiveMenu(null);
      setCards(["캘린더", "게시판", "자료실", "커뮤니티", "프로젝트", "채팅"]);
      setShowAllCards(false);
    } else {
      // 새로운 메뉴 클릭 시 해당 카드 맨 앞으로 이동
      setActiveMenu(index);
      const selectedCard = cards[index];
      const reorderedCards = [
        selectedCard,
        ...cards.filter((_, i) => i !== index),
      ];
      setCards(reorderedCards);
    }
  };

  return (
    <div id="landing" lang="ko">
      <header className="header" data-aos="fade-down" data-aos-duration="1500">
        <div className="header-top">
          <div className="announcement" data-aos="fade-up" data-aos-delay="100">
            <span className="new-tag">New</span> Lion 오피스{" "}
            <strong>10인 미만 완전 무료! </strong> 지금 바로 시작하세요!
          </div>
        </div>
        <div className="gnb_pc inner_header">
          <ul className="list_gnb">
            <li
              className="logo-container"
              data-aos="zoom-in"
              data-aos-delay="100"
            >
              <img
                src="/images/plantry_logo(purple).png"
                alt="LION 로고"
                className="header-logo"
              />
              <span className="logo-text"></span>
            </li>
          </ul>
          <ul className="list_gnb menu-center">
            <li className="menu-item" data-aos="zoom-in" data-aos-delay="200">
              <Link to="/features">기능소개</Link>
            </li>
            <li className="menu-item" data-aos="zoom-in" data-aos-delay="400">
              <Link to="/pricing">요금소개</Link>
            </li>
            <li className="menu-item" data-aos="zoom-in" data-aos-delay="600">
              <Link to="/support">지원센터</Link>
            </li>
          </ul>
          <div className="login" data-aos="zoom-in-left" data-aos-delay="800">
            <Link to="/login" className="menu-item">
              로그인
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section
          className="top floating-section"
          id="scroll_sectionTop"
          data-aos="fade-up"
        >
          <div className="title">
            <h2>
              <span>모든 비즈니스에 AI를 더하다.</span>
              <br />
              <span className="gr">
                <em>업무플랫폼</em> <em>Lion 오피스</em>
              </span>
            </h2>
          </div>
          <div
            className="lion-logo-container"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <img
              src="/images/plantry_logo(purple).png"
              alt="plantry 로고"
              className="lion-logo"
            />
            <h3 className="lion-subtitle">
              LOTTE INFORMATION & ONLINE NETWORK
            </h3>
          </div>
        </section>

        <section
          className="feature"
          id="main_feature"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="title">
            <img
              src="/images/rending_background.png"
              alt="배너이미지"
              className="responsive-img"
              loading="lazy"
            />
            <h2 className="main-heading">
              Lion 오피스 하나면 <br className="m" /> 충분해요!
            </h2>
          </div>

          {/* 메뉴 버튼 */}
          <div className="feature_nav">
            {["캘린더", "게시판", "자료실", "커뮤니티", "프로젝트", "채팅"].map(
              (menu, index) => (
                <button
                  key={index}
                  data-menu={`nav${index + 1}`}
                  className={activeMenu === index ? "active" : ""}
                  onClick={() => handleMenuClick(index)}
                >
                  {menu}
                </button>
              )
            )}
          </div>

          {/* 카드 목록 */}
          <div className={`feature_cards ${showAllCards ? "show-all" : ""}`}>
            {cards.map((title, index) => (
              <div
                key={index}
                className={`card ${
                  !showAllCards && index >= 4 ? "hidden" : ""
                }`}
                data-aos={index % 2 === 0 ? "fade-left" : "fade-right"}
                data-aos-delay={300 + index * 100}
              >
                <h3>{title}</h3>
                <p>{title}에 대한 설명입니다.</p>
                <Link to={`/${title.toLowerCase()}`} className="detail-link">
                  자세히 보기
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section
          className="summary-section"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <h2>LION 오피스가 더 특별한 이유</h2>
          <p className="summary-description">
            LION 오피스는 자체 개발 기능, 무상업그레이드 정책, 타 서비스와의 폭
            넓은 체류로 차별성을 더합니다.
          </p>

          <div className="summary-cards">
            <div
              className="summary-card"
              data-aos="fade-left"
              data-aos-delay="100"
            >
              <h3 className="summary-title">자주 묻는 질문</h3>
              <ul className="summary-list">
                <li>그룹웨어 설정은 어떻게 하나요?</li>
                <li>공유 캘린더는 어떻게 사용할 수 있나요?</li>
                <li>팀 게시판은 어떻게 관리하나요?</li>
                <li>자료실에 파일 업로드는 어떻게 하나요?</li>
                <li>비밀번호를 잊어버렸을 때 어떻게 하나요?</li>
              </ul>
            </div>
            <div
              className="summary-card"
              data-aos="fade-right"
              data-aos-delay="300"
            >
              <h3 className="summary-title">최근 소식</h3>
              <ul className="summary-list">
                <li>신규 사용자 인터페이스 업데이트</li>
                <li>캘린더 기능 확장 업데이트 완료</li>
                <li>모바일 최적화 버전 출시</li>
                <li>보안 강화 패치 적용</li>
                <li>사용자 피드백 반영된 개선 사항 업데이트</li>
              </ul>
            </div>
            <div
              className="summary-card"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <h3 className="summary-title">안정성</h3>
              <li>실시간 고객 지원</li>
              <li>고객 케어 라운지</li>
              <li>강력한 보안</li>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
