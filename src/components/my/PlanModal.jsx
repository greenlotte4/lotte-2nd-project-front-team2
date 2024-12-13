import { useState } from "react";

export const MyPlanModal = ({ isOpen, onClose , text }) => {
    if (!isOpen) return null;

    const [selected, setSelected] = useState(''); // 선택된 플랜 이름 저장
    const handlePlanSelection = (planName) => {
        setSelected(planName); // 선택된 플랜 이름 설정
    };

return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-custom-fixed">
      <div className="bg-white rounded-t-xl rounded-b-md shadow-lg max-w-2xl w-full modal-custom-width">
        <div className="flex justify-between items-center mb-8 py-5 px-12 bg-white rounded-t-xl">
            <span className="text-lg text-gray-700 font-bold">{text}</span>
            <button 
            onClick={onClose}
            className="text-md float-right display-block font-bold text-gray-600 hover:text-gray-900"
            >
            <img className="h-[15px]" src="/images/close-icon.png" alt="close" />
            </button>
        </div>
        <div className="mx-12">
            <div className="w-full bg-gray-100 h-[50px] rounded-lg mb-10 flex items-center px-7">
                <strong className="text-lg text-indigo-500 mr-10">Basic</strong>
                <span className="text-sm">플랜을 구독 중입니다.</span>
            </div>
            <span className="text-sm ml-2">새로운 멤버십을 이용해보세요.</span>
          {text === '요금제 변경' &&
            <>
                <div className="flex justify-between mt-10">
                    {/* Basic Plan */}
                    <label
                        className={`planbox-label ${selected === 'Basic' ? 'selected' : ''}`}
                        onClick={() => handlePlanSelection('Basic')}
                    >
                        <div
                        className={`box-border planbox flex flex-col items-center ${
                            selected === 'Basic' ? 'border-2 border-indigo-500' : 'border border-indigo-200'
                        }`}
                        >
                        <h3 className="text-lg mt-10">Basic</h3>
                        <span className="text-sm text-gray-500 mt-10">무료 플랜</span>
                        <span className="text-sm text-gray-500">5GB 드라이브 사용</span>
                        <span className="text-sm text-gray-500">10명 초대 가능</span>
                        <div className="flex items-end mt-10">
                            <div className="flex items-start mt-[10px]">
                                <span className="text-sm text-indigo-500 mr-1">$</span>
                                <span className="text-3xl text-indigo-500">0</span>
                            </div>
                            <p className="text-sm">/month</p>
                        </div>
                        <input
                            name="plan"
                            type="radio"
                            className="mt-[20px]"
                            checked={selected === 'Basic'}
                            readOnly
                        />
                        </div>
                    </label>

                    {/* Standard Plan */}
                    <label
                        className={`planbox-label ${selected === 'Standard' ? 'selected' : ''}`}
                        onClick={() => handlePlanSelection('Standard')}
                    >
                        <div
                        className={`planbox flex flex-col items-center ${
                            selected === 'Standard' ? 'border-2 border-indigo-500' : 'border border-indigo-200'
                        }`}
                        >
                        <h3 className="text-lg mt-10">Standard</h3>
                        <span className="text-sm text-gray-500 mt-10">기본 플랜</span>
                        <span className="text-sm text-gray-500">10GB 드라이브 사용</span>
                        <span className="text-sm text-gray-500">100명 초대 가능</span>
                        <div className="flex items-end mt-10">
                            <div className="flex items-start mt-[10px]">
                            <span className="text-sm text-indigo-500 mr-1">$</span>
                            <span className="text-3xl text-indigo-500">49</span>
                            </div>
                            <p className="text-sm">/month</p>
                        </div>
                        <input
                            name="plan"
                            type="radio"
                            className="mt-[20px]"
                            checked={selected === 'Standard'}
                            readOnly
                        />
                        </div>
                    </label>

                    {/* Enterprise Plan */}
                    <label
                    className={`planbox-label ${selected === 'Enterprise' ? 'selected' : ''}`}
                    onClick={() => handlePlanSelection('Enterprise')}
                    >
                        <div
                        className={`planbox flex flex-col items-center ${
                            selected === 'Enterprise' ? 'border-2 border-indigo-500' : 'border border-indigo-200'
                        }`}
                        >
                            <h3 className="text-lg mt-10">Enterprise</h3>
                            <span className="text-sm text-gray-500 mt-10">비즈니스를 위한 플랜</span>
                            <span className="text-sm text-gray-500">100GB 드라이브 사용</span>
                            <span className="text-sm text-gray-500">인원 제한 없음</span>
                            <div className="flex items-end mt-10">
                                <div className="flex items-start mt-[10px]">
                                <span className="text-sm text-indigo-500 mr-1">$</span>
                                <span className="text-3xl text-indigo-500">499</span>
                                </div>
                                <p className="text-sm">/month</p>
                            </div>
                            <input
                                name="plan"
                                type="radio"
                                className="mt-[20px]"
                                checked={selected === 'Enterprise'}
                                readOnly
                            />
                        </div>
                    </label>
                </div>
                <button className="float-right btn-profile bg-indigo-500 text-white mt-[50px] mb-[20px]">다음</button>
            </>
          }
        </div>
        
      </div>
    </div>
    );
};
