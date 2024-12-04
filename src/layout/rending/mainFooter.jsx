import { Link } from "react-router-dom";

export default function MainFooter(){
    return (<>
        <footer>
            <div className="footerIn">
                <section className="service">
                    <h4><Link to="/service">서비스 소개</Link></h4>
                    <p><Link to="">UI design</Link></p>
                    <p><Link to="">UX design</Link></p>
                </section>
                <section className="selling">
                    <h4><Link to="">가격 및 혜택</Link></h4>
                    <p><Link to="">가격</Link></p>
                    <p><Link to="">혜택</Link></p>
                </section>
                <section className="experience">
                    <h4><Link to="">체험 및 도입</Link></h4>
                    <p><Link to="">체험</Link></p>
                    <p><Link to="">도입 해보기</Link></p>
                </section>
                <section className="cscenter">
                    <h4><Link to="">고객센터</Link></h4>
                    <p><Link to="">FAQ</Link></p>
                    <p><Link to="">Q&A</Link></p>
                </section>
                <section className="sns flex ">
                <Link className="mr-[5px]" to=""><img src="/images/X Logo.png" alt="sns-X Logo"/></Link>
                <Link  className="mr-[5px]" to=""><img src="/images/Logo Instagram.png" alt="sns-instagram Logo"/></Link>
                    <Link  className="mr-[5px]" to=""><img src="/images/Logo YouTube.png" alt="sns-yutube Logo"/></Link>
                    <Link to=""><img src="/images/LinkedIn.png" alt="sns-LinkedIn Logo"/></Link>
                </section>  
            </div>
            <p className="flex justify-center mt-20 text-gray-400 font-light"> Copyright © 2024, Made with ️ by <span>&nbsp; Prantry Technologies &nbsp;</span> Version 0.0.4-SNAPSHOT</p>

        </footer>

    </>)
}