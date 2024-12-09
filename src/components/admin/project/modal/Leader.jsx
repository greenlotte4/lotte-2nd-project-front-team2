import React, { useEffect, useState } from 'react'
import { CustomSVG } from '../../../project/_CustomSVG';
import CustomAlert from '../../../Alert';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/axios.jsx'

export default function Leader({isOpen, onClose , id}) {
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [alert, setAlert] = useState(false);
    const [leaderId, setLeaderId] = useState(0);

    useEffect(()=>{
        if(id != 0 && id!=undefined){
            setLeaderId(id)
        }
    },[id])

    const { 
        data : leaderDetail,
        isLoading : isLoadingDetail,
        isError : isErrorDetail
    } = useQuery({
        queryKey : ['leader-detail',leaderId],
        queryFn : async () => {
            try {
                const resp = await axiosInstance.get("/api/admin/project/leader?id="+leaderId)
                return resp.data
            } catch (err) {
                return err;
            }
        },
        enabled : !!leaderId,
        cacheTime : 10 * 1000 * 60,
        refetchOnWindowFocus : false
    })

    if(!isOpen) return null;
    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <CustomAlert 
          type={type}
          message={message}
          isOpen={alert}
        />
        <div className="bg-white rounded-2xl shadow-lg w-[1000px] min-h-[800px] max-h-[800px] overflow-scroll scrollbar-none">
            <div className="display-flex mb-8 py-3.5 px-12 bg-white border-b rounded-t-2xl z-10 sticky top-0">
                <span className="text-xl font-bold">부서장</span>
                <button 
                onClick={onClose}
                className="text-xl float-right display-block font-bold text-gray-600 hover:text-gray-900"
                >
                <CustomSVG id="close" color='currentColor' />
                </button>
            </div>
            <div className='mx-[100px]'>
                {isLoadingDetail ? (<p>로딩중...</p>) : isErrorDetail ? (<p>에러!!</p>)
                : (leaderDetail && typeof leaderDetail === 'object' && leaderDetail !== null)
                ? 
                (
                <>
                <div key={leaderDetail.id} className='flex gap-[10px] text-[15px]'>
                    <div className='p-[20px] w-[200px]'>
                        <div className='text-[18px] font-bold mb-[10px]'>개인 정보</div>
                        <div className='flex flex-col gap-[5px]'>
                        <p className=''>{leaderDetail.name} ({leaderDetail.level})</p>
                        <p>{leaderDetail.hp}</p>
                        <p>{leaderDetail.address}</p>
                        </div>
                    </div>
                    <div className='p-[20px] w-[250px] mx-auto'>
                        <div className='text-[18px] font-bold mb-[10px]'>부서 일정</div>
                        <div className='hover:text-purple-400 cursor-pointer'>{leaderDetail.calendarName}</div>
                    </div>
                    <div className='flex flex-col gap-[10px] p-[20px] w-[300px]'>
                        <div className='text-[18px] font-bold mb-[10px]'>부서 프로젝트</div>
                        {Array.isArray(leaderDetail.projects)&&leaderDetail.projects.length>0
                        ?leaderDetail.projects.map((v,i)=>{return(
                        <>
                        <div className='hover:text-purple-400 cursor-pointer' key={i}>{v.projectTitle} ({v.projectStatus}) 0%</div>
                        </>
                        )}) :
                        (<div>진행중인 프로젝트 없음</div>)
                        }
                    </div>
                </div>
                <div className='border-t'>
                    <div className='p-[20px]'>ddd</div>
                </div>
                </>
                ):(<p>정보가 없습니다...</p>)
                }
            </div>
        </div>
    </div>
  )
}
