import { useRef, useState } from "react";
import MyDropzone from "./DropZone";
import axiosInstance from '@/services/axios.jsx'

export const Modal = ({ isOpen, onClose, children , text }) => {
    if (!isOpen) return null;
    //                                              useState                                             //
    const [user, setUser] = useState([])
    const [user2, setUser2] = useState([])
    const [selectedLeader , setSelectedLeader] = useState("");
    const [depName, setDepName] = useState("");
    const [depDiscription, setDepDiscription] = useState("");
    const [members, setMembers] = useState([]);
    //                                              useState                                             //

    //                                              useRef                                               //
    const selectLeaderRef = useRef(null);
    const selectMemberRef = useRef(null);
    //                                              useRef                                               //
    const getMembers = () => {
      axiosInstance
        .get("/api/users")
        .then((resp) => {
            if(resp.status === 200){
              const users = resp.data;
              setUser(users);  
            }
        })
        .catch()
        
    }

    const getMembers2 = () => {
      axiosInstance
        .get("/api/users")
        .then((resp) => {
            if(resp.status === 200){
              const users = resp.data;
              setUser2(users);  
            }
        })
        .catch()
        
    }
    
    const selectLeader = (e) => {
        setSelectedLeader(e.target.dataset.id)
    }

    const selectMember = (e) => {
        const newId = e.target.dataset.id
        setMembers(prevMembers => [...prevMembers, newId]);
    }

    const changeDepName = (e) => {setDepName(e.target.value)}

    const changeDepDiscription = (e) => {setDepDiscription(e.target.value)}

    const makeDep = (e) => {
      const data = {
        "name" : depName,
        "discription" : depDiscription,
        "leader" : selectedLeader,
        "members" : members
      }

      console.log(data)
    }

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
          {text !== '일정 등록' &&
            <>{children}</>
          }
          {text === '파일 업로드' &&
            <MyDropzone />
          }
          {text === '일정 등록' &&
          <>
            <div className="flex gap-8 mb-4 justify-start">
              <span className="w-20">제목</span>
              <div>
                <input className="h-6 w-96 border rounded-md"></input>
              </div>
            </div>
            <div className="flex gap-8 justify-start mb-4">
              <span className="w-20">날짜</span>
              <div className="flex gap-3">
                <input type="date"></input> ~ <input type="date"></input>
              </div>
            </div>
            <div className="flex gap-8 mb-4 justify-start">
              <span className="w-20">켈린더</span>
              <div>
                <select className="h-6 w-28 outline-none border rounded-md">
                  <option>예시1</option>
                  <option>예시2</option>
                  <option>예시3</option>
                </select>
              </div>
            </div>
            <div className="flex gap-8 mb-4 justify-start">
              <span className="w-20">참석자</span>
              <div>
                <input className="h-6 w-96 border rounded-md"></input>
              </div>
            </div>
            <div className="flex gap-8 mb-4 justify-start">
              <span className="w-20">장소</span>
              <div>
                <input className="h-6 w-96 border rounded-md"></input>
              </div>
            </div>
            <div className="flex gap-8 mb-4 justify-start">
              <span className="w-20">중요도</span>
              <div>
                <select className="h-6 w-28 outline-none border rounded-md">
                  <option>예시1</option>
                  <option>예시2</option>
                  <option>예시3</option>
                </select>
              </div>
            </div>
            <div className="flex gap-8 mb-4 justify-start">
              <span className="w-20">알림</span>
              <div>
                <select className="h-6 w-28 outline-none border rounded-md">
                  <option>예시1</option>
                  <option>예시2</option>
                  <option>예시3</option>
                </select>
              </div>
            </div>
            <div className="flex gap-8 mb-8 justify-start">
              <span className="w-20">메모</span>
              <div>
                <textarea className="h-16 w-96 border rounded-md resize-none"></textarea>
              </div>
            </div>
            <div className="flex justify-center mb-12">
              <button className="bg-purple px-6 py-4 text-xs rounded-md white">등록하기</button>
            </div>
          </>
          }
          {text === '폴더 만들기' &&
            <>
            <div className="flex gap-8 mb-4 justify-start items-center">
              <span className="w-20">이름</span>
              <div>
                <input className="h-10 w-72 border rounded-md p-2 text-xs" placeholder="폴더 이름"></input>
              </div>
            </div>
            <div className="flex gap-8 mb-4 justify-start items-center">
              <span className="w-20">설명</span>
              <div>
                <input className="h-10 w-72 border rounded-md p-2 text-xs" placeholder="폴더 설명"></input>
              </div>
            </div>
            <div className="flex gap-8 mb-4 justify-start items-center">
              <span className="w-20">공유 범위</span>
              <div className="text-xs opacity-60 flex gap-4">
                <label className="flex items-center gap-1"><input type="radio" name="auth"/>나만 사용</label> 
                <label className="flex items-center gap-1"><input type="radio" name="auth"/>선택한 구성원</label> 
                <label className="flex items-center gap-1"><input type="radio" name="auth"/>전체 구성원</label>
              </div>
            </div>
            <div className="flex gap-8 mb-8 justify-start items-start">
              <span className="w-20">공유 인원</span>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <input className="h-10 w-52 border rounded-md p-2 text-xs" placeholder="구성원 또는 조직으로 검색"></input>
                  <button className="border h-10 w-20 rounded-md px-3 text-xs text-gray-400 bg-gray-100">주소록</button>
                </div>
                <div className="flex gap-2">
                  <img src="/images/document-folder-profile.png"/>
                  <div className="flex flex-col justify-between">
                    <p className="text-xs">이상훈</p>
                    <p className="text-xs text-gray-400">sanghun1101088@gmail.com</p>
                  </div>
                  <div className="flex items-center">
                    <select className="outline-none text-xs text-center text-gray-400">
                      <option>읽기</option>
                      <option>쓰기</option>
                      <option>모든권한</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <img src="/images/document-folder-profile.png"/>
                  <div className="flex flex-col justify-between">
                    <p className="text-xs">이상훈</p>
                    <p className="text-xs text-gray-400">sanghun1101088@gmail.com</p>
                  </div>
                  <div className="flex items-center">
                    <select className="outline-none text-xs text-center text-gray-400">
                      <option>읽기</option>
                      <option>쓰기</option>
                      <option>모든권한</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <img src="/images/document-folder-profile.png"/>
                  <div className="flex flex-col justify-between">
                    <p className="text-xs">이상훈</p>
                    <p className="text-xs text-gray-400">sanghun1101088@gmail.com</p>
                  </div>
                  <div className="flex items-center">
                    <select className="outline-none text-xs text-center text-gray-400">
                      <option>읽기</option>
                      <option>쓰기</option>
                      <option>모든권한</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-8 flex justify-end gap-2">
              <button onClick={onClose} className="bg-gray-100 w-20 h-8 rounded-md text-xs">취소</button>
              <button className="bg-purple white w-20 h-8 rounded-md text-xs">만들기</button>
            </div>
            </>
          }
          {text === '드라이브 만들기' &&
            <>
            <div className="flex gap-8 mb-4 justify-start items-center">
              <span className="w-20">이름</span>
              <div>
                <input className="h-10 w-72 border rounded-md p-2 text-xs" placeholder="폴더 이름"></input>
              </div>
            </div>
            <div className="flex gap-8 mb-4 justify-start items-center">
              <span className="w-20">설명</span>
              <div>
                <input className="h-10 w-72 border rounded-md p-2 text-xs" placeholder="폴더 설명"></input>
              </div>
            </div>
            <div className="flex gap-8 mb-4 justify-start items-center">
              <span className="w-20">공유 범위</span>
              <div className="text-xs opacity-60 flex gap-4">
                <label className="flex items-center gap-1"><input type="radio" name="auth"/>나만 사용</label> 
                <label className="flex items-center gap-1"><input type="radio" name="auth"/>선택한 구성원</label> 
                <label className="flex items-center gap-1"><input type="radio" name="auth"/>전체 구성원</label>
              </div>
            </div>
            <div className="flex gap-8 mb-8 justify-start items-start">
              <span className="w-20">드라이브 마스터</span>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <input className="h-10 w-52 border rounded-md p-2 text-xs" placeholder="구성원 또는 조직으로 검색"></input>
                  <button className="border h-10 w-20 rounded-md px-3 text-xs text-gray-400 bg-gray-100">주소록</button>
                </div>
                <div className="flex gap-2">
                  <img src="/images/document-folder-profile.png"/>
                  <div className="flex flex-col justify-between">
                    <p className="text-xs">이상훈</p>
                    <p className="text-xs text-gray-400">sanghun1101088@gmail.com</p>
                  </div>
                  <div className="flex items-center">
                    <select className="outline-none text-xs text-center text-gray-400">
                      <option>읽기</option>
                      <option>쓰기</option>
                      <option>모든권한</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-8 mb-8 justify-start items-start">
              <span className="w-20">공유 인원</span>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <input className="h-10 w-52 border rounded-md p-2 text-xs" placeholder="구성원 또는 조직으로 검색"></input>
                  <button className="border h-10 w-20 rounded-md px-3 text-xs text-gray-400 bg-gray-100">주소록</button>
                </div>
                <div className="flex gap-2">
                  <img src="/images/document-folder-profile.png"/>
                  <div className="flex flex-col justify-between">
                    <p className="text-xs">이상훈</p>
                    <p className="text-xs text-gray-400">sanghun1101088@gmail.com</p>
                  </div>
                  <div className="flex items-center">
                    <select className="outline-none text-xs text-center text-gray-400">
                      <option>읽기</option>
                      <option>쓰기</option>
                      <option>모든권한</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <img src="/images/document-folder-profile.png"/>
                  <div className="flex flex-col justify-between">
                    <p className="text-xs">이상훈</p>
                    <p className="text-xs text-gray-400">sanghun1101088@gmail.com</p>
                  </div>
                  <div className="flex items-center">
                    <select className="outline-none text-xs text-center text-gray-400">
                      <option>읽기</option>
                      <option>쓰기</option>
                      <option>모든권한</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <img src="/images/document-folder-profile.png"/>
                  <div className="flex flex-col justify-between">
                    <p className="text-xs">이상훈</p>
                    <p className="text-xs text-gray-400">sanghun1101088@gmail.com</p>
                  </div>
                  <div className="flex items-center">
                    <select className="outline-none text-xs text-center text-gray-400">
                      <option>읽기</option>
                      <option>쓰기</option>
                      <option>모든권한</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-8 mb-8 justify-start items-center">
              <span className="w-20">링크 공유</span>
              <div>
                <select className="h-10 w-72 border rounded-md p-2 text-xs outline-none text-center">
                  <option>허용함</option>
                  <option>허용안함</option>
                </select>
              </div>
            </div>
            <div className="mb-8 flex justify-end gap-2 mb-8">
              <button onClick={onClose} className="bg-gray-100 w-20 h-8 rounded-md text-xs">취소</button>
              <button className="bg-purple white w-20 h-8 rounded-md text-xs">만들기</button>
            </div>
            </>
          }
          {text === '사원 등록' &&
          <>

          </>
          }
          {text === '외주업체 등록' &&
          <>
          <div className="flex gap-8 mb-4 justify-start items-center">
              <span className="w-20">회사명</span>
              <div>
                <input className="h-10 w-72 border rounded-md p-2 text-xs" placeholder="회사명"></input>
              </div>
          </div>
          <div className="flex gap-8 mb-4 justify-start items-center">
              <span className="w-20">결제일</span>
              <div>
                <input type="date" className="h-10 w-72 border rounded-md p-2 text-xs text-gray-400" placeholder="회사명"></input>
              </div>
          </div>
          <div className="flex gap-8 mb-4 justify-start items-center">
              <span className="w-20">계약기간</span>
              <div>
                <input type="number" className="h-10 w-72 border rounded-md p-2 text-xs" placeholder="O개월"></input>
              </div>
          </div>
          <div className="flex gap-8 mb-4 justify-start items-center">
              <span className="w-20">파견인원</span>
              <div>
                <input type="number" className="h-10 w-72 border rounded-md p-2 text-xs" placeholder="O명"></input>
              </div>
          </div>
          <div className="flex gap-8 mb-4 justify-start items-center">
              <span className="w-20">결제금액</span>
              <div>
                <input type="number" className="h-10 w-72 border rounded-md p-2 text-xs" placeholder="O원"></input>
              </div>
          </div>
          <div className="flex gap-8 mb-8 justify-start items-center">
              <span className="w-20">연락처</span>
              <div>
                <input className="h-10 w-72 border rounded-md p-2 text-xs" placeholder="전화번호"></input>
              </div>
          </div>
          <div className="mb-8 flex justify-end gap-2 mb-8">
              <button onClick={onClose} className="bg-gray-100 w-20 h-8 rounded-md text-xs">취소</button>
              <button className="bg-purple white w-20 h-8 rounded-md text-xs">등록하기</button>
          </div>
          </>
          }
          {text === '팀 생성' &&
          <>
          <div className="flex gap-8 mb-4 justify-start items-center">
            <span className="w-20">이름</span>
            <div>
              <input className="h-10 w-72 border rounded-md p-2 text-xs" placeholder="팀 이름"></input>
            </div>
          </div>
          <div className="flex gap-8 mb-4 justify-start items-center">
            <span className="w-20">설명</span>
            <div>
              <input className="h-10 w-72 border rounded-md p-2 text-xs" placeholder="팀 설명"></input>
            </div>
          </div>
          <div className="flex gap-8 mb-8 justify-start items-start">
            <span className="w-20">팀장</span>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <input className="h-10 w-52 border rounded-md p-2 text-xs" placeholder="구성원 또는 조직으로 검색"></input>
                <button className="border h-10 w-20 rounded-md px-3 text-xs text-gray-400 bg-gray-100">주소록</button>
              </div>
              <div className="flex gap-2">
                <img src="/images/document-folder-profile.png"/>
                <div className="flex flex-col justify-between">
                  <p className="text-xs">이상훈</p>
                  <p className="text-xs text-gray-400">sanghun1101088@gmail.com</p>
                </div>
                <div className="flex items-center">
                  <select className="outline-none text-xs text-center text-gray-400">
                    <option>읽기</option>
                    <option>쓰기</option>
                    <option>모든권한</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-8 mb-8 justify-start items-start">
            <span className="w-20">팀원</span>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <input className="h-10 w-52 border rounded-md p-2 text-xs" placeholder="구성원 또는 조직으로 검색"></input>
                <button className="border h-10 w-20 rounded-md px-3 text-xs text-gray-400 bg-gray-100">주소록</button>
              </div>
              <div className="flex gap-2">
                <img src="/images/document-folder-profile.png"/>
                <div className="flex flex-col justify-between">
                  <p className="text-xs">이상훈</p>
                  <p className="text-xs text-gray-400">sanghun1101088@gmail.com</p>
                </div>
                <div className="flex items-center">
                  <select className="outline-none text-xs text-center text-gray-400">
                    <option>읽기</option>
                    <option>쓰기</option>
                    <option>모든권한</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <img src="/images/document-folder-profile.png"/>
                <div className="flex flex-col justify-between">
                  <p className="text-xs">이상훈</p>
                  <p className="text-xs text-gray-400">sanghun1101088@gmail.com</p>
                </div>
                <div className="flex items-center">
                  <select className="outline-none text-xs text-center text-gray-400">
                    <option>읽기</option>
                    <option>쓰기</option>
                    <option>모든권한</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <img src="/images/document-folder-profile.png"/>
                <div className="flex flex-col justify-between">
                  <p className="text-xs">이상훈</p>
                  <p className="text-xs text-gray-400">sanghun1101088@gmail.com</p>
                </div>
                <div className="flex items-center">
                  <select className="outline-none text-xs text-center text-gray-400">
                    <option>읽기</option>
                    <option>쓰기</option>
                    <option>모든권한</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-8 mb-8 justify-start items-center">
            <span className="w-20">링크 공유</span>
            <div>
              <select className="h-10 w-72 border rounded-md p-2 text-xs outline-none text-center">
                <option>허용함</option>
                <option>허용안함</option>
              </select>
            </div>
          </div>
          <div className="mb-8 flex justify-end gap-2 mb-8">
            <button onClick={onClose} className="bg-gray-100 w-20 h-8 rounded-md text-xs">취소</button>
            <button className="bg-purple white w-20 h-8 rounded-md text-xs">만들기</button>
          </div>
          </>
          }
          {/* {text === '부서 생성' &&
          <>
            <div className="flex gap-8 mb-4 justify-start items-center">
              <span className="w-20">이름</span>
              <div>
                <input value={depName} onChange={changeDepName} className="h-10 w-72 border rounded-md p-2 text-xs" placeholder="부서 이름"></input>
              </div>
            </div>
            <div className="flex gap-8 mb-4 justify-start items-center">
              <span className="w-20">설명</span>
              <div>
                <input value={depDiscription} onChange={changeDepDiscription} className="h-10 w-72 border rounded-md p-2 text-xs" placeholder="부서 설명"></input>
              </div>
            </div>
            <div className="flex gap-8 mb-8 justify-start items-start">
              <span className="w-20">부서장</span>
              <div className="flex flex-col gap-4 scrollbar-none overflow-scroll max-h-40">
                <div className="flex gap-2">
                  <input className="h-10 w-52 border rounded-md p-2 text-xs" placeholder="구성원 또는 조직으로 검색"></input>
                  <button onClick={getMembers} className="border h-10 w-20 rounded-md px-3 text-xs text-gray-400 bg-gray-100">주소록</button>
                </div>
                {user.map((v) => {
                  return (
                    <div className="flex gap-2" key={v.id}>
                      <img src="/images/document-folder-profile.png" alt="User profile" className="cursor-pointer"  data-id={v.id} onClick={selectLeader} />
                      <div className="flex flex-col justify-between">
                        <p className="text-xs">{v.uid}</p>
                        <p className="text-xs text-gray-400">{v.email}</p>
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
            </div>
            <div className="flex gap-8 mb-8 justify-start items-start">
              <span className="w-20">부서원</span>
              <div className="flex flex-col gap-4 scrollbar-none overflow-scroll max-h-40">
                <div className="flex gap-2">
                  <input className="h-10 w-52 border rounded-md p-2 text-xs" placeholder="구성원 또는 조직으로 검색"></input>
                  <button onClick={getMembers2} className="border h-10 w-20 rounded-md px-3 text-xs text-gray-400 bg-gray-100">주소록</button>
                </div>
                {user2.map((v) => {
                  return (
                    <div className="flex gap-2 cursor-pointer" key={v.id}>
                      <img src="/images/document-folder-profile.png" alt="User profile"  className="cursor-pointer"  data-id={v.id} onClick={selectMember} />
                      <div className="flex flex-col justify-between">
                        <p className="text-xs">{v.uid}</p>
                        <p className="text-xs text-gray-400">{v.email}</p>
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
            </div>
            <div className="flex gap-8 mb-8 justify-start items-center">
              <span className="w-20">링크 공유</span>
              <div>
                <select className="h-10 w-72 border rounded-md p-2 text-xs outline-none text-center">
                  <option>허용함</option>
                  <option>허용안함</option>
                </select>
              </div>
            </div>
            <div className="mb-8 flex justify-end gap-2 mb-8">
              <button onClick={onClose} className="bg-gray-100 w-20 h-8 rounded-md text-xs">취소</button>
              <button onClick={makeDep} className="bg-purple white w-20 h-8 rounded-md text-xs">만들기</button>
            </div>
          </>
          } */}
          {text === '부서장' &&
          <>
          </>
          }
          {text === '업무 등록' &&
          <>
          <div className="flex gap-8 mb-4 justify-start items-center">
            <span className="w-20">이름</span>
            <div>
              <input className="h-10 w-72 border rounded-md p-2 text-xs" placeholder="업무명"></input>
            </div>
          </div>
          <div className="flex gap-8 mb-4 justify-start items-center">
            <span className="w-20">내용</span>
            <div>
              <input className="h-10 w-72 border rounded-md p-2 text-xs" placeholder="업무내용"></input>
            </div>
          </div>
          <div className="flex gap-8 mb-4 justify-start items-center">
            <span className="w-20">마감일</span>
            <div>
              <input type="date" className="h-10 w-72 border rounded-md p-2 text-xs text-gray-400"></input>
            </div>
          </div>
          <div className="flex gap-8 mb-8 justify-start items-start">
            <span className="w-20">팀장</span>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <input className="h-10 w-52 border rounded-md p-2 text-xs" placeholder="구성원 또는 조직으로 검색"></input>
                <button className="border h-10 w-20 rounded-md px-3 text-xs text-gray-400 bg-gray-100">주소록</button>
              </div>
              <div className="flex gap-2">
                <img src="/images/document-folder-profile.png"/>
                <div className="flex flex-col justify-between">
                  <p className="text-xs">이상훈</p>
                  <p className="text-xs text-gray-400">sanghun1101088@gmail.com</p>
                </div>
                <div className="flex items-center">
                  <select className="outline-none text-xs text-center text-gray-400">
                    <option>읽기</option>
                    <option>쓰기</option>
                    <option>모든권한</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-8 mb-8 justify-start items-start">
            <span className="w-20">팀원</span>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <input className="h-10 w-52 border rounded-md p-2 text-xs" placeholder="구성원 또는 조직으로 검색"></input>
                <button className="border h-10 w-20 rounded-md px-3 text-xs text-gray-400 bg-gray-100">주소록</button>
              </div>
              <div className="flex gap-2">
                <img src="/images/document-folder-profile.png"/>
                <div className="flex flex-col justify-between">
                  <p className="text-xs">이상훈</p>
                  <p className="text-xs text-gray-400">sanghun1101088@gmail.com</p>
                </div>
                <div className="flex items-center">
                  <select className="outline-none text-xs text-center text-gray-400">
                    <option>읽기</option>
                    <option>쓰기</option>
                    <option>모든권한</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <img src="/images/document-folder-profile.png"/>
                <div className="flex flex-col justify-between">
                  <p className="text-xs">이상훈</p>
                  <p className="text-xs text-gray-400">sanghun1101088@gmail.com</p>
                </div>
                <div className="flex items-center">
                  <select className="outline-none text-xs text-center text-gray-400">
                    <option>읽기</option>
                    <option>쓰기</option>
                    <option>모든권한</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <img src="/images/document-folder-profile.png"/>
                <div className="flex flex-col justify-between">
                  <p className="text-xs">이상훈</p>
                  <p className="text-xs text-gray-400">sanghun1101088@gmail.com</p>
                </div>
                <div className="flex items-center">
                  <select className="outline-none text-xs text-center text-gray-400">
                    <option>읽기</option>
                    <option>쓰기</option>
                    <option>모든권한</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-8 flex justify-end gap-2 mb-8">
            <button onClick={onClose} className="bg-gray-100 w-20 h-8 rounded-md text-xs">취소</button>
            <button className="bg-purple white w-20 h-8 rounded-md text-xs">만들기</button>
          </div>
          </>
          }
        
        </div>
        
      </div>
    </div>
    );
};
