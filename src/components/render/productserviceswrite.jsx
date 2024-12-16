import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 추가

export default function ProductServicesWrite() {
  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    serviceType: "",
    purchaseDate: "",
    title: "",
    content: "",
    email: "",
    name: "",
  });

  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.productName || !formData.productType || !formData.serviceType || !formData.purchaseDate || !formData.title || !formData.content || !formData.email || !formData.name) {
        alert('모든 필드를 채워 주세요.');
        return;
    }

    // 환경에 맞게 API URL을 설정
    const apiUrl = process.env.NODE_ENV === 'test'
      ? 'http://test-server-url/api/send-product-service'  // 테스트 서버 URL
      : process.env.NODE_ENV === 'production'
      ? 'http://13.124.94.213:90/api/send-product-service'  // 배포된 서버 URL
      : 'http://localhost:8080/api/send-product-service';  // 로컬 서버 URL

    try {
      const response = await fetch(apiUrl, {  // 선택된 URL로 요청
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('문의가 성공적으로 전송되었습니다. 답변은 1~2일 이내에 받으실 수 있습니다.');

        // 자동 응답 이메일 전송
        await fetch('http://13.124.94.213:90/api/send-auto-reply', {  // 자동 응답 이메일 API URL
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: formData.email })
        });

        // 폼 초기화
        setFormData({
          productName: "",
          productType: "",
          serviceType: "",
          purchaseDate: "",
          title: "",
          content: "",
          email: "",
          name: "",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('문의 전송 실패:', error);
      alert('문의 전송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const menus = [
    { title: "PAYMENT", icon: "/images/paymentIcon_gray.png", path: "/faq/write/payment" },
    {
      title: "CANCELLATION & RETURN",
      icon: "/images/return.png",
      path: "/faq/write/cancellation",
    },
    { title: "QNA", icon: "/images/CardGiftcard.png", path: "/faq/write/qna" },
    {
      title: "PRODUCT & SERVICES",
      icon: "/images/Settings.png",
      path: "/faq/write/services",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(3);

  const handleMenuClick = (index, path) => {
    setActiveIndex(index);
    navigate(path); // 클릭 시 페이지 이동
  };

  return (
    <>
      {/* 상단 섹션 */}
      <section
        className="relative min-h-[300px] flex justify-center items-center overflow-hidden"
        style={{
          background: "url('/images/rending_background.png') no-repeat center",
          backgroundSize: "cover",
        }}
      >
        <div className="text-center z-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Product & Services Support
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Need assistance with our products or services? Let us help you.
          </p>
        </div>
      </section>

      {/* 사이드바 & 폼 영역 */}
      <section className="flex justify-center my-12">
        <div className="w-full max-w-screen-lg flex flex-wrap lg:flex-nowrap">
          {/* 사이드바 */}
          <aside className="w-full lg:w-1/4 bg-white rounded-lg shadow-lg p-4">
            <ul className="space-y-2">
              {menus.map((menu, index) => (
                <li
                  key={index}
                  className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    activeIndex === index
                      ? "bg-[#666bff] text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleMenuClick(index, menu.path)}
                >
                  <img
                    src={menu.icon}
                    alt={menu.title}
                    className={`w-6 h-6 mr-3 ${
                      activeIndex === index ? "brightness-150" : ""
                    }`}
                  />
                  <span className="text-base font-medium">{menu.title}</span>
                </li>
              ))}
            </ul>
          </aside>

          {/* 폼 영역 */}
          <article className="w-full lg:w-3/4 bg-white rounded-lg shadow-lg p-8 ml-6">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Product & Services Inquiry Form
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Product Type</label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select product type</option>
                  <option value="hardware">Hardware</option>
                  <option value="software">Software</option>
                  <option value="subscription">Subscription Service</option>
                  <option value="accessory">Accessory</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Service Type</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select service type</option>
                  <option value="installation">Installation Support</option>
                  <option value="technical">Technical Support</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="upgrade">Upgrade Request</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Purchase Date</label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Inquiry Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your inquiry title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Issue Details</label>
                <textarea
                  name="content"
                  rows="5"
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Please describe your product or service issue in detail"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-[#666bff] text-white font-semibold rounded-lg hover:bg-[#5555ee] transition duration-300"
              >
                Submit Product & Service Inquiry
              </button>
            </form>
          </article>
        </div>
      </section>
    </>
  );
}
