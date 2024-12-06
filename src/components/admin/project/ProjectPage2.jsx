import React from 'react'
import Page from '../../Page'
import Select from './Select'
import {CustomSearch} from '@/components/Search'
export default function ProjectPage2({optionChanger, selectOption}) {
  return (
    <>
      <section className='flex items-center gap-4 mb-12'>
                <Select
                    optionChanger={optionChanger}
                    selectOption={selectOption}
                />
                <div className='ml-auto flex'>
                    <CustomSearch 
                        width1='40'
                        width2='72'
                    />
                </div>
                <select className='text-center opacity-80 w-24 h-10 outline-none border'>
                    <option>직급</option>
                    <option>상태</option>
                    <option>업무</option>
                </select>
                <div>7 / 11</div>
            </section>
            <table className="w-full table-auto border-collapse mb-16">
            <thead className='bg-gray-200 h-16'>
                <tr className='text-center'>
                    <th className="w-1/12 rounded-tl-lg"><input type="checkbox" /></th>
                    <th className="w-1/12">번호</th>
                    <th className="w-2/12">이름</th>
                    <th className="w-2/12">배정</th>
                    <th className="w-1/12">상태</th>
                    <th className="w-2/12">마감일</th>
                    <th className="w-3/12 rounded-tr-lg">진행도</th>
                </tr>
            </thead>
            <tbody>
                <tr className='text-center h-12 border-b text-sm text-gray-500'>
                    <th className="w-1/12 rounded-tl-lg"><input type="checkbox" /></th>
                    <th className="w-1/12">1</th>
                    <th className="w-2/12">게시판 화면구현</th>
                    <th className="w-2/12">없음</th>
                    <th className="w-1/12">미배정</th>
                    <th className="w-2/12">2024-11-22</th>
                    <th className="w-3/12 rounded-tr-lg">
                        <div className='flex justify-around'>
                            <input className='w-8/12' type='range' max={100} value={85}></input>
                            <p>85%</p>
                        </div>
                    </th>
                </tr>
                <tr className='text-center h-12 border-b text-sm text-gray-500'>
                    <th className="w-1/12 rounded-tl-lg"><input type="checkbox" /></th>
                    <th className="w-1/12">1</th>
                    <th className="w-2/12">게시판 화면구현</th>
                    <th className="w-2/12">없음</th>
                    <th className="w-1/12">미배정</th>
                    <th className="w-2/12">2024-11-22</th>
                    <th className="w-3/12 rounded-tr-lg">
                        <div className='flex justify-around'>
                            <input className='w-8/12' type='range' max={100} value={85}></input>
                            <p>85%</p>
                        </div>
                    </th>
                </tr>
                <tr className='text-center h-12 border-b text-sm text-gray-500'>
                    <th className="w-1/12 rounded-tl-lg"><input type="checkbox" /></th>
                    <th className="w-1/12">1</th>
                    <th className="w-2/12">게시판 화면구현</th>
                    <th className="w-2/12">없음</th>
                    <th className="w-1/12">미배정</th>
                    <th className="w-2/12">2024-11-22</th>
                    <th className="w-3/12 rounded-tr-lg">
                        <div className='flex justify-around'>
                            <input className='w-8/12' type='range' max={100} value={85}></input>
                            <p>85%</p>
                        </div>
                    </th>
                </tr>
                <tr className='text-center h-12 border-b text-sm text-gray-500'>
                    <th className="w-1/12 rounded-tl-lg"><input type="checkbox" /></th>
                    <th className="w-1/12">1</th>
                    <th className="w-2/12">게시판 화면구현</th>
                    <th className="w-2/12">없음</th>
                    <th className="w-1/12">미배정</th>
                    <th className="w-2/12">2024-11-22</th>
                    <th className="w-3/12 rounded-tr-lg">
                        <div className='flex justify-around'>
                            <input className='w-8/12' type='range' max={100} value={85}></input>
                            <p>85%</p>
                        </div>
                    </th>
                </tr>
                <tr className='text-center h-12 border-b text-sm text-gray-500'>
                    <th className="w-1/12 rounded-tl-lg"><input type="checkbox" /></th>
                    <th className="w-1/12">1</th>
                    <th className="w-2/12">게시판 화면구현</th>
                    <th className="w-2/12">없음</th>
                    <th className="w-1/12">미배정</th>
                    <th className="w-2/12">2024-11-22</th>
                    <th className="w-3/12 rounded-tr-lg">
                        <div className='flex justify-around'>
                            <input className='w-8/12' type='range' max={100} value={85}></input>
                            <p>85%</p>
                        </div>
                    </th>
                </tr>
            </tbody>
        </table>    
        <section className='flex justify-between gap-4 text-xs mb-10'>
            <button className='bg-blue white h-10 rounded-md w-24 hover:opacity-60'>선택 삭제</button>
            <button onClick={null} className='bg-blue white h-10 rounded-md w-24 hover:opacity-60'>업무 등록</button>
        </section>
        <Page /> 
    </>
  )
}
