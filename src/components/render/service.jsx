
export default function Service(){


    return (<>
            <div className="mainIn"> 
              <section className="serviceInfo relative main-bg">
                    <img className="h-full w-full " src="/images/rending_background.png" alt="topbg"/>
                    <div className="up">
                        <div className="h2Wrapper">
                            <h2 className="absolute">
                                Hello, how can we help?
                            </h2>
                            <p className="absolute">or choose a category to quickly find the help you need</p>
                        </div>
                        <img className="absolute" src="images/search-icon.png" alt="돋보기" />
                        <div className="topinput absolute">
                            <input type="text"  className="absolute" placeholder="Ask a question...."/>
                        </div>
                    </div>
                </section>
                <section className="popularLink w-full bg-white h-[462px]" >
                    <div className="w-full text-center my-[20px] text-3xl/[30px] leading-9">Popular Article</div>
                    <article className="flex justify-center	">
                        <div className="w-[400px] h-[400px] border mr-[100px] text-center">
                            <div className="flex flex-col my-auto items-center justify-center h-[400px]">
                                <img  className="mx-auto my-[20px] mt-[20px]" src="images/Union.png" alt="우주선" />
                                <span className="mt-[20px]">Getting Started</span>
                                <span className="mt-[5px]">Plantry 이용해보기</span>
                                <button className="serviceButton">READ MORE</button>

                            </div>
                            
                        </div>
                        <div className="w-[400px] h-[400px] border mr-[100px] text-center">
                            <div className="flex flex-col my-auto items-center justify-center h-[400px]">
                                <img  className="mx-auto my-[20px] mt-[20px]" src="images/Union.png" alt="우주선" />
                                <span className="mt-[20px]">Getting Started</span>
                                <span className="mt-[5px]">Plantry 이용해보기</span>
                                <button className="serviceButton">READ MORE</button>

                            </div>
                            
                        </div>
                        <div className="w-[400px] h-[400px] border  text-center">
                            <div className="flex flex-col my-auto items-center justify-center h-[400px]">
                                <img  className="mx-auto my-[20px] mt-[20px]" src="images/Union.png" alt="우주선" />
                                <span className="mt-[20px]">Getting Started</span>
                                <span className="mt-[5px]">Plantry 이용해보기</span>
                                <button className="serviceButton">READ MORE</button>

                            </div>             
                        </div>
                    </article>
                </section>

                <section className="">
                    <div><span>Knowledge Base </span></div>
                    <div>
                        <article>
                            <div>
                                <img src="" alt="" />
                                <span></span>
                            </div>
                            <ul>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                            <div><span>      </span></div>
                        </article>
                        <article></article>
                        <article></article>
                    </div>
                    <div>
                        <article></article>
                        <article></article>
                        <article></article>
                    </div>

                </section>

            </div>
    
    </>);
}