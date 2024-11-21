export const Modal = ({ isOpen, onClose, children , text }) => {
    if (!isOpen) return null;
return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full">
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
        </div>
        
      </div>
    </div>
    );
};
