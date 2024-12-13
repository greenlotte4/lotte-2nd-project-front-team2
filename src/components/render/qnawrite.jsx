import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 추가
import axios from 'axios';  // axios import 추가

export default function QNAWrite() {
  const [formData, setFormData] = useState({
    category: "",
    priority: "",
    title: "",
    content: "",
    email: "",
    name: "",
    attachments: "",
  });

  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'attachments' ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // FormData 객체 생성
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('priority', formData.priority);
    formDataToSend.append('content', formData.content);
    
    // 파일이 있는 경우에만 추가
    if (formData.attachments) {
        formDataToSend.append('attachments', formData.attachments);
    }

    try {
        const response = await axios.post(
            'http://localhost:8080/api/send-qna', 
            formDataToSend,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        
        if (response.status === 200) {
            alert('문의가 성공적으로 전송되었습니다.');
            // 폼 초기화
            setFormData({
                category: "",
                priority: "",
                title: "",
                content: "",
                email: "",
                name: "",
                attachments: "",
            });
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

  const [activeIndex, setActiveIndex] = useState(2);

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
            Questions & Answers
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Have a question? We're here to provide the answers you need.
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
              Questions & Answers Inquiry Form
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Question Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select question category</option>
                  <option value="account">Account Related</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing & Pricing</option>
                  <option value="shipping">Shipping & Delivery</option>
                  <option value="general">General Question</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Priority Level</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select priority level</option>
                  <option value="low">Low - General Question</option>
                  <option value="medium">Medium - Need Help Soon</option>
                  <option value="high">High - Urgent Issue</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Question Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your question title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Question Details</label>
                <textarea
                  name="content"
                  rows="5"
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Please describe your question in detail"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Attachments</label>
                <input
                  type="file"
                  name="attachments"
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Supported files: PDF, DOC, DOCX, JPG, PNG (Max size: 5MB)
                </p>
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
                Submit Question
              </button>
            </form>
          </article>
        </div>
      </section>
    </>
  );
}