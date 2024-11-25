import { useState } from "react";

export default function MemberAddressModal({ isOpen, onClose , text , data , changeHandler , updateMembers , selectBox }) {
    if (!isOpen) return null;
    
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-custom-fixed">
        <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full modal-custom-width">
            <div className="display-flex mb-8 py-5 px-12 bg-gray-300 rounded-t-2xl">
                <span className="text-2xl">{text}</span>
                <button 
                onClick={onClose}
                className="text-xl float-right display-block font-bold text-gray-600 hover:text-gray-900"
                >
                닫기
                </button>
            </div>
            <div className="modal-content mx-12">
            <div className="flex gap-8 mb-4 justify-start items-center">
            <div className="flex flex-col gap-4 scrollbar-none overflow-scroll max-h-40  w-full">
                {text === '부서장등록' && 
                <>
                {data.map((v) => {
                  return (
                    <div className="flex justify-between" key={v.id}>
                      <div className="flex gap-4">
                        <img src="/images/document-folder-profile.png" alt="User profile" className="cursor-pointer"  data-id={v.id} onClick={changeHandler} />
                        <div className="flex flex-col justify-between">
                            
                            <p className="text-xs">{v.uid}</p>
                            <p className="text-xs text-gray-400">{v.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <select className="outline-none text-xs text-center text-gray-400">
                          <option>읽기</option>
                          <option>쓰기</option>
                          <option>모든권한</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
                </>
                }
            </div>
            
            </div>
            {text === '부서원등록' &&
            <>
            <div className="flex flex-col gap-4 scrollbar-none overflow-scroll max-h-40  w-full">
                {data.map((v) => {
                  return (
                    <div className="flex justify-between" key={v.id}>
                      <div className="flex gap-4">
                        <input onChange={selectBox} data-id={v.id} data-email={v.email} data-uid={v.uid} type="checkbox" />
                        <img src="/images/document-folder-profile.png" alt="User profile" className="cursor-pointer"  data-id={v.id}/>
                        <div className="flex flex-col justify-between">
                            
                            <p className="text-xs">{v.uid}</p>
                            <p className="text-xs text-gray-400">{v.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <select className="outline-none text-xs text-center text-gray-400">
                          <option>읽기</option>
                          <option>쓰기</option>
                          <option>모든권한</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="flex justify-center mb-8 mt-12">
                <button onClick={updateMembers} className="bg-purple h-8 w-20 white rounded-md hover:opacity-80">등록하기</button>
            </div>
            </>
            }
            
            </div>
        </div>
    </div>
  )
}
