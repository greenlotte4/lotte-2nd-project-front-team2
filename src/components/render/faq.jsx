import { useState } from "react";
import { useNavigate } from "react-router-dom"; // React Router 사용

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeItem, setActiveItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [isAdmin, setIsAdmin] = useState(true); // 관리자 여부 (true: 관리자, false: 일반 회원)
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  const handleActive = (index) => {
    setActiveIndex(index === activeIndex ? 0 : index);
    setActiveItem(null);
  };

  const handleItemClick = (item) => {
    setActiveItem(item); // 클릭된 항목 설정
    setIsModalOpen(true); // 모달 열기
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
    setActiveItem(null);
  };

  const handleDelete = (item) => {
    alert(`Deleted: ${item.title}`);
    handleCloseModal();
  };

  const handleEdit = (item) => {
    alert(`Edit: ${item.title}`);
    handleCloseModal();
  };

  const handleButtonClick = (buttonLabel) => {
    if (buttonLabel === "Ask a Question") {
      navigate("/faq/write"); // "Ask a Question" 클릭 시 이동
    } else {
      alert(`Action for: ${buttonLabel}`);
    }
  };

  const contents = [
    {
      title: "PAYMENT",
      image: "/images/paymentIcon_gray.png",
      items: [
        {
          title: "Does my subscription automatically renew?",
          content:
            "Yes, your subscription will automatically renew unless you cancel it before the renewal date.",
          author: "John Doe",
        },
        {
          title: "Can I store the item on an intranet so everyone has access?",
          content:
            "No, items cannot be stored on an intranet. Each user needs to purchase their own license.",
          author: "Jane Smith",
        },
      ],
      buttonLabel: "Manage Payment",
    },
    {
      title: "CANCELLATION & RETURN",
      image: "/images/return.png",
      items: [
        {
          title: "What is the refund policy?",
          content:
            "You can request a refund within 30 days of purchase. Refunds are subject to approval.",
          author: "Alice Brown",
        },
        {
          title: "How do I cancel an order?",
          content:
            "To cancel an order, please go to your order history and click 'Cancel Order'.",
          author: "Charlie Green",
        },
      ],
      buttonLabel: "Request Refund",
    },
    {
      title: "QNA",
      image: "/images/CardGiftcard.png",
      items: [
        {
          title: "Where can I find FAQs?",
          content:
            "FAQs can be found on our website under the 'Help Center' section.",
          author: "Sarah Lee",
        },
        {
          title: "How do I ask a question?",
          content:
            "You can ask a question by clicking 'Ask a Question' and submitting your query.",
          author: "Michael Brown",
        },
      ],
      buttonLabel: "Ask a Question",
    },
    {
      title: "PRODUCT & SERVICES",
      image: "/images/Settings.png",
      items: [
        {
          title: "What services do you offer?",
          content:
            "We offer a variety of services including consulting, product customization, and technical support.",
          author: "David Wilson",
        },
        {
          title: "Are there any discounts available?",
          content:
            "Yes, discounts are available during promotional periods. Check our website for updates.",
          author: "Emily Davis",
        },
      ],
      buttonLabel: "View Services",
    },
  ];

  return (
    <>
      <div className="mainIn bg-white min-h-screen">
        <section className="serviceInfo relative bg-white">
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
                {contents.map((content, index) => (
                  <li
                    key={index}
                    className={`faqTitle ${
                      activeIndex === index ? "active" : ""
                    } p-5px leading-[38px] mb-[10px] hover:bg-gray-100 hover:shadow-md transition-all`}
                    onClick={() => handleActive(index)}
                  >
                    <div className="flex leading-[38px] text-center items-center">
                      <img
                        className={`w-[20px] h-[20px] ml-[20px] ${
                          activeIndex === index
                            ? "filter brightness-0 invert"
                            : ""
                        }`}
                        src={content.image}
                        alt="아이콘"
                      />
                      <span className="ml-[10px]">{content.title}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
          <article className="w-full lg:w-[1548px] lg:ml-[40px]">
            <div className="faqlist bg-white rounded-lg shadow-xl ">
              <ul className="w-full pl-5 space-y-3 rounded-[8px]">
                {contents[activeIndex]?.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="border-b leading-[51px] flex justify-between items-center cursor-pointer hover:bg-gray-100 hover:text-blue-600 transition-all duration-200"
                    onClick={() => handleItemClick(item)}
                  >
                    <span>{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 text-center">
              <button
                className="px-6 py-2 rounded-lg hover:opacity-90"
                style={{ backgroundColor: "#666bff", color: "white" }}
                onClick={() =>
                  handleButtonClick(contents[activeIndex]?.buttonLabel)
                }
              >
                {contents[activeIndex]?.buttonLabel}
              </button>
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
              <span>82+ (010) 2548 2568</span>
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

        {isModalOpen && activeItem && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleCloseModal}
          >
            <div
              className="bg-white rounded-lg p-6 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">FAQ Details</h2>
              <p className="text-gray-700">
                <strong>Title:</strong> {activeItem.title}
              </p>
              <p className="text-gray-700">
                <strong>Content:</strong> {activeItem.content}
              </p>
              <p className="text-gray-700">
                <strong>Author:</strong> {activeItem.author}
              </p>
              {isAdmin && (
                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                    onClick={() => handleDelete(activeItem)}
                  >
                    Delete
                  </button>
                  <button
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                    onClick={() => handleEdit(activeItem)}
                  >
                    Edit
                  </button>
                </div>
              )}
              <div className="mt-4 text-right">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
