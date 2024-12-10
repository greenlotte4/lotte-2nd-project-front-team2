import React, { useState } from 'react'
import CustomAlert from '../../../Alert';
import { CustomSVG } from '../../../project/_CustomSVG';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/services/axios.jsx'

export default function PostOutsourcing({isOpen, onClose}) {
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [alert, setAlert] = useState(false);
    const [outsourcingName, setOutsourcingName] = useState('')
    const [hp,setHp] = useState('')
    const [payment,setPayment] = useState('')
    const [end, setEnd] = useState('')
    const [size,setSize] = useState(1)
    const queryClient = useQueryClient();
    
    const postOutsourcingMutation = useMutation({
        mutationFn : async () => {
            try {
                const resp = await axiosInstance.post("/api/admin/outsourcing",{
                    outsourcingName,
                    hp,
                    payment,
                    end,
                    size
                })
                return resp.data
            } catch (err) {
                return err;
            }
        },
        onSuccess : (data) => {
            setType("success")
            setAlert(true)
            setMessage(data)
            queryClient.invalidateQueries(['outsourcing'])
            setTimeout(() => {
                setAlert(false)
                onClose()
            }, 1000);
        },
        onError : (err) => {
            setType("error")
            setAlert(true)
            setMessage(err)

            setTimeout(() => {
                setAlert(false)
            }, 1000);
        }
    })

    const postOutsourcingHandler = async () => {
        try {
            await postOutsourcingMutation.mutateAsync();    
        } catch (err) {
            console.log(err)
        }
    }


    if(!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <CustomAlert 
        type={type} message={message} isOpen={alert}
      />
        <div className="bg-white rounded-2xl shadow-lg w-[800px] min-h-[400px] max-h-[800px] overflow-scroll scrollbar-none">
            <div className="display-flex mb-8 py-3.5 px-12 bg-white border-b rounded-t-2xl z-10 sticky top-0">
                <span className="text-xl font-bold">외주업체등록</span>
                <button 
                onClick={onClose}
                className="text-xl float-right display-block font-bold text-gray-600 hover:text-gray-900"
                >
                <CustomSVG id="close" color='currentColor' />
                </button>
            </div>
            <div className='mx-[100px]'>
                <div className="flex gap-8 mb-4 justify-start items-center">
                    <span className="w-[100px]">업체명</span>
                    <input value={outsourcingName} onChange={(e)=>setOutsourcingName(e.target.value)} className="h-10 w-[472px] border rounded-md p-2 text-xs" placeholder="업체 이름"></input>
                </div>
                <div className="flex gap-8 mb-4 justify-start items-center">
                    <span className="w-[100px]">전화번호</span>
                    <input value={hp} onChange={(e)=>setHp(e.target.value)} className="h-10 w-[472px] border rounded-md p-2 text-xs" placeholder="업체 전화번호"></input>
                </div>
                <div className="flex gap-8 mb-4 justify-start items-center">
                    <span className="w-[100px]">대금지급일</span>
                    <select value={payment} onChange={(e)=>setPayment(e.target.value)} className="h-10 w-[110px] border rounded-md p-2 text-xs text-center">
                        <option>선택필수</option>
                        <option value={10}>10일</option>
                        <option value={20}>20일</option>
                        <option value={30}>30일</option>
                    </select>
                </div>
                <div className='flex gap-8 mb-4 justify-start items-center'>
                    <span className='w-[100px]'>파견종료일</span>
                    <input value={end} onChange={(e)=>setEnd(e.target.value)} className='h-10 w-[110px] border rounded-md p-2 text-xs' type='date'></input>
                </div>
                <div className='flex gap-8 mb-4 justify-start items-center'>
                    <span className='w-[100px]'>파견인원</span>
                    <input value={size} onChange={(e)=>setSize(e.target.value)} type='number' className='h-10 w-[110px] border rounded-md p-2 text-xs text-center'></input>
                </div>
                <div className="flex justify-end gap-2 mb-[50px]">
                    <button onClick={postOutsourcingHandler} className="bg-purple white w-[120px] h-[40px] rounded-md text-xs">등록</button>
                </div>
            </div>
        </div>
    </div>
  )
}
