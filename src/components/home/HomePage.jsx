
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axiosInstance from '@/services/axios.jsx'
import useUserStore from "../../store/useUserStore";

const HomePage = () => {

    const user = useUserStore((state)=> state.user);
    const getNoticeAPI = async () => {
        const resp = await axiosInstance.get('/api/page/list');
        console.log("페이지 "+JSON.stringify(resp.data));
        return resp.data;
    }

    const { data, isError, isLoading } = useQuery({
    queryKey: [`page`],
    queryFn: getNoticeAPI,
    enabled: Boolean(user?.uid),
    initialData: []
    });


    return (
        <div 
        className="px-[7px]"
        >
            <div className="flex items-center justify-between mb-3">
                <h2 className='text-2xl'>Pages</h2>
                {/* <Link to={"/community/1/list"}className='flex justify-between items-center text-gray-600 border border-gray-400 rounded-lg px-3 h-[28px]'>
                    <span>전체보기</span>
                    <img className='ml-2 w-[20px] h-[20px]' src="/images/ArrowForward.png" alt="allow" />
                </Link>     */}
            </div>
            <ul className="">
                {isLoading ? (
                    <p>로딩 중...</p>
                ) : isError ? (
                    <p>데이터를 불러오는 데 실패했습니다.</p>
                ) : (!Array.isArray(data) || data.length === 0) ? (
                    <>    
                        <Link to={"/page"}>
                            <li className='border rounded-lg flex flex-col py-2 px-5 mt-1 h-[60px]'>
                                <div className='flex items-center '>
                                    <span className=" mr-[20px] text-gray-500">👀</span>
                                    <div className="flex flex-col">
                                        <p>불러올 페이지가 없습니다.</p>
                                        <span className='text-gray-400 font-extralight text-xs'>페이지 목록으로 가기</span>
                                    </div>
                                </div>
                            </li>
                        </Link>
                        <Link to={"/page"}>
                            <li className='border rounded-lg flex flex-col py-2 px-5 mt-1 h-[60px]'>
                                <div className='flex items-center'>
                                    <span className=" mr-[20px] text-gray-500">💡</span>
                                    <div className="flex flex-col">
                                        <p>페이지 템플릿을 열어볼까요?</p>
                                        <span className='text-gray-400 font-extralight text-xs'>페이지를 만들어봐요!</span>
                                    </div>
                                </div>
                            </li>
                        </Link>
                    </>
                ) : (
                    <>
                        {data.map((n) => {
                            const create = n.createAt.split("T")[0];
                            
                            return (
                                <Link to={`/page/view/${n.id}`}>
                                    <li className='border rounded-lg flex flex-col justify-center py-1 px-5 mt-1 h-[60px]'>
                                        <div className="flex items-center justify-between ">
                                            <div className="flex items-center">
                                                {/* <img className="mr-[20px] " src="/images/pagesIcon.png" alt="" /> */}
                                                <span className="mr-[20px] text-gray-500 ">👀</span>
                                                <p>{n.title}</p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                    <span className='text-gray-400 font-extralight'>{create}</span>
                                                
                                                    {/* <span className='text-sm mr-10 text-gray-500'>{n.writer}</span> */}
                                                    {/* <p className='text-xs'>흠</p> */}
                                                
                                            </div>
                                        </div>
                                    </li>
                                </Link>
                            );
                        })}
                    </>
                )}
            </ul>
        </div>
    )
}

export default HomePage;