import React from 'react'

export default function Select({selectOption, optionChanger}) {
  return (
    <div className='ml-4 text-xl'>
        <select value={selectOption} onChange={optionChanger} className='outline-none border rounded-md text-[15px] p-2 text-center'>
            <option value={0}>부서 / 팀 정보</option>
            <option value={1}>업무현황</option>
            <option value={2}>배정업무</option>
            <option value={3}>요청사항</option>
        </select>
    </div>
  )
}
