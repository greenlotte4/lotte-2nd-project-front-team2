import { Link, useNavigate } from "react-router-dom";
import { CustomSearch } from "@/components/Search";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../services/axios";
import usePageUsersSocket from "../../util/userPageUsersSocket";
import useUserStore from "../../store/useUserStore";
import ReactDOM from 'react-dom';

function PageOptionsModal({ page, onClose, onDelete }) {
  const [pageNo,setPageNo] = useState(0);



  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-[9999]">
      {pageNo==0 &&
      <div className="bg-white rounded-lg shadow-lg p-6 w-[300px]">
        <h3 className="text-lg font-bold mb-4 text-center">{page.title}</h3>
        <div className="flex flex-col space-y-3">
          <button 
            className="bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
            onClick={() => {
              onDelete();
            }}
          >
            페이지 삭제
          </button>
          <button 
            className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-400"
            onClick={()=>setPageNo(1)}
          >
            권한관리
          </button>
          <button 
            className="bg-gray-200 py-2 rounded-md hover:bg-gray-300"
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </div>
      }
      {pageNo==1 &&
      <div className="bg-white rounded-lg shadow-lg p-6 w-[300px]">
         <h3 className="text-lg font-bold mb-4 text-center">{page.title}</h3>
         <div>
          <li>user1</li>
          <li>user2</li>
          <li>user3</li>
         </div>
      </div>
      }
    </div>,
    document.body
  );
}

export default function PageAside() {
  const [isMyPageOpen, setIsMyPageOpen] = useState(true);     
  const [isSharePageOpen, setIsSharePageOpen] = useState(true);
  const [receiveUsers, setReceiveUsers] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const userId = useUserStore((state) => state.user?.uid);
  const [selectedPage,setSelectedPage] = useState();
  const queryClient = useQueryClient();
  const navi = useNavigate();
  const { sendWebSocketMessage, isConnected , updateUserId } = usePageUsersSocket({ setReceiveUsers });
  const toggleMyPageSection = () => {
    setIsMyPageOpen((prev) => !prev);
  };

  useEffect(()=>{
    if(userId===undefined){
      return;
    } else if(userId){
      updateUserId(userId)
    }
  },[userId])

  useEffect(()=>{
    if(receiveUsers=='delete'){
      queryClient.invalidateQueries(['pageList'])
      navi("/page")
    }
    if(receiveUsers=='added'){
      queryClient.invalidateQueries(['pageList'])
    }
  },[receiveUsers])

  const toggleSharePageSection = () => {
    setIsSharePageOpen((prev) => !prev);
  }

  const postPageMutation = useMutation({
    mutationFn : async ()=>{
      try {
        const resp = await axiosInstance.post("/api/page")
        return resp.data;
      } catch (err) {
        return err;
      }
    },
    onSuccess : (data) => {
      navi("/page/view/"+data)
    },
    onError : (err) => {

    }
  })

  const postPage = async () => {
    try {
      await postPageMutation.mutateAsync();
    } catch (err) {
      console.log(err)
    }
  }

  // Fetching page list using useQuery
  const { data: pageList = [], isLoading, isFetching, isError } = useQuery({
    queryKey: ["pageList"],
    queryFn: async () => {
        const response = await axiosInstance.get("/api/page/list");
        return response.data;
    },
    initialData: [],
  });

  const deletePageMutation = useMutation({
    mutationFn : async () => {
      try {
        const resp = await axiosInstance.delete(`/api/page/${selectedPage.id}`)
        return resp.data
      } catch (err) {
        return err;
      }
    },
    onSuccess : (data) => {
      navi("/page")
    },
    onError : (err) => {

    }
  })

  const openModalHandler = (page) => {
    setSelectedPage(page);
  };

  const closeModalHandler = () => {
    setSelectedPage(null);
  };

  const deleteHandler = async () => {
    try {
      await deletePageMutation.mutateAsync();
    } catch (err) {
      console.log(err)
    }
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading page list.</p>;
  }

  return (
    <>
      <aside className="page-aside1 overflow-scroll flex flex-col scrollbar-none">
        <section className="flex justify-center mb-8">
        <Link to="/page"><p className="text-lg">내 페이지 (6)</p></Link>
        </section>
        <section className="flex justify-center mb-[15px] w-26">
          <select className="outline-none border rounded-l-md opacity-80 h-11 w-[80px] text-left text-sm">
            <option>내용</option>
            <option>제목</option>
          </select>
            <label className={`flex justify-start items-center border rounded-r-md w-[180px] h-11`}>
                <img className='opacity-50 w-6 h-6 ml-4' src='/images/search-icon.png' />
                <input className={`pl-4 w-[120px] text-sm text-center`} placeholder='검색하기'/>
            </label>        
        </section>
        <section className="py-[0px] px-[20px] mb-10">
          <div className="flex gap-4 items-center opacity-60 mb-6">
            <img className="w-6 h-6" src="/images/document-star.png" alt="" />
            <Link to="/page/favorite">
              <p>즐겨찾기 (3)</p>
            </Link>
          </div>
          <div className="flex gap-4 items-center opacity-60">
            <img src="/images/document-recent.png" alt="" />
            <p>최근 페이지</p>
          </div>
        </section>

        {/* Toggleable Section */}
        <article className="pageList">
          <section className="flex justify-between items-center p-4">
            <div>
              <p className="text-2xl font-bold">
                나의 페이지{" "}
                <span className="text-xs font-normal opacity-60">
                  ({pageList.length})
                </span>
              </p>
            </div>
            <div>
              <img
                className={`cursor-pointer hover:opacity-20 w-[15px] h-[10px] opacity-60 transform transition-transform duration-300 ${
                  isMyPageOpen ? "rotate-0" : "-rotate-90"
                }`}
                src="/images/arrow-bot.png"
                alt="Toggle"
                onClick={toggleMyPageSection}
              />
            </div>
          </section>

          <section
            className={`mypageArea flex flex-col px-8 overflow-scroll scrollbar-none transition-all duration-300 ${
              isMyPageOpen ? "max-h-[180px]" : "max-h-0"
            }`}
          >
            {pageList.map((page) => (
              <div 
                key={page.id} 
                className="flex justify-between items-center"
              >
                <Link
                  to={`/page/view/${page.id}`}
                  className="flex gap-4 items-center mb-1"
                >
                  <img src="/images/pagesIcon.png" alt="" />
                  <p className="opacity-60 pt-1">{page.title}</p>
                </Link>
                <img
                  onClick={() => openModalHandler(page)}
                  className="w-[16px] h-[16px] opacity-60 cursor-pointer hover:opacity-100"
                  src="/images/calendar-setting.png"
                />
              </div>
            ))}
          </section>
        </article>

        <section className="newPage mt-auto flex flex-col gap-5 rounded-md">
          <div
            className="newPageBtn bg-purple white h-8 rounded-md flex justify-center text-center items-center"
            onClick={postPage}
          >
            <img
              className="documentPen mr-[10px]"
              src="/images/document-pen.png"
              alt=""
            />
            새 페이지 생성
          </div>
        </section>
      </aside>

      {/* 모달 렌더링 */}
      {selectedPage && (
        <PageOptionsModal
          page={selectedPage}
          onClose={closeModalHandler}
          onDelete={deleteHandler}
        />
      )}
    </>
  );
}
