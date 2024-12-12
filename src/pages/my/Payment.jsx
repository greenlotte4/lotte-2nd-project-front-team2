import { useState } from "react";
import MyAside from "../../components/my/MyAside";
import { MyModal } from "@/components/my/Modal";
import { MyPlanModal } from "@/components/my/PlanModal";

export default function MyPayment(){
    const [progress, setProgress] = useState(65)

    const [card, setCard] = useState(false);
    const addCard = (event) => {
        event.preventDefault();
        setCard(true);
    }
    const cardClose = () => {
        setCard(false)
    }

    const [plan, setPlan] = useState(false);
    const upgradePlan = (event) => {
        event.preventDefault();
        setPlan(true);
    }
    const planClose = () => {
        setPlan(false)
    }

    return  (
        <div id='my-payment-container'>
          <MyAside/>
          <section className='my-payment-main'>
            <article className="payment-arti1 border">
                <div className="flex justify-between ">
                    <h2 className="text-xl">등록된 결제정보</h2>
                    <button onClick={addCard} className="bg-indigo-500 text-white btn-my">
                        <img src="/images/plus-icon.png" alt="plus" />
                        <span className="ml-2">카드 추가</span>
                    </button>
                </div>
                <ul className="mt-[20px]">
                    <li className="border rounded-lg py-3 px-6 flex justify-between mt-10">
                        <div className="">
                            <img className="payment-icon-img-m ml-10 mb-10 mt-10" src="/images/card-icon-mastercard.png" alt="cardtype" />
                            <span className="text-xl ml-10 flex items-center">
                                카드별명 
                                <div className="popular ml-10">Popular</div>
                            </span>
                            <p className=" ml-10">**** **** **** 0002</p>
                        </div>
                        <div className="flex flex-col justify-center items-end">
                            <div>
                                <button className="btn-profile2 border border-indigo-400 rounded-lg text-indigo-500 font-light">수정</button>
                                <button className="btn-profile2 ml-10 border rounded-lg text-gray-500 font-light">삭제</button>
                            </div>
                            <p className="mt-10">12/28 만료 예정</p>
                        </div>
                    </li>
                    <li className="border rounded-lg py-3 px-6 flex justify-between mt-10">
                        <div className="">
                            <img className="payment-icon-img" src="/images/card-icon-visa.png" alt="cardtype" />
                            <span className="text-xl ml-10 flex items-center">카드별명 
                            </span>
                            <p className=" ml-10">**** **** **** 0002</p>
                        </div>
                        <div className="flex flex-col justify-center items-end">
                            <div>
                                <button className="btn-profile2 border border-indigo-400 rounded-lg text-indigo-500 font-light">수정</button>
                                <button className="btn-profile2 ml-10 border rounded-lg text-gray-500 font-light">삭제</button>
                            </div>
                            <p className="mt-10">12/28 만료 예정</p>
                        </div>
                    </li>
                    <li className="border rounded-lg py-3 px-6 flex justify-between mt-10">
                        <div className="">
                            <img className="payment-icon-img" src="/images/card-icon-visa.png" alt="cardtype" />
                            <span className="text-xl ml-10 flex items-center">카드별명 
                            <div className="expired ml-10">Expired</div>
                            </span>
                            <p className=" ml-10">**** **** **** 0002</p>
                        </div>
                        <div className="flex flex-col justify-center items-end">
                            <div>
                                <button className="btn-profile2 border border-indigo-400 rounded-lg text-indigo-500 font-light">수정</button>
                                <button className="btn-profile2 ml-10 border rounded-lg text-gray-500 font-light">삭제</button>
                            </div>
                            <p className="mt-10">12/23 만료 예정</p>
                        </div>
                    </li>
                </ul>
            </article>
            <article className="payment-arti2 border">
                <div className='current-plan relative p-[20px]  h-[450px] '>
                    <h2 className='text-lg text-gray-600 my-sub-title'>나의 구독정보</h2>
                    <div className='flex justify-between items-start  mt-[30px]'>
                        <div className="bg-indigo-100 text-indigo-400 font-light rounded px-3">Enterprise</div>
                        <div className='flex items-end'>
                            <span className='text-indigo-500'>$</span>
                            <h2 className='text-4xl text-indigo-500'>49</h2>
                            <span className='font-extralight '>/month</span>
                        </div>
                    </div>
                    <ul className='flex flex-col justify-around mt-[30px] ml-10'>
                        <li className='plan-exp'>
                            <p>현재 이용 중인 플랜 <strong className="ml-2">Enterprise</strong></p>
                            <p></p>
                        </li>
                        <li className='plan-exp mt-2'>
                            <p><strong>2024년 11월 18일</strong>부터 구독했습니다.</p>
                            <p>구독 만료시 등록된 이메일로 알림을 보내드립니다.</p>
                        </li>
                        <li className='plan-exp mt-2'>
                            <p>월간 이용료 $499</p>
                            <p>기업용 플랜</p>
                        </li>
                    </ul>
                    <div>
                        <div className='flex justify-between mt-[30px]'>
                        <span className='font-light'>Days</span>
                        <span className='text-gray-500'>{`${progress}%`}</span>
                        </div>
                        <div className="progress-bar">
                        <div className="progress-fill bg-indigo-400" style={{width: `${progress}%`}}></div>
                        </div>
                        <span className='text-sm text-gray-500'>4일 후 만료</span>
                    
                    </div>
                    <div className="alert-yeollow rounded-lg mt-10 w-full h-[50px] flex items-center px-[20px] py-10">
                        현재 구독 중인 플랜의 이용기한이 4일 남았습니다.
                    </div>
                    <div className="flex justify-around mt-[30px]">
                        <button onClick={upgradePlan} className='btn-profile  bg-indigo-500 text-white'>플랜 업그레이드</button>
                        <button className='btn-profile border border-indigo-500 text-indigo-800'>구독 취소</button>
                    </div>
                </div>
            </article>
            <div className='card-modal'>
                <MyModal
                    isOpen={card}
                    onClose={cardClose}
                    text="결제정보 등록"
                />
            </div>
            <div className='plan-modal'>
                <MyPlanModal
                    isOpen={plan}
                    onClose={planClose}
                    text="요금제 변경"
                />
            </div>

          </section>
        </div>
      )
}