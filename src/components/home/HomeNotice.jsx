
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axiosInstance from '@/services/axios.jsx'
import useUserStore from "../../store/useUserStore";

const HomeNotice = () => {

    const user = useUserStore((state)=> state.user);
    const getNoticeAPI = async () => {
        const resp = await axiosInstance.get('/api/community/board/notice');
        console.log("공지사항 "+JSON.stringify(resp.data));
        return resp.data;
    }

    const { data, isError, isLoading } = useQuery({
    queryKey: [`notice`],
    queryFn: getNoticeAPI,
    enabled: Boolean(user?.uid),
    initialData: []
    });


    return(
        <>
            <div className="flex items-center justify-between mb-2">
                <h2 className='text-2xl ml-[5px]'>Notice</h2>
                {/* <Link to={"/community/1/list"}className='flex justify-between items-center text-gray-600 border border-gray-400 rounded-lg px-3 h-[28px]'>

                    <span>전체보기</span>
                    <img className='ml-2 w-[20px] h-[20px]' src="/images/ArrowForward.png" alt="allow" />
                </Link>     */}
            </div>
            <ul 
            // className="border rounded-lg"
            >
                {isLoading ? (
                    <p>로딩 중...</p>
                ) : isError ? (
                    <p>데이터를 불러오는 데 실패했습니다.</p>
                ) : (!Array.isArray(data) || data.length === 0) ? (
                        <>
                        <li className='border rounded-lg flex flex-col py-2 px-5 mt-1 h-[60px]'>
                            <div className='flex justify-between'>
                                <p>등록된 공지사항이 없습니다.</p>
                                <span className='text-gray-400 font-extralight'>2024.11.18</span>
                            </div>
                            <p className='text-right'>전체공지</p>
                        </li>
                        </>
                ) : (
                    <>
                        {data.map((n, index) => {
                            const create = n.createdAt.split("T")[0];
                            index ++
                            
                            return (
                                <Link to={`/community/1/view/${n.postId}`}>
                                    <li className='border bg-white rounded-lg mb-1 px-3 flex flex-col py-1 justify-center h-[48px]'>
                                        <div className="flex items-center justify-between ">
                                            <div className="flex items-center ">
                                                <div className={`px-2 h-[23px] rounded flex items-center mr-2 ${n.mandatory? 'bg-indigo-400':'bg-gray-300'}`}>
                                                    <span className="text-white text-sm">{ n.mandatory ? '필독' : '공지'}</span>
                                                </div>
                                                {/* <span className="mr-[20px] text-indigo-500 font-bold">{index}</span> */}
                                                <p>{n.title}</p>
                                                {/* <span className="text-gray-600 text-xs">{n.content}</span> */}
                                            </div>
                                            <div className="flex flex-col items-end">
                                                    <span className='text-gray-400 text-xs font-extralight'>{create}</span>
                                                
                                                    {/* <span className='text-sm mr-10 text-gray-500'>{n.writer}</span> */}
                                                    {/* <p className='text-xs'>Plantry</p> */}
                                                    <div className="flex items-center">
                                                        <span className="text-xs flex mr-10">
                                                            <img className="w-[15px] h-[15px] mr-2" src="/images/people-icon.png" alt="" />
                                                            0
                                                        </span>
                                                        <span className="text-xs flex">
                                                            <img className="w-[15px] h-[15px] mr-2" src="/images/people-icon.png" alt="" />
                                                            0
                                                        </span>
                                                    </div>
                                            </div>
                                        </div>
                                    </li>
                                </Link>
                            );
                        })}
                    </>
                )}
            </ul>
        </>
    )
}
export default HomeNotice;