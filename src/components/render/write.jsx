import { useState } from "react";

export default function FAQWrite() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    email: "",
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // 추가적인 제출 로직 구현
  };

  const menus = [
    { title: "PAYMENT", icon: "/images/paymentIcon_gray.png" },
    { title: "CANCELLATION & RETURN", icon: "/images/return.png" },
    { title: "QNA", icon: "/images/CardGiftcard.png" },
    { title: "PRODUCT & SERVICES", icon: "/images/Settings.png" },
  ];

  const [activeIndex, setActiveIndex] = useState(1); // 활성화된 메뉴 기본값 설정
  const handleMenuClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <>
      <div className="mainIn">
        {/* 헤더 */}
        <section className="serviceInfo relative main-bg">
          <div className="up">
            <div className="h2Wrapper">
              <h2 className="absolute">문의하기</h2>
              <p className="absolute">
                궁금한 점이 있으시면 아래 양식을 작성해주세요.
              </p>
            </div>
          </div>
        </section>

        <section className="Faq h-max pb-[20px] flex flex-wrap lg:flex-nowrap">
          {/* 사이드바 */}
          <aside className="w-full lg:w-[300px]">
            <ul className="m-[20px] space-y-2">
              {menus.map((menu, index) => (
                <li
                  key={index}
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${
                    activeIndex === index
                      ? "bg-purple-500 text-white"
                      : "bg-transparent text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => handleMenuClick(index)}
                >
                  <img
                    src={menu.icon}
                    alt={menu.title}
                    className="w-[20px] h-[20px] mr-3"
                  />
                  <span>{menu.title}</span>
                </li>
              ))}
            </ul>
          </aside>

          {/* 문의하기 폼 */}
          <article className="w-full lg:w-[1548px] lg:ml-[40px]">
            <div className="form-container bg-white rounded-lg shadow-xl p-8">
              <h2 className="text-xl font-semibold mb-5 text-center">
                Contact us
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 제목 */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
                  />
                </div>

                {/* 내용 */}
                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    detail
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full p-4 border rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
                  ></textarea>
                </div>

                {/* 이메일 */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
                  />
                </div>

                {/* 이름 */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
                  />
                </div>

                {/* 문의 제출 버튼 */}
                <button
                type="submit"
                className="py-4 px-6 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 focus:ring focus:ring-purple-300 mx-auto block"
                >
                Submit inquiry
                </button>
              </form>
            </div>
          </article>
        </section>
      </div>
    </>
  );
}
