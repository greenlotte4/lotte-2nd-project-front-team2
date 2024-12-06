import React, { useEffect, useState } from 'react';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';
export default function Main() {
  const [showAllCards, setShowAllCards] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuContent, setMenuContent] = useState({
      프로젝트: {
          image: '/images/프로젝트.png',
          cards: [
            { title: '프로젝트 추가', description: '프로젝트를 체계적으로 관리하고 협업할 수 있는 기능입니다.' },
            { title: '프로젝트 작업추가', description: '프로젝트를 체계적으로 관리하고 협업할 수 있는 기능입니다.' },
            { title: '프로젝트 작업수정', description: '프로젝트를 체계적으로 관리하고 협업할 수 있는 기능입니다.' },
            { title: '프로젝트 협업', description: '프로젝트 계획을 세우고 목표를 설정할 수 있습니다.' },
          ],
      },

      문서: {
          image: '/images/문서.png',
          cards: [
            { title: '폴더 작성', description: '팀과 함께 문서를 작성하고 편집할 수 있습니다.' },
            { title: '폴더 삭제', description: '작성한 문서를 팀원들과 쉽게 공유할 수 있습니다.' },
            { title: '폴더 이동', description: '필요한 문서를 다운로드하여 오프라인에서도 사용할 수 있습니다.' },
            { title: '파일 업로드', description: '필요한 문서를 다운로드하여 오프라인에서도 사용할 수 있습니다.' },
            { title: '파일 다운로드', description: '필요한 문서를 다운로드하여 오프라인에서도 사용할 수 있습니다.' },
            { title: '파일 삭제', description: '필요한 문서를 다운로드하여 오프라인에서도 사용할 수 있습니다.' },
          ],
      },
      일정: {
          image: '/images/일정.png',
          cards: [
            { title: '캘린더 보기', description: '팀의 모든 일정을 관리할 수 있는 캘린더 기능입니다.' },
            { title: '캘린더 일정 등록', description: '팀의 모든 일정을 관리할 수 있는 캘린더 기능입니다.' },
            { title: '캘린더 일정 수정', description: '팀의 모든 일정을 관리할 수 있는 캘린더 기능입니다.' },
            { title: '캘린더 일정 삭제', description: '팀의 모든 일정을 관리할 수 있는 캘린더 기능입니다.' },
            { title: '캘린더 일정 알림', description: '팀의 모든 일정을 관리할 수 있는 캘린더 기능입니다.' },
          ],
      },
      게시판: {
          image: '/images/게시판.png',
          cards: [
            { title: '게시판 추가', description: '중요한 공지사항을 팀원들과 공유할 수 있습니다.' },
            { title: '게시판 글쓰기', description: '중요한 공지사항을 팀원들과 공유할 수 있습니다.' },
            { title: '게시판 글쓰기 개선', description: '중요한 공지사항을 팀원들과 공유할 수 있습니다.' },
            { title: '게시판 글목록', description: '중요한 공지사항을 팀원들과 공유할 수 있습니다.' },
            { title: '게시판 글보기', description: '중요한 공지사항을 팀원들과 공유할 수 있습니다.' },
            { title: '게시판 글수정', description: '중요한 공지사항을 팀원들과 공유할 수 있습니다.' },
            { title: '게시판 글검색', description: '팀원들이 자유롭게 의견을 나눌 수 있는 공간입니다.' },
          ],
      },
      메신저: {
          image: '/images/메신저.png',
          cards: [
            { title: '그룹 채팅', description: '팀원들과 그룹 채팅을 통해 실시간으로 소통할 수 있습니다.' },
            { title: '1:1 채팅', description: '개별 팀원과 1:1 채팅을 할 수 있습니다.' },
            { title: '파일 첨부', description: '채팅 중 파일을 첨부하여 손쉽게 공유할 수 있습니다.' },
          ],
      },
      페이지: {
          image: '/images/페이지.png',
          cards: [
            { title: '페이지 생성', description: '필요한 페이지를 생성하여 팀 정보를 공유할 수 있습니다.' },
            { title: '페이지 작성', description: '프로젝트 진행 상황을 페이지에 기록하여 추적할 수 있습니다.' },
            { title: '페이지 삭제', description: '프로젝트 진행 상황을 페이지에 기록하여 추적할 수 있습니다.' },
            { title: '페이지 협업', description: '생성한 페이지를 손쉽게 관리하고 수정할 수 있습니다.' },
          ],
      },
  });

  useEffect(() => {
      Aos.init({
          duration: 1000,
          easing: 'ease-in-out',
          once: true,
      });
  }, []);

  const handleMenuClick = (index) => {
      setActiveMenu(index);
  };

  return (
      <div id="landing" className="font-sans bg-gradient-to-r from-[#f3f7ff] via-[#f3f7ff] to-[#f3f7ff] text-gray-800 overflow-x-hidden">
          {/* Main Content */}
          <main className="mt-32 px-4">
              {/* Top Section */}
              <section className="text-center py-20 bg-white shadow-lg rounded-md" data-aos="fade-up">
                  <h2 className="text-5xl font-extrabold text-[#333366] transition-colors duration-300 transform hover:scale-110">
                      아이디어의 씨앗을 심고, <span className="text-indigo-500">
                          <li className='mt-[15px]'>성장과 수확을 경험하세요.</li></span>
                  </h2>
                  <p className="mt-[30px] text-gray-600 text-xl">
                      <em>업무플랫폼</em> <em className="text-[#b3b8ff]">PLANTRY</em>
                  </p>
                  
              </section>

              {/* Feature Section */}
              <section className="py-24 bg-[#f3f7ff] relative z-0 feature-section" data-aos="fade-up" data-aos-delay="200">
                  <div className="text-center">
                      <img
                          src={activeMenu !== null ? menuContent[Object.keys(menuContent)[activeMenu]].image : "/images/rending_background.png"}
                          alt="배너이미지"
                          className="w-full max-w-4xl mx-auto rounded-3xl shadow-2xl mb-12"
                          style={{ position: 'relative', zIndex: -1 }}
                      />
                      <h2 className="text-4xl font-extrabold transition-colors duration-300 transform cursor-pointer">
                          Plantry 하나면 <br className="block sm:hidden" /> 충분해요!
                      </h2>
                  </div>

                  {/* 메뉴 버튼 */}
                  <div className="flex justify-center flex-wrap gap-8 mt-12">
                      {Object.keys(menuContent).map((menu, index) => (
                          <button
                              key={index}
                              className={`px-6 py-4 rounded-full shadow-lg transition-transform duration-300 ${
                                  activeMenu === index
                                      ? 'bg-indigo-500 text-white'
                                      : 'bg-white text-gray-700 hover:bg-[#b3b8ff] hover:text-white'
                              } hover:scale-110 transform hover:-translate-y-2 hover:shadow-xl`}
                              onClick={() => handleMenuClick(index)}
                          >
                              {menu}
                          </button>
                      ))}
                  </div>

                  {/* 카드 목록 */}
                  <div className="flex flex-wrap justify-center gap-8 px-4 mt-16 card-list">
                      {activeMenu !== null && menuContent[Object.keys(menuContent)[activeMenu]].cards.map((card, index) => (
                          <div
                              key={index}
                              className={`bg-white shadow-lg rounded-xl p-6 transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl hover:bg-[#f9f9ff] card-item`}
                              data-aos={index % 2 === 0 ? 'fade-left' : 'fade-right'}
                              data-aos-delay={300 + index * 100}
                          >
                              <h3 className="text-xl font-bold text-[#333366] mb-4 hover:text-[#b3b8ff] transition-colors duration-300 text-center">
                                  {card.title}
                              </h3>
                              <p className="text-lg text-gray-700 mb-4 text-center">
                                  {card.description}
                              </p>
                              <Link
                                  to={`/${card.title.toLowerCase()}`}
                                  className="text-indigo-500 no-underline text-md font-semibold transition-colors duration-300 block text-center"
                              >
                                  자세히 보기
                              </Link>
                          </div>
                      ))}
                  </div>
              </section>
  
          {/* Summary Section */}
          <section className="py-28 bg-gradient-to-b from-[#f3f7ff] to-[#f9f9ff]" data-aos="fade-up" data-aos-delay="600">
            <h2 className="text-5xl font-extrabold text-center mb-14 text-[#333366]">
              Plantry 가 더 특별한 이유
            </h2>
            <p className="text-center text-gray-700 max-w-4xl mx-auto mb-20 text-xl">
              Plantry 는 자체 개발 기능, 무상업그레이드 정책, 타 서비스와의 폭 넓은 체류로 차별성을 더합니다.
            </p>
            <div className="mt-14 flex justify-center flex-wrap gap-14">
              <div
                className="bg-white shadow-lg rounded-2xl px-10 pt-8 pb-12 w-96 transition-transform duration-300 transform hover:scale-110 hover:shadow-2xl  hover:rotate-1 hover:skew-y-2"
                data-aos="fade-left"
                data-aos-delay="100"
              >
                <h3 className="text-2xl font-bold text-indigo-500 mb-8 text-center">
                  자주 묻는 질문
                </h3>
                <ul className="text-md text-gray-700 list-disc space-y-4">
                  <li>그룹웨어 설정은 어떻게 하나요?</li>
                  <li>공유 캘린더는 어떻게 사용할 수 있나요?</li>
                  <li>팀 프로젝트 관리 기능이 있나요?</li>
                </ul>
              </div>
              <div
                className="bg-white shadow-lg rounded-2xl px-10 pt-8 pb-12 w-96 transition-transform duration-300 transform hover:scale-110 hover:shadow-2xl  hover:rotate-1 hover:skew-y-2"
                data-aos="fade-left"
                data-aos-delay="300"
              >
                <h3 className="text-2xl font-bold text-indigo-500 mb-8 text-center">
                  최근 소식
                </h3>
                <ul className="text-md text-gray-700 list-disc space-y-4">
                  <li>새로운 업그레이드 기능 발표</li>
                  <li>고객 사례 연구 발표</li>
                  <li>서비스 안정성 강화</li>
                </ul>
              </div>
              <div
                className="bg-white shadow-lg rounded-2xl px-10 pt-8 pb-12 w-96 transition-transform duration-300 transform hover:scale-110 hover:shadow-2xl  hover:rotate-1 hover:skew-y-2"
                data-aos="fade-left"
                data-aos-delay="500"
              >
                <h3 className="text-2xl font-bold text-indigo-500 mb-8 text-center">
                  안정성
                </h3>
                <ul className="text-md text-gray-700 list-disc space-y-4">
                  <li>24/7 보안 모니터링</li>
                  <li>업무 데이터를 안전하게 보호</li>
                  <li>신뢰성 높은 클라우드 환경</li>
                </ul>
              </div>
            </div>
          </section>
        </main>
      </div>
    );

    // return (<>
    //          <div className="mainIn">
    //             <section className="Topbg">
    //                 <img src="/images/rending_background.png" alt="topbg"/>
    //                 <div className="up">
    //                     <div className="h2Wrapper">
    //                         <h2>
    //                             <p>아이디어의 씨앗을 심고, </p><br />
    //                             <p>성장과 수확을 경험하세요.</p>
    //                         </h2>
    //                     </div>
    //                     <p>
    //                         Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
    //                         Maecenas sit venenatis aliquet nunc nam scelerisque. <br />
    //                         Proin congue viverra risus placerat augue odio cras neque. <br />
    //                         elis netus tincidunt sed hac urna.<br />
    //                     </p>
    //                     <img className="projectImg1" src="/images/top-img1.png" alt="프로젝트 이미지1"/>
    //                     <img className="projectImg2" src="/images/top-img2.png" alt="프로젝트 이미지2"/>
    //                     <img className="icon1" src="/images/users_icon4.png" alt="아이콘1"/>
    //                     <img className="icon2" src="/images/users_icon5.png" alt="아이콘2"/>
    //                 </div>

    //             </section>
    //         </div>
    
    // </>);
}