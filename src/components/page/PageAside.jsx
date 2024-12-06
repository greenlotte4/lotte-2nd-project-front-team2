import { Link } from "react-router-dom";
import { CustomSearch } from "@/components/Search";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../services/axios";

export default function PageAside() {
  const [isMyPageOpen, setIsMyPageOpen] = useState(true); // State to track "My Page" section visibility    
  const [isSharePageOpen, setIsSharePageOpen] = useState(true);
  const toggleMyPageSection = () => {
    setIsMyPageOpen((prev) => !prev); // Toggle the section
  };

  const toggleSharePageSection = () => {
    setIsSharePageOpen((prev) => !prev);
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
                <span className="text-xs font-normal opacity-60">({pageList.length})</span>
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

            {/* My Page Section */}
            <section
            className={`mypageArea flex flex-col px-8  overflow-scroll scrollbar-none transition-all duration-300 ${
                isMyPageOpen ? "max-h-[180px]" : "max-h-0"
            }`}
            >
           {pageList.map((page) => (
              <Link
                key={page.id}
                to={`/page/view/${page.id}`}
                className="flex gap-4 items-center mb-1"
              >
                <img src="/images/pagesIcon.png" alt="" />
                <p className="opacity-60 pt-1">{page.title}</p>
              </Link>
            ))}
            </section>

            <section className="flex justify-between items-center p-4 mt-4">
            <div>
                <p className="text-2xl font-bold">
                공유 페이지{" "}
                <span className="text-xs font-normal opacity-60">(3)</span>
                </p>
            </div>
            <div>
            <img
                className={`cursor-pointer hover:opacity-20 w-[15px] h-[10px] opacity-60 transform transition-transform duration-300 ${
                    isSharePageOpen ? "rotate-0" : "-rotate-90"
                }`}
                src="/images/arrow-bot.png"
                alt="Toggle"
                onClick={toggleSharePageSection}
                />
            </div>
            </section>

            <section
                className={`mypageArea flex flex-col px-8  overflow-scroll scrollbar-none transition-all duration-300 ${
                    isSharePageOpen ? "max-h-[180px] " : "max-h-0"
                }`}>
            <Link to="/page/list"  className="flex gap-4 items-center mb-1">
                <img src="/images/pagesIcon.png" alt="" />
                <p className="opacity-60 pt-1">공유 폴더 1</p>
            </Link>
            <Link to="/page/list"  className="flex gap-4 items-center mb-1">
                <img src="/images/pagesIcon.png" alt="" />
                <p className="opacity-60 pt-1">공유 폴더 2</p>
            </Link>
            <Link to="/page/list"  className="flex gap-4 items-center mb-1">
                <img src="/images/pagesIcon.png" alt="" />
                <p className="opacity-60 pt-1">공유 폴더 3</p>
            </Link>
            <Link to="/page/list"  className="flex gap-4 items-center mb-1">
                <img src="/images/pagesIcon.png" alt="" />
                <p className="opacity-60 pt-1">공유 폴더 3</p>
            </Link>
            <Link to="/page/list"  className="flex gap-4 items-center mb-1">
                <img src="/images/pagesIcon.png" alt="" />
                <p className="opacity-60 pt-1">공유 폴더 3</p>
            </Link>
            <Link to="/page/list"  className="flex gap-4 items-center mb-1">
                <img src="/images/pagesIcon.png" alt="" />
                <p className="opacity-60 pt-1">공유 폴더 3</p>
            </Link>
            <Link to="/page/list"  className="flex gap-4 items-center mb-1">
                <img src="/images/pagesIcon.png" alt="" />
                <p className="opacity-60 pt-1">공유 폴더 3</p>
            </Link>
            </section>
        </article>
      
        <section className="newPage mt-auto flex flex-col gap-5 rounded-md">
          <Link
            to="/page/newPage"
            className="newPageBtn bg-purple white h-8 rounded-md flex justify-center text-center items-center"
          >
            <img
              className="documentPen mr-[10px]"
              src="/images/document-pen.png"
              alt=""
            />
            새 페이지 생성
          </Link>
        </section>
      </aside>
    </>
  );
}
