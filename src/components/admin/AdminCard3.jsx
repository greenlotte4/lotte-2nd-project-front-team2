import React from 'react'
import { Link } from 'react-router-dom'

export const AdminCard3 = ({
  clickHandler,
  title,
  content,
  messanger,
  leader
}) => {

  if(!leader)return null;
  return (
    <div onClick={clickHandler} className='admin-card3 shadow-md rounded-md cursor-pointer'>
      <section className='flex justify-between mb-[20px]'>
        <div className='flex gap-2 items-center'>
            <img style={{width:'25px' , height:'25px'}} src='/images/admin-basic-icon.png' />
            <p className=''>{title}</p>
        </div>
        <div className='flex gap-2 items-center'>
            {/* <img src='/images/admin-verdot-icon.png'/> */}
            {/* <img src='/images/admin-star-icon.png'/> */}
        </div>
      </section>
      <section className='mb-[5px]'>
        {title === '진행도' &&
          <>
          <input className='w-full' type='range' max={1} value={content}></input>
          </>
        }
        {title === '부서장' &&
          <>
          <div className='mx-auto mb-[5px]'>
            <span className='mr-[10px]'>이름 : {leader.name} {leader.level}</span>
            <span className='text-gray-400'>{leader.email}</span>
          </div>
          <div className='text-[12px] flex flex-col gap-[2px]'>
            <div>업무 : {leader.title}</div>
            <div>유형 : {leader.type}</div>
            <div>진행상태 : {leader.status}</div>
          </div>
          </>
        }
        
        
      </section>
      {/* <section className='flex justify-between items-center'>
            {messanger}
        <button className='bg-blue-50 p-2 rounded-xl text-xs text-blue-500'>Zendesk</button>
      </section> */}
    </div>
  )
}

