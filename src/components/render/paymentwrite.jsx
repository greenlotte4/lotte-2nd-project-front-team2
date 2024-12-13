import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 추가
import axios from 'axios';  // axios import 추가

const API_BASE_URL = 'http://13.124.94.213:8080';  // 백엔드 서버 주소

export default function PaymentWrite() {
  const [formData, setFormData] = useState({
    orderNumber: "",
    paymentMethod: "",
    paymentAmount: "",
    paymentDate: "",    // paymentDate 추가
    inquiryType: "",    // inquiryType 추가
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
    
    const paymentData = {
        email: formData.email,
        title: formData.title,
        name: formData.name,
        orderNumber: formData.orderNumber,
        paymentAmount: formData.paymentAmount,
        paymentMethod: formData.paymentMethod,
        paymentDate: formData.paymentDate,
        inquiryType: formData.inquiryType,
        content: formData.content
    };
    
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/send-payment`, 
            paymentData,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }
        );
        
        if (response.status === 200) {
            alert('문의가 성공적으로 전송되었습니다.');
        }
    } catch (error) {
        console.error('문의 전송 실패:', error);
        alert('문의 전송에 실패했습니다.');
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

  const [activeIndex, setActiveIndex] = useState(0);

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
            Payment Support
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Need help with a payment? We're here to assist you with any payment-related issues.
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
              Payment Inquiry Form
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Order Number</label>
                <input
                  type="text"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your order number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select payment method</option>
                  <option value="creditCard">Credit Card</option>
                  <option value="debitCard">Debit Card</option>
                  <option value="bankTransfer">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Payment Amount</label>
                <input
                  type="number"
                  name="paymentAmount"
                  value={formData.paymentAmount}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter payment amount"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Payment Date</label>
                <input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter payment date"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Inquiry Type</label>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select inquiry type</option>
                  <option value="refund">Refund</option>
                  <option value="chargeback">Chargeback</option>
                  <option value="other">Other</option>
                </select>
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
                  placeholder="Please describe your payment issue in detail"
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
                Submit Payment Inquiry
              </button>
            </form>
          </article>
        </div>
      </section>
    </>
  );
}