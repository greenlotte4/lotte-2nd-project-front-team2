import { useState } from "react";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(0); // 활성화된 아이템의 인덱스를 저장

  const handleActive = (index) => {
    setActiveIndex(index === activeIndex ? 0 : index); // 같은 항목 클릭 시 비활성화
  };

  const contents = [
    {
      title: "PAYMENT",
      image: "/images/paymentIcon_gray.png",
      items: [
        "Does my subscription automatically renew?",
        "Can I store the item on an intranet so everyone has access?",
        "What does non-exclusive mean?",
        "Is the Regular License the same thing as an editorial license?",
      ],
      buttonLabel: "Manage Payment",
    },
    {
      title: "CANCELLATION & RETURN",
      image: "/images/return.png",
      items: [
        "What is the refund policy?",
        "How do I cancel an order?",
        "Can I exchange an item?",
        "What is the process for a return?",
      ],
      buttonLabel: "Request Refund",
    },
    {
      title: "QNA",
      image: "/images/CardGiftcard.png",
      items: [
        "Where can I find FAQs?",
        "How do I ask a question?",
        "Can I contact customer support?",
        "Are there tutorial videos?",
      ],
      buttonLabel: "Ask a Question",
    },
    {
      title: "PRODUCT & SERVICES",
      image: "/images/Settings.png",
      items: [
        "What services do you offer?",
        "Are there any discounts available?",
        "How can I customize a product?",
        "What is your product warranty?",
      ],
      buttonLabel: "View Services",
    },
  ];

  return (
    <>
      <div className="mainIn">
        <section className="serviceInfo relative main-bg">
          <div className="up">
            <div className="h2Wrapper">
              <h2 className="absolute">Hello, how can we help?</h2>
              <p className="absolute">
                or choose a category to quickly find the help you need
              </p>
            </div>
            <img
              className="absolute"
              src="images/search-icon.png"
              alt="돋보기"
            />
            <div className="topinput absolute">
              <input
                type="text"
                className="absolute"
                placeholder="Ask a question...."
              />
            </div>
          </div>
        </section>
        <section className="Faq h-max pb-[20px] flex flex-wrap lg:flex-nowrap ">
          <div className="Faq h-max mb-[20px] pb-[20px] flex my-[40px] w-full lg:w-1/3">
            <aside className="w-full lg:w-[300px]">
              <ul className="m-[20px]">
                {/* PAYMENT */}
                <li
                  className={`faqTitle ${
                    activeIndex === 0 ? "active" : ""
                  } p-5px leading-[38px] mb-[10px]`}
                  onClick={() => handleActive(0)}
                >
                  <div className="flex leading-[38px] text-center items-center">
                    <img
                      className={`w-[20px] h-[20px] ml-[20px] ${
                        activeIndex === 0 ? "filter brightness-0 invert" : ""
                      }`}
                      src="\images\paymentIcon_gray.png"
                      alt="카드 아이콘"
                    />
                    <span className="ml-[10px]">PAYMENT</span>
                  </div>
                </li>

                {/* CANCELLATION & RETURN */}
                <li
                  className={`faqTitle ${
                    activeIndex === 1 ? "active" : ""
                  } p-5px leading-[38px] mb-[10px]`}
                  onClick={() => handleActive(1)}
                >
                  <div className="flex leading-[38px] text-center items-center">
                    <img
                      className={`w-[20px] h-[20px] ml-[20px] ${
                        activeIndex === 1 ? "filter brightness-0 invert" : ""
                      }`}
                      src="\images\return.png"
                      alt=""
                    />
                    <span className="ml-[10px]">CANCELLATION & RETURN</span>
                  </div>
                </li>

                {/* QNA */}
                <li
                  className={`faqTitle ${
                    activeIndex === 2 ? "active" : ""
                  } p-5px leading-[38px] mb-[10px]`}
                  onClick={() => handleActive(2)}
                >
                  <div className="flex leading-[38px] text-center items-center">
                    <img
                      className={`w-[20px] h-[20px] ml-[20px] ${
                        activeIndex === 2 ? "filter brightness-0 invert" : ""
                      }`}
                      src="\images\CardGiftcard.png"
                      alt=""
                    />
                    <span className="ml-[10px]">QNA</span>
                  </div>
                </li>

                {/* PRODUCT & SERVICES */}
                <li
                  className={`faqTitle ${
                    activeIndex === 3 ? "active" : ""
                  } p-5px leading-[38px] mb-[10px]`}
                  onClick={() => handleActive(3)}
                >
                  <div className="flex leading-[38px] text-center items-center">
                    <img
                      className={`w-[20px] h-[20px] ml-[20px] ${
                        activeIndex === 3 ? "filter brightness-0 invert" : ""
                      }`}
                      src="\images\Settings.png"
                      alt=""
                    />
                    <span className="ml-[10px]">PRODUCT & SERVICES</span>
                  </div>
                </li>
              </ul>
            </aside>
          </div>
          <article className="w-full lg:w-[1548px] lg:ml-[40px]">
            <div className="flex">
              <div className="icon w-[42px] h-[42px]">
                <img
                  src={contents[activeIndex].image}
                  alt={contents[activeIndex].title}
                  className="w-[20px] h-[20px]" // 이미지 크기 조정
                />
              </div>
              <section>
                <h2 className="text-xl leading-[42px] ml-[10px] font-semibold mb-3">
                  {contents[activeIndex].title}
                </h2>
                <span></span>
              </section>
            </div>
            <div className="faqlist bg-white rounded-lg shadow-xl ">
              <ul className="w-full pl-5 space-y-3 rounded-[8px]">
                {contents[activeIndex].items.map((item, idx) => (
                  <li
                    key={idx}
                    className="border-b leading-[51px] flex justify-between"
                  >
                    {item}{" "}
                    <img
                      className="w-[30px] h-[30px] mr-[20px]"
                      src="/images/Star.png"
                      alt=""
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="Qtop w-[200px] h-auto py-[12px] px-[20px] border cursor-pointer mt-6 mx-auto text-center bg-purple-200 hover:bg-purple-300 transition-all lg:mx-0 lg:ml-auto lg:mr-auto"
              onClick={() => (window.location.href = "/faq/write")}
            >
              {contents[activeIndex].buttonLabel}
            </div>
          </article>
        </section>
        <section className="question flex flex-col text-center bg-white">
          <span className="text-[20px]">You still have a question?</span>
          <p className="qp mt-[10px]">
            If you cannot find a question in our FAQ, you can always contact us.
            We will answer to you shortly!
          </p>
          <article className="flex flex-wrap justify-center items-center mt-[40px]">
            <div className="w-full lg:w-[384px] h-[167px] box-border text-center flex justify-center flex-col items-center shadow-md bg-[#F6F6F7] mr-[20px] mb-4 lg:mb-0">
              <div className="w-[42px] h-[42px] ">
                <img src="/images/phoneIcon.png" alt="phone" />
              </div>
              <span>+ (810) 2548 2568</span>
              <p>We are always happy to help!</p>
            </div>
            <div className="w-full lg:w-[384px] h-[167px] box-border text-center flex justify-center flex-col items-center bg-[#F6F6F7] shadow-md">
              <div className="w-[42px] h-[42px] ">
                <img src="/images/LetterIcon.png" alt="mail" />
              </div>
              <span>sanghun1101088@gmail.com</span>
              <p>We are always happy to help!</p>
            </div>
          </article>
        </section>
      </div>
    </>
  );
}
