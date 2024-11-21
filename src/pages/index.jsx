import React from 'react'
import '@/pages/index.scss'
import logo from '@/assets/plantryLogo.png'
import { Link } from 'react-router-dom'

export default function MainIndex() {
  return (
    <div id="container">
        <header>
            <div className="headerIn">
                <div className="headerLogo">
                    <img src={logo} alt="logo"/>
                    <h1>Plantry</h1>
                </div>
                <section className="gnbWrapper">
                    <div className="gnb">
                        <li>서비스</li>
                        <li>가격 및 혜택</li>
                        <li>체험 및 도입</li>
                        <li>고객센터</li>
                        <li>서비스</li>
                        <Link to="/user/login">로그인</Link>
                        <li>회원가입</li>
                    </div>
                    <img className="profileImg" src="/images/user_face_icon.png" alt="프로필"/>

                </section>             
            </div>
        </header>
        <main>
            <div className="mainIn">
                <section className="Topbg">
                    <img src="/images/rending_background.png" alt="topbg"/>
                    <div className="up">
                        <div className="h2Wrapper">
                            <h2>
                                <p>아이디어의 씨앗을 심고, </p><br />
                                <p>성장과 수확을 경험하세요.</p>
                            </h2>
                        </div>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
                            Maecenas sit venenatis aliquet nunc nam scelerisque. <br />
                            Proin congue viverra risus placerat augue odio cras neque. <br />
                            elis netus tincidunt sed hac urna.<br />
                        </p>
                        <img className="projectImg1" src="/images/top-img1.png" alt="프로젝트 이미지1"/>
                        <img className="projectImg2" src="/images/top-img2.png" alt="프로젝트 이미지2"/>
                        <img className="icon1" src="/images/users_icon4.png" alt="아이콘1"/>
                        <img className="icon2" src="/images/users_icon5.png" alt="아이콘2"/>
                    </div>

                </section>
            </div>
        </main>

        <footer>
            <div className="footerIn">
                <section className="serviceInfo">
                    <h4>서비스 소개</h4>
                    <p>UI design</p>
                    <p>UX design</p>
                </section>
                <section className="selling">
                    <h4>가격 및 혜택</h4>
                    <p>가격</p>
                    <p>혜택</p>
                </section>
                <section className="experience">
                    <h4>체험 및 도입</h4>
                    <p>체험</p>
                    <p>도입 해보기</p>
                </section>
                <section className="cscenter">
                    <h4>고객센터</h4>
                    <p>FAQ</p>
                    <p>Q&A</p>
                </section>
                <section className="sns">
                    <img src="/images/X Logo.png" alt="sns-X Logo"/>
                    <img src="/images/Logo Instagram.png" alt="sns-instagram Logo"/>
                    <img src="/images/Logo YouTube.png" alt="sns-yutube Logo"/>
                    <img src="/images/LinkedIn.png" alt="sns-LinkedIn Logo"/>
                </section>

            </div>
            

        </footer>

    </div>
  )
}
